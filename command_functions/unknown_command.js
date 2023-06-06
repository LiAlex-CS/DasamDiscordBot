const { UNKNOWN_COMMAND } = require("../constants/commands");

const unknownCommand = (message, command) => {
  message.reply(`"${command}" ` + UNKNOWN_COMMAND);
};

module.exports = { unknownCommand };
