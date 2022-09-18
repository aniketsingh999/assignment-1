const CustomAPIError = require("./CustomAPIError")
const {StatusCodes} = require('http-status-codes')

class ForbiddenError extends CustomAPIError {
  constructor(msg) {
    super(msg)
    this.code = StatusCodes.FORBIDDEN
  }
}

module.exports = ForbiddenError