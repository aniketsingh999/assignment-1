const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../../errors');
const { User } = require('../../models');
const { createTokenUser } = require('../../utils');

const getUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) throw new BadRequestError('invalid user id');

  const tokenUser = createTokenUser(user);

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

module.exports = getUser;
