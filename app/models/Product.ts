import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      'Fancy',
      'Heavy Dress', 
      'Light Dress',
      'Embroidery Work',
      'Mirror Work',
      'Mukesh',
      'Tarkashi',
      'Shadow Work',
      'Electronics',
      'Books',
      'Home & Garden',
      'Sports',
      'Other'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
ProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema); 