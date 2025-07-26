
import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './utils/db.js';

// Load environment variables
dotenv.config();

// Import serverless functions for testing
import registerHandler from './api/auth/register.js';
import loginHandler from './api/auth/login.js';

export function createApp() {
  const app = express();
  
  // Middleware
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
  const wrapHandler = (handler) => async (req, res) => {
    // Simulate Vercel's req/res objects
    const vercelReq = {
      ...req,
      method: req.method,
      body: req.body,
      query: req.query,
      headers: req.headers
    };
    
    const vercelRes = {
      status: (code) => ({ 
        json: (data) => res.status(code).json(data),
        send: (data) => res.status(code).send(data)
      }),
      json: (data) => res.json(data),
      send: (data) => res.send(data)
    };
    
    return handler(vercelReq, vercelRes);
  };
  
  // Auth routes - mapping to serverless functions
  app.post('/api/auth/register', wrapHandler(registerHandler));
  app.post('/api/auth/login', wrapHandler(loginHandler));
  
  return app;
}

export default createApp();

