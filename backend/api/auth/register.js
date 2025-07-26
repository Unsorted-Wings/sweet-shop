import { connectToDatabase } from '../../utils/db.js';
import { validateRegistrationData } from '../../utils/validation.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validationError = validateRegistrationData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Check if user already exists
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ email: req.body.email });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    res.status(201).json({
      message: 'User registered successfully',
      userId: 'user123',
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
