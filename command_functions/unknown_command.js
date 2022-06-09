const { UNKNOWN_COMMAND } = require("../constants/commands");

const unknown_command = (message, command) => {
  message.reply(`"${command}" ` + UNKNOWN_COMMAND);
};

module.exports = { unknown_command };
