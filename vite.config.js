import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function addResponseHelpers(res) {
  res.status = function (statusCode) {
    res.statusCode = statusCode;
    return res;
  };
  res.json = function (obj) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
    return res;
  };
}

function readJsonBody(req, callback) {
  let bodyStr = '';
  req.on('data', chunk => {
    bodyStr += chunk;
  });
  req.on('end', () => {
    try {
      req.body = JSON.parse(bodyStr || '{}');
    } catch (e) {
      req.body = {};
    }
    callback();
  });
}

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');
  // Populate process.env so API provider modules can read process.env.GEMINI_API_KEY, etc.
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'local-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const pathname = req.url?.split('?')[0];
            if (pathname !== '/api/chat') {
              return next();
            }

            addResponseHelpers(res);
            readJsonBody(req, async () => {
              const { default: handler } = await import('./api/chat.js');
              await handler(req, res);
            });
          });
        }
      }
    ],
    server: {
      port: 3000,
      host: true
    }
  };
});
