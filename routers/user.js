const { updateName, updatePassword, setOffHours, getOffHours } = require('../controllers/user')
const {authentication} = require('../middleware')
const express = require('express')

const userRouter = express.Router()
userRouter.use(authentication)

userRouter.route('/updateName').patch(updateName)
userRouter.route('/updatePassword').patch(updatePassword)
userRouter.route('/offHours').patch(setOffHours).get(getOffHours)

module.exports = userRouter