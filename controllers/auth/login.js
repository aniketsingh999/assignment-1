const { StatusCodes } = require('http-status-codes');
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../../errors');

const {User} = require('../../models');

const {
  createTokenUser,
  sendVerificationMail,
} = require('../../utils');
const createJWT = require('../../utils/createJWT');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    throw new BadRequestError('Provide both email and password');
  }

  const user = await User.findOne({email})

  if (!user) {
    throw new NotFoundError(`No user found with email: ${email}`);
  }

  if (!user.isVerified) {
    sendVerificationMail(user.email, user);
    throw new UnauthorizedError('Please verify your email id before you log in.');
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Wrong password.');
  }

  const tokenUser = createTokenUser(user);

  const authToken = createJWT(tokenUser, process.env.JWT_LIFETIME);

  res.status(StatusCodes.OK).json({ user: tokenUser, authToken });
};

module.exports = login;