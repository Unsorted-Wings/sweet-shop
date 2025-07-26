function validateRegistrationData(data) {
  if (!data.email) {    
    return 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Invalid email format';
 }
  if (!data.password) {
    return 'Password is required';
  }
  if (!data.name) {
    return 'Name is required';
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validationError = validateRegistrationData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    res.status(201).json({
      message: 'User registered successfully',
      userId: 'user123'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
