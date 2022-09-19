const { StatusCodes } = require('http-status-codes');
const { User, Meeting } = require('../../models');

const getOffHours = async (req, res) => {
  const { userId } = res.locals.user;

  const user = await User.findById(userId);

  const offHours = [];

  const userDefinedOffHours = {
    offHoursStart: new Date(user.offHoursStart).getTime(),
    offHoursDuration: user.offHoursDuration,
  };

  if (userDefinedOffHours.offHoursStart && userDefinedOffHours.offHoursDuration)
    offHours.push(userDefinedOffHours);

  const meetingsOfUser = await Meeting.find({
    $or: [
      { host: userId },
      { $and: [{ guest: userId }, { isConfirmed: true }] },
    ],
    time: { $gte: Date.now() },
  });

  const offHoursOfUser = [
    ...offHours,
    ...meetingsOfUser.map((value) => {
      const { time: offHoursStart, duration: offHoursDuration } = value;
      return {
        offHoursStart: new Date(offHoursStart).getTime(),
        offHoursDuration,
      };
    }),
  ];

  res.status(StatusCodes.OK).json({ offHoursOfUser });
};

module.exports = getOffHours;
