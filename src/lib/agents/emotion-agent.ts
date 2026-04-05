import OpenAI from "openai";

export interface EmotionAnalysis {
  sentiment: "positive" | "negative" | "neutral";
  signals: string[];
}

export async function detectEmotions(text: string, openai: OpenAI): Promise<EmotionAnalysis> {
  const prompt = `You are the Emotion Detection Agent.
Task: Detect the core emotional signals from the user's text.
Focus on identifying: Stress, Anxiety, Loneliness, Fatigue, Joy, Peace, Overwhelm, Sadness, Burnout.
Respond ONLY with a JSON object in this exact structure:
{
  "sentiment": "positive" | "negative" | "neutral",
  "signals": ["array", "of", "detected", "emotions", "e.g.", "stress", "anxiety"]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text }
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  if (!content) return { sentiment: "neutral", signals: ["unknown"] };
  try {
    return JSON.parse(content) as EmotionAnalysis;
  } catch {
    return { sentiment: "neutral", signals: [] };
  }
}
