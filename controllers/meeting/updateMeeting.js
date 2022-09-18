const { StatusCodes } = require('http-status-codes');
const { Meeting } = require('../../models');

const updateMeeting = async (req, res) => {
  const { userId: host } = res.locals.user;
  const { meetingId, guest, time, duration, agenda, title, isConfirmed } =
    req.body;

  const meeting = await Meeting.findById(meetingId);

  if (!(meeting.host.toHexString() === host)) throw new UnauthorizedError('');

  const newMeeting = await Meeting.updateOne(
    { _id: meetingId },
    { guest, time, duration, agenda, title, isConfirmed }
  );

  res.status(StatusCodes.OK).json({ meeting: newMeeting });
};

module.exports = updateMeeting;
