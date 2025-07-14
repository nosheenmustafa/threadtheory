import mongoose, { Schema, models } from 'mongoose';

const BannerSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Banner = models.Banner || mongoose.model('Banner', BannerSchema);

export default Banner; 