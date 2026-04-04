import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  let text = "";
  try {
    const body = await req.json();
    text = body.text;
    const previousEntries = body.previousEntries || "";

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        sentiment: 'neutral',
        detectedSignals: ['system'],
        reflection: "Aven is in bridge mode. Configure your API key to enable deep reflection.",
        recommendations: ["Configure OpenAI API Key", "Check .env.local"],
        severity: 1,
        isCrisis: false
      });
    }

    const contextBlock = previousEntries
      ? `\nThe user has written these previous entries (use them to detect patterns):\n"""${previousEntries}"""\n`
      : "";

    const prompt = `
You are the Emotional Intelligence engine of "Aven," a proactive mental wellness AI agent.
${contextBlock}
Analyze the following NEW entry from the user: "${text}"

Reasoning Steps:
1. Read: Understand the emotional tone, subtext, and any recurring themes from previous entries.
2. Detect: Identify specific emotional signals (anxiety, stress, loneliness, burnout, joy, calm, depression, etc.).
3. Reflect: Provide a compassionate, insightful reflection. Validate feelings. If patterns emerge across entries, mention them.
4. Recommend: Suggest 3 practical, actionable wellness recommendations.
5. SAFETY CHECK: If self-harm ideation, suicidal thoughts, or medical crisis detected:
   - Set "isCrisis" to true
   - Override reflection with supportive message pointing to immediate help
   - Override recommendations with crisis hotline info (iCall: 9152987821, Vandrevala: 9999666555)

Return ONLY a JSON object:
{
  "sentiment": "positive" | "negative" | "neutral",
  "detectedSignals": ["anxiety", "stress", etc.],
  "reflection": "string - compassionate AI reflection",
  "recommendations": ["string"],
  "severity": 1-5,
  "isCrisis": boolean
}

STRICT: No medical diagnoses. Stay within mental wellness support scope.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional mental wellness triage agent. You observe patterns across entries. Respond only with valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from AI");
    return NextResponse.json(JSON.parse(content));

  } catch (error: unknown) {
    console.error('AI Analysis Error:', error);
    const isCrisis = text.toLowerCase().includes('give up') || text.toLowerCase().includes('end it');
    return NextResponse.json({
      sentiment: isCrisis ? 'negative' : 'neutral',
      detectedSignals: [isCrisis ? 'distress' : 'reflection'],
      reflection: isCrisis
        ? "It sounds like you're carrying a heavy burden. Please know you don't have to face this alone. Reach out for support."
        : "I've processed your thoughts. You're navigating complex emotions — taking a moment to reflect is a brave step.",
      recommendations: isCrisis
        ? ["Call iCall: 9152987821", "Reach out to a trusted friend", "Go to a safe place"]
        : ["Take 5 deep breaths", "Drink a glass of water", "Write one thing you're grateful for"],
      severity: isCrisis ? 5 : 2,
      isCrisis
    });
  }
}
