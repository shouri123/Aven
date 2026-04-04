export type EmotionSignal = 'anxiety' | 'stress' | 'loneliness' | 'burnout' | 'calm' | 'neutral' | 'depression' | string;

export interface WellnessAnalysis {
  summary: string;
  insight: string;
  emotions: { label: string; score: number }[];
  severity: 'low' | 'moderate' | 'high';
  isCrisis?: boolean;
}

export async function analyzeWellness(text: string): Promise<WellnessAnalysis> {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze wellness");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Wellness Service Error:", error);
    // Fallback to a neutral result if API fails (e.g. no API key)
    return {
      summary: "System Reflection",
      insight: "We're having trouble connecting to our AI brain. Please make sure your OpenAI API key is configured in .env.local.",
      emotions: [
        { label: 'Neutral', score: 1 }
      ],
      severity: 'low'
    };
  }
}
