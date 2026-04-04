# Aven | AI Mental Wellness Agent

Aven is a minimalist, chat-first mental wellness companion designed to provide a quiet, observant, and progressively intelligent space for self-reflection.

## 🧠 Core Philosophy

Unlike traditional wellness trackers, Aven doesn't start with dashboards or questionnaires. It begins with a simple conversation. As you share your thoughts, Aven's AI engine (powered by GPT-4o-mini) listens, learns, and slowly unlocks deeper insights, medical guidance, and data visualizations.

## 🚀 Key Features

- **Agentic UX**: A quiet observer that comes alive based on interaction.
- **Progressive Disclosure**:
  - **3 Entries**: Unlocks AI-driven Emotional Insights.
  - **5 Entries**: Unlocks the Wellness Dashboard.
  - **7 Entries**: Unlocks Deep Medical Guidance.
- **Local-First Security**: Self-contained authentication and data storage in `localStorage`.
- **Premium Design**: Built with Tailwind CSS v4, featuring glassmorphism and smooth micro-animations.

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **AI**: OpenAI API
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage (UserID isolated)

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
   Create a `.env.local` file:
   ```env
   OPENAI_API_KEY=your_key_here
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Open Browser**:
   Visit [http://localhost:3000](http://localhost:3000)

## 🔒 Security & Privacy

Aven is designed with privacy in mind. All entries are stored locally in your browser. Authentication is handled using SHA-256 password hashing on the client side.

---
*Aven — Evolving with your mind.*
