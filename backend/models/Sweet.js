import mongoose from 'mongoose';

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
  timestamps: true
});

export const Sweet = mongoose.model('Sweet', sweetSchema);
