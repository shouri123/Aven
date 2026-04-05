import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  let text = "";
  try {
    const body = await req.json();
    text = body.text;
    const userName = body.userName || "friend";
    const memoryContext = body.memoryContext || "";
    const patternContext = body.patternContext || "";
    const crisisLevel = body.crisisLevel || "none";
    const entryCount = body.entryCount || 0;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        sentiment: 'neutral',
        detectedSignals: ['system'],
        reflection: `Hi ${userName}, Aven is in bridge mode. Configure your API key to enable deep reflection.`,
        recommendations: ["Configure OpenAI API Key", "Check .env.local"],
        severity: 1,
        isCrisis: false,
        reasoning: ["System: No API key configured"],
        patternInsights: [],
        wellnessGuidance: [],
      });
    }

    const systemPrompt = `You are "Aven," an advanced AI mental wellness companion — not a chatbot. You have a warm, empathetic personality. You REMEMBER the user and their history.

CORE IDENTITY:
- You are a caring companion named Aven
- You always address the user by their name: "${userName}"
- You reference their past entries and patterns when relevant
- You adapt your tone based on the emotional context
- You provide UNIQUE, SPECIFIC responses — NEVER generic template answers
- Each response must directly address what the user expressed

MEMORY & CONTEXT:
${memoryContext || "This is a new user. Welcome them warmly."}

${patternContext || ""}

CURRENT CRISIS LEVEL: ${crisisLevel}
${crisisLevel === 'critical' ? 'CRITICAL: User may be in danger. Respond with extreme care, validate feelings, and gently guide toward professional help. Include crisis hotline numbers.' : ''}
${crisisLevel === 'alert' ? 'ALERT: User is expressing significant distress. Use a gentle, validating tone. Mention that professional support is available.' : ''}

RESPONSE RULES:
1. PERSONALIZE: Use "${userName}" naturally in your response. Reference their specific situation.
2. UNIQUE RESPONSE: Your reply must directly address the SPECIFIC content and emotions in their message. Never give a generic "I hear you" response.
3. CONTEXT-AWARE: If they mentioned stress about exams → ask about exams specifically. If lonely → ask about their social connections. If sleep issues → ask about their sleep routine.
4. PATTERN-AWARE: If you see patterns from memory (e.g., repeated stress), mention it: "You've mentioned stress several times now, ${userName}..."
5. MEDICAL WELLNESS: Provide specific, actionable wellness guidance relevant to their current issue (sleep hygiene for sleep problems, breathing techniques for anxiety, etc.). NEVER diagnose or prescribe medication.
6. ALWAYS recommend consulting a healthcare professional if issues persist — this is guidance, not treatment.
7. REASONING: Show your analytical thought process step by step.

GUARDRAILS (STRICT):
- NEVER diagnose any mental health condition
- NEVER prescribe or recommend specific medications
- NEVER replace a doctor or therapist
- NEVER provide emergency medical advice
- Always suggest professional help for persistent issues
- For crisis situations, immediately provide crisis hotline numbers (iCall: 9152987821, Vandrevala Foundation: 9999666555)

TOTAL ENTRIES SO FAR: ${entryCount}

Respond with ONLY a JSON object:
{
  "sentiment": "positive" | "negative" | "neutral",
  "detectedSignals": ["specific emotional signals detected"],
  "reflection": "Your personalized, unique response to ${userName} addressing their specific situation",
  "recommendations": ["3 specific, actionable recommendations tailored to their current issue"],
  "severity": 1-5,
  "isCrisis": boolean,
  "reasoning": ["Step 1: What tone/emotion I detected...", "Step 2: Signals identified...", "Step 3: Pattern analysis...", "Step 4: My conclusion..."],
  "patternInsights": ["Any patterns noticed from memory context"],
  "wellnessGuidance": ["Specific medical wellness tips relevant to their issue — sleep tips for sleep problems, breathing for anxiety, etc."]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${userName} says: "${text}"` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8, // Higher temperature for more varied responses
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from AI");
    
    const parsed = JSON.parse(content);
    
    // Ensure all fields exist
    return NextResponse.json({
      sentiment: parsed.sentiment || 'neutral',
      detectedSignals: parsed.detectedSignals || [],
      reflection: parsed.reflection || `I hear you, ${userName}. Let me process what you've shared.`,
      recommendations: parsed.recommendations || [],
      severity: parsed.severity || 2,
      isCrisis: parsed.isCrisis || false,
      reasoning: parsed.reasoning || [],
      patternInsights: parsed.patternInsights || [],
      wellnessGuidance: parsed.wellnessGuidance || [],
    });

  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    const isCrisis = text.toLowerCase().includes('give up') || text.toLowerCase().includes('end it') || text.toLowerCase().includes('suicide');
    return NextResponse.json({
      sentiment: isCrisis ? 'negative' : 'neutral',
      detectedSignals: [isCrisis ? 'distress' : 'error'],
      reflection: isCrisis
        ? "It sounds like you're carrying a heavy burden. Please know you don't have to face this alone. Reach out to iCall (9152987821) or Vandrevala Foundation (9999666555) for immediate support."
        : `API Error occurred: ${error.message || "Unknown Error"}. Please check your terminal or OpenAI account.`,
      recommendations: isCrisis
        ? ["Call iCall: 9152987821 (Mon-Sat 8am-10pm)", "Call Vandrevala Foundation: 9999666555 (24/7)", "Reach out to a trusted person near you"]
        : ["Check your OpenAI configuration", "Check your terminal for exact logs"],
      severity: isCrisis ? 5 : 2,
      isCrisis,
      reasoning: [isCrisis ? "Crisis language detected in text" : `Processing entry failed with error: ${error.message}`],
      patternInsights: [],
      wellnessGuidance: [],
    });
  }
}
