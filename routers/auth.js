const {
  register,
  login,
  verifyEmail,
} = require('../controllers/auth');

const authRouter = require('express').Router();

authRouter.route('/register').post(register);
authRouter.route('/login').post(login);
authRouter.route('/verifyEmail/:token').get(verifyEmail);


module.exports = authRouter;