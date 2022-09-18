const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../../errors');
const {User} = require('../../models');
const { createTokenUser } = require('../../utils');
const createJWT = require('../../utils/createJWT');

const updatePassword = async(req, res) => {
  const userID = res.locals.user.userId
  const {password, newPassword} = req.body

  const user = await User.findById(userID);

  if(!user) throw new BadRequestError('invalid user')

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Wrong password.');
  }

  user.password = newPassword;
  await user.save();

  const tokenUser = createTokenUser(user);

  const authToken = createJWT(tokenUser, process.env.JWT_LIFETIME);

  res.status(StatusCodes.OK).json({ user: tokenUser, authToken });
}

module.exports = updatePassword;