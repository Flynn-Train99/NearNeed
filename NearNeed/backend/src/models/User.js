const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  photo: { type: String, default: null }, // S3 URL
  rating: { 
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  favorStats: {
    done: { type: Number, default: 0 },
    missed: { type: Number, default: 0 }
  },
  verified: {
    phone: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    id: { type: Boolean, default: false }
  },
  banStatus: {
    type: { type: String, enum: ['none', 'temporary', 'permanent'], default: 'none' },
    until: { type: Date, default: null }
  },
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  premium: {
    active: { type: Boolean, default: false },
    expiresAt: { type: Date, default: null },
    stripeSubscriptionId: { type: String, default: null }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;