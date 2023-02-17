const { LOADING_MESSAGE } = require("../constants/status_codes");

const DEFAULT_WAIT_TIME = 1000;

const generateLoadingTime = (message, waitTime) => {
  return setTimeout(() => {
    message.reply(LOADING_MESSAGE);
  }, waitTime || DEFAULT_WAIT_TIME);
};

const removeLoadingInstance = (loadingInstance) => {
  loadingInstance ? clearTimeout(loadingInstance) : null;
};

module.exports = { generateLoadingTime, removeLoadingInstance };
