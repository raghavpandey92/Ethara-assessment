const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { createToken, formatUser } = require('../utils/authHelpers');

function sendAuthResponse(res, statusCode, message, user) {
  res.status(statusCode).json({
    message,
    token: createToken(user),
    user: formatUser(user),
  });
}

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Please fill in all fields', 400);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'member',
  });

  sendAuthResponse(res, 201, 'Signup successful', user);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please enter email and password', 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('Invalid email or password', 400);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new AppError('Invalid email or password', 400);
  }

  sendAuthResponse(res, 200, 'Login successful', user);
});

module.exports = {
  login,
  signup,
};
