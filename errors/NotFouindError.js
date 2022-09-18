const CustomAPIError = require("./CustomAPIError")
const {StatusCodes} = require('http-status-codes')

class NotFoundError extends CustomAPIError {
  constructor(msg) {
    super(msg)
    this.code = StatusCodes.NOT_FOUND
  }
}

module.exports = NotFoundError