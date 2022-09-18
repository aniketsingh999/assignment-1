const { StatusCodes } = require('http-status-codes');
const { User } = require('../../models');
const { BadRequestError } = require('../../errors');

const setOffHours = async (req, res) => {
  const { offHoursStartTimestamp, offHoursDuration } = req.body;

  if (!(offHoursStartTimestamp && offHoursDuration))
    throw new BadRequestError(
      'please send offHoursStartTimestamp and offHoursDuration'
    );

  const offHoursStart = new Date(offHoursStartTimestamp);

  const { userId } = res.locals.user;

  const user = await User.findById(userId);

  user.offHoursStart = offHoursStart;
  user.offHoursDuration = offHoursDuration;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'off hours set successfully' });
};

module.exports = setOffHours;
