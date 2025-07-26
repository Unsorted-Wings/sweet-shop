function validateEmail(email) {
  const regularExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regularExpression.test(email);
}

function validateRegistrationData(data) {
  const { email, password, name } = data;
  if (!email) {
    return 'Email is required';
  }
  if (validateEmail(email) === false) {
    return 'Invalid email format';
  }
  if (!password) {
    return 'Password is required';
  }
  if (password.trim().length < 6) {
    return 'Password must be at least 6 characters long';
  }
  if (!name) {
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
      userId: 'user123',
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
