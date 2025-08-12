import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './utils/db.js';
import { authenticateToken, requireAdmin } from './middleware/auth.js';

// Load environment variables
dotenv.config();

// Import serverless functions for testing
import registerHandler from './api/auth/register.js';
import loginHandler from './api/auth/login.js';

// Import route handlers
import sweetsHandler from './api/sweets.js';
import sweetsSearchHandler from './api/sweets/search.js';
import sweetsIdHandler from './api/sweets/[id].js';
import sweetsPurchaseHandler from './api/sweets/[id]/purchase.js';
import sweetsRestockHandler from './api/sweets/[id]/restock.js';

export function createApp() {
  const app = express();

  // CORS Configuration - use environment variables
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'https://sweet-shop-frontend.vercel.app',
      ];

  console.log('🔧 CORS allowed origins:', allowedOrigins);
  console.log('🌍 Node environment:', process.env.NODE_ENV);

  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // In development, be more permissive
      if (
        process.env.NODE_ENV === 'development' ||
        allowedOrigins.indexOf(origin) !== -1
      ) {
        console.log(`✅ CORS allowed origin: ${origin}`);
        callback(null, true);
      } else {
        console.log(`❌ CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json());

  // Initialize database connection
  app.use(async (req, res, next) => {
    try {
      await connectToDatabase();
      next();
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).json({ error: 'Database connection failed' });
    }
  });

  // Wrapper function to simulate Vercel's serverless environment
  const wrapHandler = handler => async (req, res) => {
    // Simulate Vercel's req/res objects
    const vercelReq = {
      ...req,
      method: req.method,
      body: req.body,
      query: req.query,
      headers: req.headers,
    };

    const vercelRes = {
      status: code => ({
        json: data => res.status(code).json(data),
        send: data => res.status(code).send(data),
      }),
      json: data => res.json(data),
      send: data => res.send(data),
    };

    return handler(vercelReq, vercelRes);
  };

  // Auth routes - mapping to serverless functions
  app.post('/api/auth/register', wrapHandler(registerHandler));
  app.post('/api/auth/login', wrapHandler(loginHandler));

  // Sweet routes - mapping to serverless functions
  app.get('/api/sweets/search', wrapHandler(sweetsSearchHandler));
  app.get(
    '/api/sweets/:id/purchase',
    wrapHandler((req, res) => {
      // Convert Express params to Vercel query format
      req.query = { ...req.query, id: req.params.id };
      return sweetsPurchaseHandler(req, res);
    })
  );
  app.post(
    '/api/sweets/:id/purchase',
    wrapHandler((req, res) => {
      // Convert Express params to Vercel query format
      req.query = { ...req.query, id: req.params.id };
      return sweetsPurchaseHandler(req, res);
    })
  );
  app.get(
    '/api/sweets/:id/restock',
    wrapHandler((req, res) => {
      // Convert Express params to Vercel query format
      req.query = { ...req.query, id: req.params.id };
      return sweetsRestockHandler(req, res);
    })
  );
  app.post(
    '/api/sweets/:id/restock',
    wrapHandler((req, res) => {
      // Convert Express params to Vercel query format
      req.query = { ...req.query, id: req.params.id };
      return sweetsRestockHandler(req, res);
    })
  );
  app.get(
    '/api/sweets/:id',
    wrapHandler((req, res) => {
      // Convert Express params to Vercel query format
      req.query = { ...req.query, id: req.params.id };
      return sweetsIdHandler(req, res);
    })
  );
  app.put(
    '/api/sweets/:id',
    wrapHandler((req, res) => {
      // Convert Express params to Vercel query format
      req.query = { ...req.query, id: req.params.id };
      return sweetsIdHandler(req, res);
    })
  );
  app.delete(
    '/api/sweets/:id',
    wrapHandler((req, res) => {
      // Convert Express params to Vercel query format
      req.query = { ...req.query, id: req.params.id };
      return sweetsIdHandler(req, res);
    })
  );
  app.get('/api/sweets', wrapHandler(sweetsHandler));
  app.post('/api/sweets', wrapHandler(sweetsHandler));

  // Test routes for middleware testing
  app.get('/api/protected/test', authenticateToken, (req, res) => {
    res.json({
      message: 'Access granted',
      user: req.user,
    });
  });

  app.get('/api/admin/test', authenticateToken, requireAdmin, (req, res) => {
    res.json({
      message: 'Admin access granted',
      user: req.user,
    });
  });

  return app;
}

export default createApp();
