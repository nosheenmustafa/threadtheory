import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  user: { type: String, required: false }, // can be userId, email, or 'anonymous'
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const ProductFeedbackSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  votes: [{ user: String, vote: { type: String, enum: ['like', 'dislike'] } }], // userId or sessionId
  comments: [CommentSchema],
});

export default mongoose.models.ProductFeedback || mongoose.model('ProductFeedback', ProductFeedbackSchema); 