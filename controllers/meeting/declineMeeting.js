const { Meeting } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../../errors');

const declineMeeting = async (req, res) => {
  const { userId } = res.locals.user;
  const { meetingId } = req.params;

  const meeting = await Meeting.findById(meetingId);

  if (!meeting) throw new BadRequestError('invalid meeting id');

  if (
    !(
      meeting.guest.toHexString() === userId ||
      meeting.host.toHexString() === userId
    )
  )
    throw new UnauthorizedError('');

  if (meeting.guest.toHexString() === userId) {
    delete meeting.guest;
    await meeting.save();
  } else if (meeting.host.toHexString() === userId) {
    await Meeting.deleteOne({ _id: meetingId });
  }

  res.status(StatusCodes.OK).json({ msg: 'declined' });
};

module.exports = declineMeeting;
