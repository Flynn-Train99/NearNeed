const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  need: { 
    type: String, 
    required: true, 
    trim: true, 
    maxlength: 50 
  },
  budget: {
    type: { 
      type: String, 
      enum: ['cash', 'favor'], 
      required: true 
    },
    amount: { 
      type: Number,
      min: 0,
      max: 20,
      default: 0
    },
    description: { 
      type: String, 
      trim: true, 
      maxlength: 100,
      default: ''
    }
  },
  radius: { 
    type: Number, 
    required: true, 
    min: 0.5, 
    max: 10 
  },
  details: { 
    type: String, 
    trim: true, 
    maxlength: 200, 
    default: '' 
  },
  category: { 
    type: String, 
    enum: ['tools', 'pets', 'help', 'other'], 
    default: 'other' 
  },
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  completedAt: { 
    type: Date, 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Index for geospatial queries
requestSchema.index({ 'location': '2dsphere' });
// Index for filtering active requests
requestSchema.index({ active: 1, createdAt: -1 });

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;