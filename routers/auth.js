const {
  register,
  logIn,
  verifyAccountEmail,
  resetPassword,
  verifyAndResetPassword,
} = require('../controllers/auth');

const authRouter = require('express').Router();

authRouter.route('/register').post(register);
authRouter.route('/login').post(logIn);
authRouter.route('/logout').get(logOut);
authRouter.route('/verify-email/:token').get(verifyAccountEmail);
authRouter
  .route('/reset-password')
  .get(resetPassword)
  .patch(verifyAndResetPassword);

module.exports = authRouter;