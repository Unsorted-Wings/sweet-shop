import mongoose from 'mongoose';

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name must not exceed 100 characters'],
    trim: true,
    validate: {
      validator: function(name) {
        return name && name.trim().length > 0;
      },
      message: 'Name cannot be empty or only whitespace'
    }
  },
  category: {
    type: String,
    required: true,
    enum: {
      values: ['chocolate', 'candy', 'gummy', 'hard-candy', 'lollipop', 'toffee', 'fudge', 'marshmallow', 'cake', 'cookie', 'pastry'],
      message: 'Category must be one of: chocolate, candy, gummy, hard-candy, lollipop, toffee, fudge, marshmallow, cake, cookie, pastry'
    }
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
export default Sweet;
