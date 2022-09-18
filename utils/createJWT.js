const jwt = require('jsonwebtoken');

const createJWT = (payload, lifetime) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: lifetime,
  });
};

module.exports = createJWT;