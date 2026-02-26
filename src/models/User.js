import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  credits: { type: Number, default: 50 }
  // studentId is completely deleted so it never causes an error again
});

export default mongoose.models.User || mongoose.model("User", UserSchema);