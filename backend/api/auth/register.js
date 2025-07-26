export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    res.status(201).json({
      message: 'User registered successfully',
      userId: 'user123'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
