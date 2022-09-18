const {verifyToken} = require('../utils');
const {UnauthorizedError} = require('../errors');

const authentication = (req, res, next) => {
  const {authToken} = req.body;

  if (!authToken) {
    throw new UnauthorizedError('You need to be logged in to perform this action.');
  }
  let tokenUser = undefined;
  try {
    tokenUser = verifyToken(authToken);
  } catch (err) {
    throw new UnauthorizedError('Invalid token.');
  }
  delete tokenUser.iat;
  delete tokenUser.exp;
  res.locals.user = tokenUser;
  next();
};

module.exports = authentication;