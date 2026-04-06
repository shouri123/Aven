import OpenAI from "openai";
import { EmotionAnalysis } from "./emotion-agent";

export interface ReasoningAnalysis {
  conclusion: string;
  reasoningSteps: string[];
  recommendations: string[];
  severity: number;
}

export async function synthesizeReasoning(
  text: string,
  emotionData: EmotionAnalysis,
  memoryContext: string,
  patternContext: string,
  openai: OpenAI
): Promise<ReasoningAnalysis> {
  const systemPrompt = `You are the Reasoning Agent in a Multi-Agent Mental Wellness Architecture.
Task: Synthesize the user's input, emotional signals, history, and behavioral patterns to deduce their core immediate issue. 
Determine an appropriate severity level (1-5) and generate exactly 3 specific, actionable wellness recommendations. 

IMPORTANT: Never diagnose or prescribe medication.

Respond ONLY with a JSON object in this exact structure:
{
  "conclusion": "A single sentence concluding the user's primary psychological state right now.",
  "reasoningSteps": ["Step 1...", "Step 2...", "Step 3..."],
  "recommendations": ["Actionable tip 1", "Actionable tip 2", "Actionable tip 3"],
  "severity": <number between 1 and 5>
}`;

  const userData = `
Input to synthesize:
- User Message: "${text}"
- Detected Emotions: ${JSON.stringify(emotionData)}
- Memory Context: ${memoryContext}
- Behavioral Patterns: ${patternContext}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userData }
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Reasoning Agent failed to synthesize");
  try {
    return JSON.parse(content) as ReasoningAnalysis;
  } catch (error) {
    console.error("Reasoning Agent Parse Error:", error);
    throw error;
  }
}
