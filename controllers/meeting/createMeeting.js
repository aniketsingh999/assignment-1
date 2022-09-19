const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../../errors');
const Meeting = require('../../models/Meeting');
const checkTimeClash = require('./utils/checkTimeClash');

const createMeeting = async (req, res) => {
  const { userId: host } = res.locals.user;
  const { guest, time, duration, agenda, title } = req.body;

  if (host === guest)
    throw new BadRequestError('Host and guest can not be the same');

  if (!(guest && time && duration && agenda && title))
    throw new BadRequestError('insufficient details');

  const freeTimesOverlap = await checkTimeClash(host, guest);

  let freeTime;

  for (let i = 0; i < freeTimesOverlap.length; i++) {
    if (
      freeTimesOverlap[i].start <= time &&
      freeTimesOverlap[i].start + freeTimesOverlap[i].duration > time + duration
    ) {
      freeTime = freeTimesOverlap[i];
      break;
    }
  }

  if (!freeTime)
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "meeting can't be scheduled at the requested time. please choose from one of the following time intervals",
      availabeIntervals: freeTimesOverlap,
    });

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
