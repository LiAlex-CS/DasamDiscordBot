const { BOT_DESCRIPTION } = require("../constants/commands");

const noCommand = (message) => {
  message.reply(BOT_DESCRIPTION);
};

module.exports = { noCommand };
