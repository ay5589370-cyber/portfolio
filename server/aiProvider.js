import { portfolioData, PORTFOLIO_SYSTEM_PROMPT } from '../src/data/portfolioData.js';

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-120b';
const DEFAULT_OPENROUTER_MODEL = 'google/gemini-2.5-flash:free';

const FETCH_TIMEOUT_MS = 12000; // 12 seconds per provider attempt

/**
 * Helper to fetch with timeout
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * 1. Primary Provider: Gemini
 */
export async function generateWithGemini(userMessage, conversationHistory = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Format contents array for Gemini REST API
  const contents = [];

  // Format past conversation history if provided
  if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
    for (const msg of conversationHistory) {
      if (msg.role && msg.content) {
        const geminiRole = msg.role === 'assistant' ? 'model' : 'user';
        contents.push({
          role: geminiRole,
          parts: [{ text: msg.content }]
        });
      }
    }
  }

  // Append current user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  const payload = {
    system_instruction: {
      parts: [{ text: PORTFOLIO_SYSTEM_PROMPT }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 800
    }
  };

  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Gemini HTTP ${response.status}: ${errText.substring(0, 150)}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    throw new Error('Gemini returned an empty or malformed response');
  }

  return text.trim();
}

/**
 * 2. Fallback 1 Provider: Groq
 */
export async function generateWithGroq(userMessage, conversationHistory = []) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here' || apiKey.trim() === '') {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const model = process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL;
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const messages = [
    { role: 'system', content: PORTFOLIO_SYSTEM_PROMPT }
  ];

  if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
    for (const msg of conversationHistory) {
      if (msg.role && msg.content) {
        messages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        });
      }
    }
  }

  messages.push({ role: 'user', content: userMessage });

  const requestBody = {
    model: model,
    messages: messages,
    temperature: 0.5
  };

  if (model.startsWith('openai/gpt-oss-')) {
    requestBody.max_completion_tokens = 800;
    requestBody.reasoning_effort = 'low';
  } else {
    requestBody.max_tokens = 800;
  }

  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Groq HTTP ${response.status}: ${errText.substring(0, 150)}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    throw new Error('Groq returned an empty or malformed response');
  }

  return text.trim();
}

/**
 * 3. Fallback 2 Provider: OpenRouter
 */
export async function generateWithOpenRouter(userMessage, conversationHistory = []) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_openrouter_api_key_here' || apiKey.trim() === '') {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const model = process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;
  const url = 'https://openrouter.ai/api/v1/chat/completions';

  const messages = [
    { role: 'system', content: PORTFOLIO_SYSTEM_PROMPT }
  ];

  if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
    for (const msg of conversationHistory) {
      if (msg.role && msg.content) {
        messages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        });
      }
    }
  }

  messages.push({ role: 'user', content: userMessage });

  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://amit-yadav-portfolio.vercel.app',
      'X-Title': 'Amit Yadav AI Portfolio'
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.5,
      max_tokens: 800
    })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`OpenRouter HTTP ${response.status}: ${errText.substring(0, 150)}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    throw new Error('OpenRouter returned an empty or malformed response');
  }

  return text.trim();
}

/**
 * Central AI Provider Manager with Sequential Fallback
 * Gemini -> Groq -> OpenRouter -> Friendly Error
 */
export async function generateAIResponse(userMessage, conversationHistory = []) {
  const errors = [];

  // Attempt 1: Gemini
  try {
    const text = await generateWithGemini(userMessage, conversationHistory);
    return {
      success: true,
      provider: 'gemini',
      response: text
    };
  } catch (err) {
    console.warn(`[AI Provider Manager] Gemini attempt failed: ${err.message}`);
    errors.push({ provider: 'gemini', error: err.message });
  }

  // Attempt 2: Groq
  try {
    const text = await generateWithGroq(userMessage, conversationHistory);
    return {
      success: true,
      provider: 'groq',
      response: text
    };
  } catch (err) {
    console.warn(`[AI Provider Manager] Groq attempt failed: ${err.message}`);
    errors.push({ provider: 'groq', error: err.message });
  }

  // Attempt 3: OpenRouter
  try {
    const text = await generateWithOpenRouter(userMessage, conversationHistory);
    return {
      success: true,
      provider: 'openrouter',
      response: text
    };
  } catch (err) {
    console.warn(`[AI Provider Manager] OpenRouter attempt failed: ${err.message}`);
    errors.push({ provider: 'openrouter', error: err.message });
  }

  // All 3 providers failed
  console.error('[AI Provider Manager] All AI providers failed sequential fallback.', errors);
  return {
    success: true,
    provider: 'portfolio-fallback',
    response: generateLocalPortfolioResponse(userMessage)
  };
}

function generateLocalPortfolioResponse(userMessage) {
  const message = userMessage.toLowerCase();
  const { personalInfo, skills, projects, education, profiles } = portfolioData;

  if (message.includes('study') || message.includes('studymind')) {
    const project = projects.find((item) => item.id === 'studymind-ai');
    return `${project.title} is ${project.description} Key features include ${project.features.slice(0, 4).join(', ')}. Live demo: ${project.liveDemo}`;
  }

  if (message.includes('cpu') || message.includes('scheduling') || message.includes('visualizer')) {
    const project = projects.find((item) => item.id === 'cpu-visualizer');
    return `${project.title} is ${project.description} It supports ${project.algorithms.slice(0, 5).join(', ')}. Live demo: ${project.liveDemo}`;
  }

  if (message.includes('skill') || message.includes('technology') || message.includes('tech stack')) {
    return `Amit works across ${skills.map((group) => `${group.category}: ${group.items.join(', ')}`).join('; ')}.`;
  }

  if (message.includes('education') || message.includes('college') || message.includes('university') || message.includes('degree')) {
    const currentEducation = education[0];
    return `Amit is pursuing ${currentEducation.degree} at ${currentEducation.institution} (${currentEducation.duration}). His academic focus includes ${currentEducation.highlights.join(', ')}.`;
  }

  if (message.includes('contact') || message.includes('email') || message.includes('hire') || message.includes('available')) {
    return `You can contact Amit at ${personalInfo.email}. He is ${personalInfo.availability}. GitHub: ${profiles.github} LeetCode: ${profiles.leetcode}`;
  }

  if (message.includes('project') || message.includes('portfolio') || message.includes('work')) {
    return `Amit's selected projects are ${projects.map((project) => `${project.title}, ${project.category}`).join(' and ')}. They show his work across AI learning products, React interfaces, and interactive computer science tools.`;
  }

  return `${personalInfo.name} is a ${personalInfo.title}. ${personalInfo.bio} His portfolio highlights AI-enabled web apps, React interfaces, serverless APIs, and computer science visualizers. You can reach him at ${personalInfo.email}.`;
}
