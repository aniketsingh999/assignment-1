const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const {
  UnauthorizedError,
  BadRequestError,
} = require('../../errors');
const User = require('../../models/User');
const { createTokenUser} = require('../../utils');
const createJWT = require('../../utils/createJWT');

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  let payload = undefined;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw UnauthorizedError('Invalid verification token');
  }

  const user = await User.findOne({ email: payload.email });

  if (user.isVerified) {
    throw new BadRequestError('User is already verified.');
  }
  user.isVerified = true;
  await user.save();
  const tokenUser = createTokenUser(user);
  const authToken = createJWT(tokenUser, process.env.JWT_LIFETIME)

  res.status(StatusCodes.OK).json({ msg: 'verified.', authToken });
};

module.exports = verifyEmail;