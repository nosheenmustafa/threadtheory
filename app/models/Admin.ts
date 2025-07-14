import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from creating a new model if it already exists
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin; 