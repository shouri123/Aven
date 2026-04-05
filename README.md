# Aven | AI Mental Wellness Agent

Aven is a minimalist, chat-first mental wellness companion powered by the **Multi-Agent Mental Wellness Architecture (MAMWA)**. It provides a quiet, observant, and progressively intelligent space for self-reflection while ensuring strictly verified, logic-driven responses.

## 🧠 Core Philosophy & Architecture (MAMWA)

Unlike traditional monolithic AI chatbots that suffer from hallucinations and safety risks, Aven utilizes a hierarchical multi-agent framework. As you share your thoughts, the input is pipelined through six distinct autonomous nodes:

1. **Risk Agent**: Scans inputs heuristically for crisis/suicide risks, short-circuiting generative models instantly on danger.
2. **Emotion Agent**: Extracts highly granular emotional signals via constrained LLM arrays.
3. **Memory Agent**: Injects client-side long-term statistical context.
4. **Pattern Agent**: Identifies multi-day burnout or anxiety loops.
5. **Reasoning Agent**: Synthesizes the signals mathematically to produce logical, non-diagnostic wellness steps.
6. **Response Agent**: Converses with warm, empathic, high-temperature dialog guided strictly by the Reasoning Agent's factual deductions.

## 🚀 Key Features

* **AI Reasoning Transparency**: Users can view the exact logical path the agent took using an interactive "Reasoning Panel" embedded in the UI.
* **Proactive Intelligence**: The AI actively checks in if local memory detects multiple days of consecutive stress.
* **Progressive Disclosure**:
  * **3 Entries**: Unlocks AI-driven Emotional Insights.
  * **5 Entries**: Unlocks the Wellness Dashboard.
  * **7 Entries**: Unlocks Deep Medical Guidance.
* **Local-First Security**: Authentication and vector storage occurs entirely within your browser's `localStorage`. No centralized databases process your mental well-being.
* **Premium Design**: Built with Tailwind CSS, featuring glassmorphism and smooth micro-animations.

## 🛠️ Technology Stack

* **Framework**: Next.js (App Router)
* **Architecture**: MAMWA (Custom Multi-Agent Pipeline)
* **AI Model**: OpenAI `gpt-3.5-turbo`
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Persistence**: Client-side LocalStorage

## 🏗️ Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shouri123/AURA.git aven-wellness
   cd aven-wellness
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env.local` file at the root level and provide your exact OpenAI API Key:
   ```env
   OPENAI_API_KEY=your_key_here
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Open Browser**:
   Visit [http://localhost:3000](http://localhost:3000)

## 🔒 Security & Medical Guardrails

Aven is fundamentally designed to be a wellness companion, not a medical professional. The System Prompts explicitly ban diagnostic language and pharmaceutical recommendations. Furthermore, the **Risk Agent** natively provides hotlines and fallback mechanisms in a fraction of a second when extreme distress is logged, entirely bypassing generative models for absolute safety.

---
*Aven — Evolving with your mind.*
