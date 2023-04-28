const {
  DEFAULT_LOADING_MESSAGE,
  DEFAULT_WAIT_TIME,
} = require("../constants/fetching_consts");

const generateLoadingTime = (
  message,
  config = {
    loadingMessage: DEFAULT_LOADING_MESSAGE,
    waitTime: DEFAULT_WAIT_TIME,
  }
) => {
  return setTimeout(() => {
    message.reply(config.loadingMessage || DEFAULT_LOADING_MESSAGE);
  }, config.waitTime || DEFAULT_WAIT_TIME);
};

const removeLoadingInstance = (loadingInstance) => {
  loadingInstance ? clearTimeout(loadingInstance) : null;
};

module.exports = { generateLoadingTime, removeLoadingInstance };
