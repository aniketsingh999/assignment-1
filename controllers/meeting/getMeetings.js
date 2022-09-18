const { StatusCodes } = require('http-status-codes');
const { Meeting } = require('../../models');

const getMeetings = async (req, res) => {
  const { userId } = res.locals.user;

  const meetings = await Meeting.find({
    $or: [
      { host: userId },
      { $and: [{ guest: userId }, { isConfirmed: true }] },
    ],
  });

  res.status(StatusCodes.OK).json({ meetings });
};

module.exports = getMeetings;
