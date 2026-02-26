import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: "" },      // Fixes missing pictures
  ownerName: { type: String, default: "Unknown" }, // Fixes "Unknown Student"
  ownerId: { type: String, required: true },    // Required for the credit system
  creditsRequired: { type: Number, default: 10 }
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);