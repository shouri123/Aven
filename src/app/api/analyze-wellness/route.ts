import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { evaluateRisk } from '@/lib/agents/risk-agent';
import { detectEmotions } from '@/lib/agents/emotion-agent';
import { formatMemoryContext } from '@/lib/agents/memory-agent';
import { formatPatternInsights } from '@/lib/agents/pattern-agent';
import { synthesizeReasoning } from '@/lib/agents/reasoning-agent';
import { generateResponse } from '@/lib/agents/response-agent';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  let text = "";
  try {
    const body = await req.json();
    text = body.text;
    const userName = body.userName || "friend";
    
    // 1. Check API Key
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

    // 2. Risk Agent Subsystem (Short-circuit for safety)
    const riskAnalysis = evaluateRisk(text);
    if (riskAnalysis.isCrisis) {
      return NextResponse.json({
        sentiment: 'negative',
        detectedSignals: riskAnalysis.riskSignals,
        reflection: `${userName}, it sounds like you're carrying a heavy burden. Please know you don't have to face this alone. Reach out to iCall (9152987821) or Vandrevala Foundation (9999666555) for immediate support.`,
        recommendations: ["Call iCall: 9152987821 (Mon-Sat 8am-10pm)", "Call Vandrevala Foundation: 9999666555 (24/7)", "Reach out to a trusted person near you"],
        severity: riskAnalysis.severity,
        isCrisis: true,
        reasoning: ["[RISK AGENT OVERRIDE] " + riskAnalysis.riskSignals[0]],
        patternInsights: [],
        wellnessGuidance: [],
      });
    }

    // 3. Formulate Local Context via Context Agents
    const memoryContext = formatMemoryContext(userName, body.memoryContext);
    const patternContext = formatPatternInsights(body.patternContext);

    // 4. Emotion Agent
    const emotionData = await detectEmotions(text, openai);

    // 5. Reasoning Agent
    const reasoningData = await synthesizeReasoning(
      text,
      emotionData,
      memoryContext,
      patternContext,
      openai
    );
    console.log('Reasoning synthesis complete');

    // 6. Response Synthesis
    const finalResponse = await generateResponse(text, userName, reasoningData.conclusion, openai);
    console.log('Final Response generated');

    return NextResponse.json({
      sentiment: emotionData.sentiment,
      detectedSignals: emotionData.signals,
      reflection: finalResponse,
      recommendations: reasoningData.recommendations,
      severity: reasoningData.severity,
      isCrisis: false,
      reasoning: reasoningData.reasoningSteps,
      wellnessGuidance: [],
      patternInsights: body.patternContext || []
    });

  } catch (error: any) {
    console.error('Orchestrator Pipeline Error:', error);
    const riskCheck = evaluateRisk(text);
    
    let errorMessage = "An unexpected error occurred.";
    if (error.status === 401) {
      errorMessage = "Invalid OpenAI API Key. Please update your .env.local file with a valid key.";
    } else if (error.status === 429) {
      errorMessage = "OpenAI Quota Exceeded or Rate Limited. Please check your billing/usage.";
    } else if (error.message) {
      errorMessage = `API Error: ${error.message}`;
    }

    return NextResponse.json({
      sentiment: riskCheck.isCrisis ? 'negative' : 'neutral',
      detectedSignals: [riskCheck.isCrisis ? 'distress' : 'error'],
      reflection: riskCheck.isCrisis
        ? "Please know you don't have to face this alone. Reach out to iCall (9152987821) for immediate support."
        : errorMessage,
      severity: riskCheck.isCrisis ? 5 : 2,
      isCrisis: riskCheck.isCrisis,
      reasoning: [riskCheck.isCrisis ? "Crisis protocol triggered" : "System: Error handled"],
      wellnessGuidance: [],
      recommendations: ["Error encountered", "Please try again later"]
    });
  }
}
