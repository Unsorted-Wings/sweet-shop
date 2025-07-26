
import express from 'express';

// Import serverless functions for testing
import registerHandler from './api/auth/register.js';

export function createApp() {
  const app = express();
  
  // Middleware
  app.use(express.json());
  
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
  
  return app;
}

export default createApp();

