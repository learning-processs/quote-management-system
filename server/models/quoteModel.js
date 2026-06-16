import mongoose from "mongoose";


const quoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Quote text is required'],
    trim: true,
    maxlength: [500, 'Quote cannot exceed 500 characters'],
  },
  author: {
    type: String,
    default: 'Unknown',
    trim: true,
  },
  category: {
    type: String,
    enum: ['Motivation', 'Philosophy', 'Life', 'Love', 'Humor', 'Success', 'Other'],
    default: 'Other',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
}, { timestamps: true });

const quoteModel =mongoose.models.quote || mongoose.model('quote', quoteSchema);

export default quoteModel;