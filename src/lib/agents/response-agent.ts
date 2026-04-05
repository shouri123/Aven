import OpenAI from "openai";

export async function generateResponse(
  userName: string,
  text: string,
  reasoningConclusion: string,
  openai: OpenAI
): Promise<string> {
  const prompt = `You are the Response Agent in a Multi-Agent Mental Wellness Architecture.
Task: Draft a warm, empathic, safe conversational reply to the user.
Guidelines:
- Address the user by their name ("${userName}") naturally in the text.
- Your reply must feel like a real conversational companion, NOT a clinical report.
- Base your empathy strictly on this clinical conclusion from the Reasoning Agent: "${reasoningConclusion}"
- Directly acknowledge what they said in: "${text}"
- DO NOT list out recommendations with bullet points (that is handled by the UI). Just provide the conversational response.
- Start directly with your response text.

Respond ONLY with a JSON object in this exact structure:
{
  "response": "Your compassionate response text here."
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) return `I hear you, ${userName}. I am here for you.`;
  const parsed = JSON.parse(content);
  return parsed.response;
}
