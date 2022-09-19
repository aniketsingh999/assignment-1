const { User, Meeting } = require('../../../models');

const checkTimeClash = async (hostId, guestId) => {
  const now = Date.now();
  const tenDaysLater = now + 10 * 24 * 3600;
  console.log({ now });
  const host = await User.findById(hostId);

  const offHoursHost = [];

  const userDefinedOffHoursHost = {
    offHoursStart: new Date(host.offHoursStart).getTime(),
    offHoursDuration: host.offHoursDuration,
  };

  if (
    userDefinedOffHoursHost.offHoursStart &&
    userDefinedOffHoursHost.offHoursDuration
  )
    offHoursHost.push(userDefinedOffHoursHost);

  const meetingsOfHost = await Meeting.find({
    $or: [
      { host: hostId },
      { $and: [{ guest: hostId }, { isConfirmed: true }] },
    ],
    $and: [{ time: { $gte: now } }, { time: { $lt: tenDaysLater } }],
  });

  let offHoursOfHost = [
    ...offHoursHost,
    ...meetingsOfHost.map((value) => {
      const { time: offHoursStart, duration: offHoursDuration } = value;
      return {
        offHoursStart: new Date(offHoursStart).getTime(),
        offHoursDuration,
      };
    }),
  ];

  offHoursOfHost.sort((a, b) => a.offHoursStart - b.offHoursStart);

  const guest = await User.findById(guestId);

  const offHoursGuest = [];

  const userDefinedOffHoursGuest = {
    offHoursStart: new Date(guest.offHoursStart).getTime(),
    offHoursDuration: guest.offHoursDuration,
  };

  if (
    userDefinedOffHoursGuest.offHoursStart &&
    userDefinedOffHoursGuest.offHoursDuration
  )
    offHoursGuest.push(userDefinedOffHoursGuest);

  const meetingsOfGuest = await Meeting.find({
    $or: [
      { host: guestId },
      { $and: [{ guest: guestId }, { isConfirmed: true }] },
    ],
    $and: [{ time: { $gte: now } }, { time: { $lt: tenDaysLater } }],
  });

  let offHoursOfGuest = [
    ...offHoursGuest,
    ...meetingsOfGuest.map((value) => {
      const { time: offHoursStart, duration: offHoursDuration } = value;
      return {
        offHoursStart: new Date(offHoursStart).getTime(),
        offHoursDuration,
      };
    }),
  ];

  offHoursOfGuest.sort((a, b) => a.offHoursStart - b.offHoursStart);

  const freeTimesHost = [];
  if (offHoursHost[0] && now < offHoursHost[0]?.offHoursStart) {
    freeTimesHost.push({
      start: now,
      duration: offHoursHost[0].offHoursStart - now,
    });
  } else {
    freeTimesHost.push({
      start: now,
      duration: tenDaysLater - now,
    });
  }

  for (let i = 0; i < offHoursOfHost.length; i++) {
    const start = getEndTime(
      offHoursOfHost[i].offHoursStart,
      offHoursOfHost[i].offHoursDuration
    );

    const duration = Math.abs(
      i + 1 === offHoursOfHost.length
        ? tenDaysLater
        : offHoursOfHost[i + 1].offHoursStart - start
    );
    freeTimesHost.push({ start, duration });
  }

  if (freeTimesHost.length === 0)
    freeTimesHost.push({ start: now, duration: tenDaysLater - now });

  const freeTimesGuest = [];

  if (offHoursGuest[0] && offHoursGuest[0].offHoursStart) {
    freeTimesGuest.push({
      start: now,
      duration: offHoursGuest[0].offHoursStart - now,
    });
  } else {
    freeTimesGuest.push({
      start: now,
      duration: tenDaysLater - now,
    });
  }

  for (let i = 0; i < offHoursOfGuest.length; i++) {
    const start = getEndTime(
      offHoursOfGuest[i].offHoursStart,
      offHoursOfGuest[i].offHoursDuration
    );

    const duration = Math.abs(
      (i + 1 === offHoursOfGuest.length
        ? tenDaysLater
        : offHoursOfGuest[i + 1].offHoursStart) - start
    );

    freeTimesGuest.push({ start, duration });
  }

  if (freeTimesGuest.length === 0)
    freeTimesGuest.push({ start: now, duration: tenDaysLater - now });

  console.log({ freeTimesHost, freeTimesGuest });
  let i = 0;
  let j = 0;

  const freeTimesOverlap = [];
  while (i < freeTimesGuest.length && j < freeTimesHost.length) {
    while (
      j < freeTimesHost.length &&
      freeTimesGuest[i].start < freeTimesHost[j].start
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

      freeTimesOverlap.push({ start, end: start + duration });
      j++;
    }
    i++;
  }

  console.log(freeTimesOverlap);

  return freeTimesOverlap;
};

const getEndTime = (start, duration) => start + duration;

module.exports = checkTimeClash;
