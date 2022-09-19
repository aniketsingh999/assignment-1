const { StatusCodes } = require('http-status-codes');
const { Meeting } = require('../../models');

const getMeetingInvites = async (req, res) => {
  const { userId } = res.locals.user;

  const invites = await Meeting.find({
    guest: userId,
    isConfirmed: false,
  });

  res.status(StatusCodes.OK).json({ meetings: invites });
};

module.exports = getMeetingInvites;
