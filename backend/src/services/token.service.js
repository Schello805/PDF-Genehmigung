const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

exports.generateJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

exports.verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
