import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },   
    gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },   
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' } 
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
