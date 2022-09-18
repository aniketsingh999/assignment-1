const { updateName, updatePassword } = require('../controllers/user')
const {authentication} = require('../middleware')
const express = require('express')

const userRouter = express.Router()
userRouter.use(authentication)

userRouter.route('/updateName').patch(updateName)
userRouter.route('/updatePassword').patch(updatePassword)

module.exports = userRouter