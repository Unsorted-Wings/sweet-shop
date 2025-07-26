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
    required: true,
    validate: {
      validator: function(price) {
        return price > 0;
      },
      message: 'Price must be greater than 0'
    }
  },
  quantity: {
    type: Number,
    required: true,
    validate: {
      validator: function(quantity) {
        return Number.isInteger(quantity) && quantity >= 0;
      },
      message: 'Quantity must be a non-negative integer'
    }
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

export const Sweet = mongoose.model('Sweet', sweetSchema);
