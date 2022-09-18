const {
  createMeeting,
  acceptMeeting,
  getMeetings,
  updateMeeting,
  getMeetingInvites,
  deleteMeeting,
} = require('../controllers/meeting');

const express = require('express');
const { authentication } = require('../middleware');
const meetingRouter = express.Router();

meetingRouter.use(authentication);

meetingRouter.route('/').get(getMeetings);
meetingRouter.route('/create').post(createMeeting);
meetingRouter.route('/accept').post(acceptMeeting);
meetingRouter.route('/update').patch(updateMeeting);
meetingRouter.route('/invites').get(getMeetingInvites);
meetingRouter.route('/:meetingId').delete(deleteMeeting);

module.exports = meetingRouter;
