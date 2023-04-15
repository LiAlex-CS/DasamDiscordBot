const STATUS_CODES = {
  ok: 200,
  permRedirect: 301,
  tempRedirect: 302,
  clientError: 400,
  notFound: 404,
  gone: 410,
  internalServerError: 500,
  serviceUnavailable: 503,
};

const STATUS_CODES_API = {
  ok: 200,
  clientError: 400,
  notFound: 404,
  forbidden: 403,
  timeOut: 408,
  hitRateLimit: 429,
  serviceUnavailable: 503,
};

const DEFAULT_STATUS_CODE_MESSAGES = {
  clientError:
    "The requested data was fetched incorrectly from the client. Please contact for admin support.",
  notFound: "The requested data was not found in the database.",
  forbidden:
    "The requested data is forbidden. There might be some updates being patched right now, please try again later.",
  timeOut: "Fetching the requested data timed out.",
  hitRateLimit:
    "You have requested the data too frequently. Please try again later.",
  serviceUnavailable:
    "There is currently an error with the servers. Please try again later.",
};

const STATUS_CODE_MESSAGES = {
  ValorantApiDown:
    "The Valorant API is currently down, please try again later.",
  MongoDBApiDown: "The MongoDB API is currently down, please try again later.",
};

const LOADING_MESSAGE =
  "Please wait a few moments as we get the data for you ...";

module.exports = {
  STATUS_CODES,
  STATUS_CODES_API,
  STATUS_CODE_MESSAGES,
  DEFAULT_STATUS_CODE_MESSAGES,
  LOADING_MESSAGE,
};
