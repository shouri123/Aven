import OpenAI from "openai";

export interface EmotionAnalysis {
  sentiment: "positive" | "negative" | "neutral";
  signals: string[];
}

export async function detectEmotions(text: string, openai: OpenAI): Promise<EmotionAnalysis> {
  const systemPrompt = `You are the Emotion Detection Agent in a Multi-Agent Mental Wellness Architecture.
Task: Analyze the user's input and detect core emotional signals.
Focus on identifying: Stress, Anxiety, Loneliness, Fatigue, Joy, Peace, Overwhelm, Sadness, Burnout.

Respond ONLY with a JSON object in this exact structure:
{
  "sentiment": "positive" | "negative" | "neutral",
  "signals": ["array", "of", "detected", "emotions"]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Analyze this text: "${text}"` }
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
  });

  const content = response.choices[0].message.content;
  if (!content) return { sentiment: "neutral", signals: ["unknown"] };
  try {
    return JSON.parse(content) as EmotionAnalysis;
  } catch (error) {
    console.error("Emotion Agent Parse Error:", error);
    return { sentiment: "neutral", signals: [] };
  }
}
