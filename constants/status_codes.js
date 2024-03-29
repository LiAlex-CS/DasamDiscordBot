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

const CODE_ERROR_MESSAGE =
  "\nThere has been a problem with the bot. An administrator has been contacted. <@692450156569952398>";

const STATUS_CODE_MESSAGES = {
  ValorantApiDown:
    "The Valorant API is currently down, please try again later.",
  MongoDBApiDown: "The MongoDB API is currently down, please try again later.",
};

module.exports = {
  STATUS_CODES_API,
  STATUS_CODE_MESSAGES,
  DEFAULT_STATUS_CODE_MESSAGES,
  CODE_ERROR_MESSAGE,
};
