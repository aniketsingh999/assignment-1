const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../../errors');
const Meeting = require('../../models/Meeting');

const createMeeting = async (req, res) => {
  const { userId: host } = res.locals.user;
  const { guest, time, duration, agenda, title } = req.body;

  if (!(guest && time && duration && agenda && title))
    throw new BadRequestError('insufficient details');

  const meeting = await Meeting.create({
    host,
    guest,
    time,
    duration,
    agenda,
    title,
  });

  res.status(StatusCodes.CREATED).json({ meeting });
};

module.exports = createMeeting;
