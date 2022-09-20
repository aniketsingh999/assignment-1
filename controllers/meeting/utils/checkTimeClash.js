const { User, Meeting } = require('../../../models');

const checkTimeClash = async (hostId, guestId) => {
  const now = Date.now();
  const tenDays = 864000000;
  let tenDaysLater = Date.now() + tenDays;

  console.log({ tenDaysLater });
  const freeTimesHost = await getFreeTime(hostId, now, tenDaysLater);
  const freeTimesGuest = await getFreeTime(guestId, now, tenDaysLater);

  console.log({ freeTimesHost, freeTimesGuest });
  let i = 0;
  let j = 0;

  const freeTimesOverlap = [];
  while (i < freeTimesGuest.length && j < freeTimesHost.length) {
    while (
      j < freeTimesHost.length &&
      freeTimesGuest[i].start <= freeTimesHost[j].start
    ) {
      const start =
        freeTimesGuest[i].start > freeTimesHost[j].start
          ? freeTimesGuest[i].start
          : freeTimesHost[j].start;

      const guestEndTime = getEndTime(
        freeTimesGuest[i].start,
        freeTimesGuest[i].duration
      );

      const hostEndTime = getEndTime(
        freeTimesHost[j].start,
        freeTimesHost[j].duration
      );
      const duration = Math.abs(
        (guestEndTime < hostEndTime ? guestEndTime : hostEndTime) - start
      );

      freeTimesOverlap.push({ start, end: start + duration, duration });
      j++;
    }
    i++;
  }

  console.log(freeTimesOverlap);

  return freeTimesOverlap;
};

const getFreeTime = async (userId, now, tenDaysLater) => {
  const user = await User.findById(userId);

  const offHoursStartDatetmp = new Date(user.offHoursStart);
  const userDefinedOffHours = {
    offHoursStart: offHoursStartDatetmp.getTime(),
    offHoursDuration: user.offHoursDuration,
  };

  let offHours = [];

  if (
    userDefinedOffHours.offHoursStart &&
    now <
      userDefinedOffHours.offHoursStart + userDefinedOffHours.offHoursDuration
  ) {
    let start;
    let duration;

    if (now <= userDefinedOffHours.offHoursStart) {
      start = userDefinedOffHours.offHoursStart;
      duration = userDefinedOffHours.offHoursDuration;
    } else {
      start = now;
      duration =
        userDefinedOffHours.offHoursStart +
        userDefinedOffHours.offHoursDuration -
        now;
    }

    offHours.push({
      start,
      duration,
    });
  }

  let meetingsOfUser = await Meeting.find({
    $or: [
      { host: userId },
      { $and: [{ guest: userId }, { isConfirmed: true }] },
    ],
    $and: [{ time: { $gte: now - 86400000 } }, { time: { $lt: tenDaysLater } }],
  });

  meetingsOfUser = meetingsOfUser.filter(
    (meeting) => meeting.time >= now && meeting.isConfirmed
  );

  offHours = [
    ...offHours,
    ...meetingsOfUser.map((meeting) => {
      const { time: start, duration } = meeting;
      return { start: start.getTime(), duration };
    }),
  ];

  offHours.sort((a, b) => a.start - b.start);

  console.log({ offHours });
  const freeTimesUser = [];

  if (offHours.length) {
    if (now < offHours[0].start) {
      freeTimesUser.push({
        start: now,
        duration: offHours[0].start - now,
      });
    } else if (
      now >= offHours[0].start &&
      now < offHours[0].start + offHours[0].duration
    ) {
      freeTimesUser.push({
        start: now,
        duration: offHours[0].start + offHours[0].duration - now,
      });
    }
  } else {
    freeTimesUser.push({
      start: now,
      duration: tenDaysLater - now,
    });
  }

  for (let i = 0; i < offHours.length - 1; i++) {
    const start = offHours[i].start + offHours[i].duration;
    const duration = offHours[i + 1].start - start;

    if (duration > 600000) freeTimesUser.push({ start, duration });
  }

  freeTimesUser.push({
    start: offHours.length
      ? offHours[offHours.length - 1].start +
        offHours[offHours.length - 1].duration
      : now,
    duration:
      tenDaysLater -
      (offHours.length
        ? offHours[offHours.length - 1].start +
          offHours[offHours.length - 1].duration
        : now),
  });

  return freeTimesUser;
};

const getEndTime = (start, duration) => start + duration;

module.exports = checkTimeClash;
