const CustomAPIError = require("./CustomAPIError")
const {StatusCodes} = require('http-status-codes')

class UnauthorizedError extends CustomAPIError {
  constructor(msg) {
    super(msg)
    this.code = StatusCodes.UNAUTHORIZED
  }
}

module.exports = UnauthorizedError