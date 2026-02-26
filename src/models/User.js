import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true },
  credits: { type: Number, default: 50 }, // MUST BE A NUMBER
  studentId: String
});

export default mongoose.models.User || mongoose.model("User", UserSchema);