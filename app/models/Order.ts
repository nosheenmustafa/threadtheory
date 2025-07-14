import mongoose, { Schema, models } from 'mongoose';

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
    }
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || mongoose.model('Order', OrderSchema);

export default Order; 