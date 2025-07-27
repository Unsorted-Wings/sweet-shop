export function handleCors(req, res) {
  // Get allowed origins from environment or use defaults
  const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : [
        'http://localhost:5173',
        'http://localhost:3000', 
        'http://127.0.0.1:5173',
        'https://sweet-shop-management-frontend.vercel.app'
      ];

  const origin = req.headers.origin;
  
  // Set CORS headers
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // Indicates this was a preflight request
  }
  
  return false; // Not a preflight request, continue processing
}
