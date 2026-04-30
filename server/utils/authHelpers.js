const jwt = require('jsonwebtoken');

function getJwtSecret() {
  return process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
}

function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: '7d',
    }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

module.exports = {
  createToken,
  formatUser,
  getJwtSecret,
};
