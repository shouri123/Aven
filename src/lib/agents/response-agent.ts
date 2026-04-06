import OpenAI from "openai";

export async function generateResponse(
  userName: string,
  text: string,
  reasoningConclusion: string,
  openai: OpenAI
): Promise<string> {
  const systemPrompt = `You are Aven, a thoughtful and deeply empathetic mental wellness companion. 
Your goal is to provide a warm, non-judgmental, and validating response to the user.
Base your tone on the Reasoning Agent's conclusion, but speak naturally as a companion.
IMPORTANT: Never offer medical diagnoses or clinical advice.

Respond ONLY with a JSON object in this exact structure:
{
  "response": "Your compassionate response text here."
}`;

  const userData = `
Context for response:
- User's Name: ${userName}
- User's Message: "${text}"
- Reasoning Conclusion: ${reasoningConclusion}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userData }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) return `I hear you, ${userName}. I am here for you.`;
  try {
    const parsed = JSON.parse(content);
    return parsed.response || `I hear you, ${userName}. I am here for you.`;
  } catch (error) {
    console.error("Response Agent Parse Error:", error);
    return `I hear you, ${userName}. I am here for you.`;
  }
}
