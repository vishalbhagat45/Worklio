import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isSeller: { type: Boolean, default: false },
    profilePic: { type: String },
    description: { type: String },
    rating: { type: Number, default: 0 },
    skills: [String],
    location: { type: String },
    phone: { type: String },
    role: {
      type: String,
      enum: ['admin', 'client', 'freelancer'],
      default: 'client',
    },
    balance: { type: Number, default: 0 }, // if you want internal wallet
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
