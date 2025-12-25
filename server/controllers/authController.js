const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register
exports.register = async (req, res) => {
  const { name, mobile, password, village } = req.body;
  console.log(req.body);
  try {
    let user = await User.findOne({ mobile });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, mobile, password, village });
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.json({
      token,
      user: { id: user._id, name: user.name, mobile: user.mobile, village: user.village, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

//login
exports.login = async (req, res) => {
  const { mobile, password } = req.body;
  console.log("Login attempt:", req.body); // debug

  try {
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // JWT Token बनव
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });

    // HttpOnly Cookie मध्ये token set कर
    res.cookie('token', token, {
      httpOnly: true,         // JavaScript ने access नाही करू शकत (XSS protection)
      secure: process.env.NODE_ENV === 'production', // production मध्ये HTTPS वर true
      sameSite: 'strict',     // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Frontend ला user info पाठव (token नाही – तो cookie मध्ये आहे)
    res.json({
      success: true,
      token,
      user: {
        id: user.__id,
        name: user.name,
        mobile: user.mobile,
        village: user.village,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};