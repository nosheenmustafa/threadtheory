import mongoose from "mongoose";

// Ensure mongoose is connected
if (!mongoose.connection.readyState) {
  console.log('Mongoose not connected, initializing connection...');
}

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    addresses: [addressSchema],
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
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

// Prevent model overwrite error
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
