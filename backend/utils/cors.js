export function handleCors(req, res) {
  // Hardcode working origins - more reliable than environment variables
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000', 
    'http://127.0.0.1:5173',
    'https://sweet-shop-management-frontend.vercel.app'
  ];

  const origin = req.headers.origin;
  
  console.log('🔍 Request origin:', origin);
  console.log('🔍 Allowed origins:', allowedOrigins);
  
  // Set CORS headers - be more permissive for development
  if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    console.log('✅ CORS allowed for origin:', origin);
  } else {
    console.log('❌ CORS blocked for origin:', origin);
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
