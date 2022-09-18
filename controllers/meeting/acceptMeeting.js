const { StatusCodes } = require('http-status-codes');
const { UnauthorizedError, BadRequestError } = require('../../errors');
const { Meeting } = require('../../models');

const acceptMeeting = async (req, res) => {
  const { meetingId } = req.body;

  const meeting = await Meeting.findById(meetingId);

  if (!(meeting.guest.toHexString() === res.locals.user.userId))
    throw new UnauthorizedError('');

  if (meeting.isConfirmed) throw new BadRequestError('already confirmed');

  meeting.isConfirmed = true;
  await meeting.save();
  res.status(StatusCodes.OK).json({ msg: 'meeting accepted' });
};

module.exports = acceptMeeting;
