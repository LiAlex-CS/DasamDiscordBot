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

const STATUS_CODE_MESSAGES = {
  ValorantApiDown:
    "The Valorant API is currently down, please try again later.",
  MongoDBApiDown: "The MongoDB API is currently down, please try again later.",
};

const LOADING_MESSAGE =
  "Please wait a few moments as we get the data for you ...";

module.exports = {
  STATUS_CODES,
  STATUS_CODE_MESSAGES,
  LOADING_MESSAGE,
};
