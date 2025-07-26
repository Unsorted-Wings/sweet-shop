export function validateEmail(email) {
  const regularExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regularExpression.test(email);
}

export function validateRegistrationData(data) {
  const { email, password, name } = data;
  
  if (!email) {
    return 'Email is required';
  }
  
  if (!validateEmail(email)) {
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
