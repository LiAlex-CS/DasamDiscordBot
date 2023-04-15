const {
  STATUS_CODES_API,
  DEFAULT_STATUS_CODE_MESSAGES,
} = require("../constants/status_codes");

const handleAPIError = (message, errorResp, errorMessages = {}) => {
  const errorStatus = parseInt(errorResp.status, 10);
  switch (errorStatus) {
    case STATUS_CODES_API.clientError:
      message.reply(
        errorMessages.clientError || DEFAULT_STATUS_CODE_MESSAGES.clientError
      );
      break;
    case STATUS_CODES_API.notFound:
      message.reply(
        errorMessages.notFound || DEFAULT_STATUS_CODE_MESSAGES.notFound
      );
      break;
    case STATUS_CODES_API.forbidden:
      message.reply(
        errorMessages.forbidden || DEFAULT_STATUS_CODE_MESSAGES.forbidden
      );
      break;
    case STATUS_CODES_API.timeOut:
      message.reply(
        errorMessages.timeOut || DEFAULT_STATUS_CODE_MESSAGES.timeOut
      );
      break;
    case STATUS_CODES_API.hitRateLimit:
      message.reply(
        errorMessages.hitRateLimit || DEFAULT_STATUS_CODE_MESSAGES.hitRateLimit
      );
      break;
    case STATUS_CODES_API.serviceUnavailable:
      message.reply(
        errorMessages.serviceUnavailable ||
          DEFAULT_STATUS_CODE_MESSAGES.serviceUnavailable
      );
      break;
    default:
      if (errorResp.errors && errorResp.errors.length > 0) {
        errorResp.errors.forEach((error) => {
          message.reply(`${errorResp.status}: ${error.message}`);
        });
      } else {
        message.reply(`${errorResp.status}: No error details.`);
      }
  }
};

module.exports = { handleAPIError };
