const { StatusCodes } = require('http-status-codes');
const { User, Meeting } = require('../../models');

const getOffHours = async (req, res) => {
  const { userId } = res.locals.user;

  const user = await User.findById(userId);

  const offHours = [
    {
      offHoursStart: user.offHoursStart,
      offHoursDuration: user.offHoursDuration,
    },
  ];

  const meetingsOfUser = await Meeting.find({
    $or: [{ host: userId }, { guest: userId }],
  });

  const offHoursOfUser = [
    ...offHours,
    ...meetingsOfUser.map((value) => {
      const { time: offHoursStart, duration: offHoursDuration } = value;
      return { offHoursStart, offHoursDuration };
    }),
  ];

  res.status(StatusCodes.OK).json({ offHoursOfUser });
};

module.exports = getOffHours;
