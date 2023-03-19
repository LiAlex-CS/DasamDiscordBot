const { BOT_DESCRIPTION } = require("../constants/commands");

const no_command = (message) => {
  message.reply(BOT_DESCRIPTION);
};

module.exports = { no_command };
