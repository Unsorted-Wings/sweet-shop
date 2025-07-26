import { EMAIL_REGEX, VALIDATION_MESSAGES } from '../constants/validation.js';

export function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

export function validateRegistrationData(data) {
  const { email, password, name } = data;

  if (!email) {
    return VALIDATION_MESSAGES.EMAIL_REQUIRED;
  }

  if (!validateEmail(email)) {
    return VALIDATION_MESSAGES.EMAIL_INVALID;
  }

  if (!password) {
    return VALIDATION_MESSAGES.PASSWORD_REQUIRED;
  }

  if (password.trim().length < 6) {
    return VALIDATION_MESSAGES.PASSWORD_TOO_SHORT;
  }

  if (!name) {
    return VALIDATION_MESSAGES.NAME_REQUIRED;
  }

  return null;
}
