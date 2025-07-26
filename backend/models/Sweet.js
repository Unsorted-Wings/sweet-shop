import mongoose from 'mongoose';

/**
 * Sweet Schema - Represents a sweet/candy product in the shop
 */
const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

export const Sweet = mongoose.model('Sweet', sweetSchema);
