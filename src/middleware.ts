import type { MiddlewareHandler } from 'astro';
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';

/**
 * Hono API application
 * This runs alongside the Astro SSR in the same worker
 */
const api = new OpenAPIHono<{ Bindings: Env }>();

// Health check route
api.get('/api/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'connected',
  });
});

// OpenAPI documentation
api.doc('/openapi.json', (c) => ({
  openapi: '3.1.0',
  info: {
    title: 'Workspace Agent API',
    version: '1.0.0',
    description: 'REST API for Workspace Agent - Google Workspace orchestration platform',
  },
  servers: [
    {
      url: c.env.APP_URL,
      description: 'Production server',
    },
  ],
}));

// Swagger UI
api.get('/swagger', swaggerUI({ url: '/openapi.json' }));

/**
 * Astro middleware to handle API routes with Hono
 */
export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, locals } = context;
  const url = new URL(request.url);

  // If the path starts with /api, /openapi.json, or /swagger, use Hono
  if (
    url.pathname.startsWith('/api') ||
    url.pathname === '/openapi.json' ||
    url.pathname === '/swagger'
  ) {
    // Pass the runtime (locals.runtime) to Hono
    const response = await api.fetch(request, locals.runtime.env as Env);
    return response;
  }

  // Otherwise, continue with Astro
  return next();
};
