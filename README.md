# Amit Yadav — Production-Ready AI Developer Portfolio

An interactive, high-performance developer portfolio featuring **Ask Amit AI** and a working EmailJS contact form.

---

## 🚀 Key Features

- **Ask Amit AI Assistant**: Interactive portfolio chatbot with Web Speech API voice input and voice synthesis output.
- **Secure Multi-Provider AI Fallback**:
  - `User → /api/chat → Gemini → Groq → OpenRouter → Response`
  - Automatic error recovery (handles 401, 403, 429, 500, timeouts, and network failures).
  - Rate limit protection (max 15 requests/min per IP).
- **CPU Scheduling Visualizer**: Embedded interactive simulator supporting FCFS, SJF, SRTF, Round Robin, and Priority Scheduling algorithms with Gantt chart generation and performance metrics.
- **StudyMind AI Showcase**: Featured showcase of the AI learning platform with live demo link.
- **Direct Contact Form**: Sends portfolio inquiries through EmailJS to Gmail without opening an external mail app.
- **Verified Profiles**: Verified direct links to GitHub (`ay5589370-cyber`) and LeetCode (`7kyE953dD4`).
- **Glassmorphic UI Design**: Sleek dark mode theme built with Vanilla CSS variables and responsive glassmorphism.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS
- **Backend / API**: Vercel Serverless Functions (`/api/chat`), Node.js
- **Email Delivery**: EmailJS
- **AI Providers**: Google Gemini API, Groq Cloud API, OpenRouter API
- **Browser APIs**: Web Speech Recognition & SpeechSynthesis APIs

---

## 🔐 Environment Variables

Create a local `.env` file in the root directory using the template provided in `.env.example`:

```env
# Primary AI Provider
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.5-flash

# Fallback 1 AI Provider
GROQ_API_KEY=your_key
GROQ_MODEL=openai/gpt-oss-120b

# Fallback 2 AI Provider
OPENROUTER_API_KEY=your_key
OPENROUTER_MODEL=google/gemini-2.5-flash:free

```

> [!IMPORTANT]
> **Security Note**: Never commit actual secret API keys to GitHub or expose them in client-side code. AI provider keys are used only inside server-side functions. The EmailJS public key used by the contact form is intentionally public.

---

## 💻 Local Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and paste your newly rotated API keys:
   ```bash
   cp .env.example .env
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser. The local dev server automatically handles `/api/chat` through Vite server middleware.

4. **Production Build Verification**:
   ```bash
   npm run build
   ```

---

## 🌐 Vercel Deployment Instructions

1. Push your code to GitHub (ensure `.env` is **NOT** committed).
2. Connect your repository to **Vercel**.
3. In the Vercel Dashboard under **Project Settings → Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
   - `OPENROUTER_API_KEY`
   - *(Optional)* `GEMINI_MODEL`, `GROQ_MODEL`, `OPENROUTER_MODEL`
4. Make sure the EmailJS service `service_mvjc47j` and template `template_rvnrkik` are active in your EmailJS dashboard.
5. Deploy! Vercel will automatically route `/api/chat` to its serverless function.

---

## 🏗️ AI Architecture & Fallback Flow

```
Client (Browser)
   ↓ POST /api/chat
Vercel Serverless API / Rate Limiter
   ↓
AI Provider Manager (server/aiProvider.js)
   ├─► 1. Attempt Gemini (Primary)
   │      └─► Success → Return JSON Response
   ├─► 2. If Gemini fails (401/403/429/500/timeout) → Attempt Groq (Fallback 1)
   │      └─► Success → Return JSON Response
   └─► 3. If Groq fails → Attempt OpenRouter (Fallback 2)
          └─► Success → Return JSON Response
          └─► Failure → Friendly User Fallback Error
```

Maximum 1 attempt per provider (3 attempts total max per user message).
