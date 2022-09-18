const nodemailer = require('nodemailer');
const createJWT = require('./createJWT');
const createTokenUser = require('./createTokenUser');

const sendVerificationMail = async (target, user) => {
  const tokenUser = createTokenUser(user);
  const verificationToken = createJWT(
    tokenUser,
    process.env.JWT_VERIFICATION_LIFETIME,
  );

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'aryanna.kreiger38@ethereal.email',
      pass: 'w48UEux7crrjKQ8CyP',
    },
  });

  let info = await transporter.sendMail({
    from: `"No reply" <verification@ecommercestore.com>`,
    to: target,
    subject: 'Verify email address',
    html: `Here is your auth token: <br/>
    <code>${verificationToken} </code>`,
  });
  return info;
};
module.exports = sendVerificationMail;