const CustomAPIError = require("./CustomAPIError")
const {StatusCodes} = require('http-status-codes')

class BadRequestError extends CustomAPIError {
  constructor(msg) {
    super(msg)
    this.code = StatusCodes.BAD_REQUEST
  }
}

module.exports = BadRequestError