const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendSMS } = require('../services/twilio.service');
const { sendEmail } = require('../services/email.service');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already exists with that email or phone number' 
      });
    }

    // Generate verification codes
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password, // Will be hashed by the pre-save hook
      location
    });

    await newUser.save();

    // Send verification codes
    await sendSMS(phone, `Your NearNeed verification code is: ${phoneVerificationCode}`);
    await sendEmail(email, 'Verify your NearNeed account', 
      `Your verification code is: ${emailVerificationCode}`);

    // Store verification codes (in real app, store securely with TTL)
    // Using memory for demo purposes only
    global.verificationCodes = global.verificationCodes || {};
    global.verificationCodes[newUser._id] = {
      email: emailVerificationCode,
      phone: phoneVerificationCode
    };

    // Generate tokens
    const token = generateToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      refreshToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        verified: newUser.verified
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is banned
    if (user.banStatus.type === 'permanent') {
      return res.status(403).json({ error: 'Your account has been permanently banned' });
    }

    if (user.banStatus.type === 'temporary' && user.banStatus.until > new Date()) {
      return res.status(403).json({ 
        error: `Your account is temporarily banned until ${user.banStatus.until.toISOString()}` 
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        premium: user.premium
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyPhone = async (req, res, next) => {
  try {
    const { userId, code } = req.body;

    // Get stored verification codes (in real app, retrieve from secure storage)
    const storedCodes = global.verificationCodes && global.verificationCodes[userId];
    if (!storedCodes || storedCodes.phone !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Update user
    await User.findByIdAndUpdate(userId, {
      'verified.phone': true
    });

    res.status(200).json({ message: 'Phone number verified successfully' });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { userId, code } = req.body;

    // Get stored verification codes (in real app, retrieve from secure storage)
    const storedCodes = global.verificationCodes && global.verificationCodes[userId];
    if (!storedCodes || storedCodes.email !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Update user
    await User.findByIdAndUpdate(userId, {
      'verified.email': true
    });

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Generate new access token
    const newAccessToken = generateToken(decoded.id);

    res.status(200).json({
      token: newAccessToken
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({ 
        message: 'If your email is registered, you will receive a password reset link' 
      });
    }

    // Generate reset token (6-digit code for simplicity)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the reset code with expiration (1 hour)
    // In a real app, store securely with TTL
    global.passwordResetCodes = global.passwordResetCodes || {};
    global.passwordResetCodes[user._id] = {
      code: resetCode,
      expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    };

    // Send reset email
    await sendEmail(
      email,
      'Reset your NearNeed password',
      `Your password reset code is: ${resetCode}. This code will expire in 1 hour.`
    );

    res.status(200).json({
      message: 'If your email is registered, you will receive a password reset link'
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify reset code
    const resetData = global.passwordResetCodes && global.passwordResetCodes[user._id];
    if (!resetData || resetData.code !== code || resetData.expires < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired reset code' });
    }

    // Update password
    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    // Clean up reset code
    delete global.passwordResetCodes[user._id];

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};