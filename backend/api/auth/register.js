export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.status(201).json({
      message: 'User registered successfully',
      userId: 'user123'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}