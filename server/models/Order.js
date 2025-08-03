import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },  // for job-based orders
    gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },  // for gig-based orders
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'in progress', 'delivered', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentIntentId: { type: String },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
