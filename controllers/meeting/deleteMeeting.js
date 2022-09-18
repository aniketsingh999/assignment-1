const { Meeting } = require('../../models');
const { StatusCodes } = require('http-status-codes');

const deleteMeeting = async (req, res) => {
  const { userId: host } = res.locals.user;
  const { meetingId } = req.params;

  const meeting = await Meeting.findById(meetingId);

  if (!(meeting.host.toHexString() === host)) throw new UnauthorizedError('');

  await Meeting.deleteOne({ _id: meetingId });

  res.status(StatusCodes.OK).json({ msg: 'deleted' });
};

module.exports = deleteMeeting;
