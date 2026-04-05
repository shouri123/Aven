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
  const prompt = `You are the Reasoning Agent in a Multi-Agent Mental Wellness Architecture.
Synthesize the user's current input, emotional signals, history, and behavioral patterns to deduce their core immediate issue. Determine an appropriate severity level (1-5) and generate exactly 3 specific, actionable wellness recommendations. 
IMPORTANT: Never diagnose or prescribe.

Input data to synthesize:
- User Message: "${text}"
- Detected Emotions: ${JSON.stringify(emotionData)}
- Memory Context: ${memoryContext}
- Behavioral Patterns: ${patternContext}

Respond ONLY with a JSON object in this exact structure:
{
  "conclusion": "A single sentence concluding the user's primary psychological state right now.",
  "reasoningSteps": [
    "Step 1: Analyzed current emotion vs past memory...",
    "Step 2: Evaluated pattern consistency...",
    "Step 3: Logic leading to conclusion..."
  ],
  "recommendations": ["Actionable tip 1", "Actionable tip 2", "Actionable tip 3"],
  "severity": <number between 1 and 5>
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.5,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Reasoning Agent failed to synthesize");
  return JSON.parse(content) as ReasoningAnalysis;
}
