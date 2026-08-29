import { generateAIResponse } from '../server/aiProvider.js';
import { checkRateLimit } from '../server/rateLimiter.js';

export default async function handler(req, res) {
  // Set CORS and headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      response: 'Method Not Allowed'
    });
  }

  try {
    // Determine client IP for rate limiting
    const clientIp =
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress ||
      '127.0.0.1';

    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        response: rateLimit.reason
      });
    }

    // Parse body
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // use raw body
      }
    }

    const { message, history } = body || {};

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        response: 'Message prompt is required.'
      });
    }

    // Execute sequential AI provider fallback
    const result = await generateAIResponse(message.trim(), history || []);

    // Ensure we never return raw 500 error stack traces or API keys
    if (!result.success) {
      return res.status(200).json({
        success: false,
        response: result.response || "I'm having trouble connecting to my AI assistant right now. Please try again in a moment."
      });
    }

    return res.status(200).json({
      success: true,
      provider: result.provider,
      response: result.response
    });
  } catch (error) {
    console.error('[API /api/chat error]:', error.message);
    return res.status(200).json({
      success: false,
      response: "I'm having trouble connecting to my AI assistant right now. Please try again in a moment."
    });
  }
}
