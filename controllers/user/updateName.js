const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../../errors');
const {User} = require('../../models');
const { createTokenUser } = require('../../utils');
const createJWT = require('../../utils/createJWT');

const updateName = async(req, res) => {
  const userID = res.locals.user.userId
  const {name} = req.body

  const user = await User.findById(userID);

  if(!user) throw new BadRequestError('invalid user')

  user.name = name;
  await user.save();

  const tokenUser = createTokenUser(user)
  const authToken = createJWT(tokenUser, process.env.JWT_LIFETIME)


  res.status(StatusCodes.OK).json({ user: tokenUser, authToken})
}

module.exports = updateName;