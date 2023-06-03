const {
  COMMANDS,
  ALL_COMMANDS,
  COMMAND_ERRORS,
  COMMAND_DESCRIPTIONS,
} = require("../constants/commands");

const { stringArrToString, JSONHasValue } = require("../services");

const helpCommand = (message, command, args) => {
  if (!args.length) {
    message.reply(ALL_COMMANDS);
  } else if (args.length === 1 && JSONHasValue(args[0], COMMANDS)) {
    const key = Object.keys(COMMANDS).find((key) => COMMANDS[key] === args[0]);
    message.reply(COMMAND_DESCRIPTIONS[key]);
  } else {
    message.reply(
      `*${command} ${stringArrToString(args)}* ${COMMAND_ERRORS.getCommands}`
    );
  }
};

module.exports = { helpCommand };
