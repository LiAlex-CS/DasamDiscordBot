const {
  COMMANDS,
  ALL_COMMANDS,
  COMMAND_ERRORS,
  COMMAND_DESCRIPTIONS,
} = require("../constants/commands");

const { stringArrToString, JSONHasValue } = require("../services");

const help_command = (message, command, args) => {
  if (!args.length) {
    message.reply(ALL_COMMANDS);
  } else if (args.length === 1 && JSONHasValue(args[0], COMMANDS)) {
    for (let key in COMMANDS) {
      if (COMMANDS[key] === args[0]) {
        message.reply(COMMAND_DESCRIPTIONS[key]);
      }
    }
  } else {
    message.reply(
      `"${command} ` +
        stringArrToString(args) +
        '" ' +
        COMMAND_ERRORS.getCommands
    );
  }
};

module.exports = { help_command };
