import mongoose from 'mongoose';
import { EMAIL_REGEX, VALIDATION_MESSAGES } from '../constants/validation.js';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (email) {
          return EMAIL_REGEX.test(email);
        },
        message: VALIDATION_MESSAGES.EMAIL_INVALID,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (password) {
          return password.trim().length >= 6;
        },
        message: VALIDATION_MESSAGES.PASSWORD_TOO_SHORT,
      },
    },
    name: {
      type: String,
      required: true,
      validate: {
        validator: function (name) {
          return name.trim().length > 0;
        },
        message: VALIDATION_MESSAGES.NAME_REQUIRED,
      },
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
