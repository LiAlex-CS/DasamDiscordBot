const {
  PREFIX,
  COMMANDS,
  ALL_COMMANDS,
  UNKNOWN_COMMAND,
  COMMAND_ERRORS,
  COMMAND_DESCRIPTIONS,
  RANKS_INTRO,
  HAS_SPACES_REMINDER,
  SET_SMURF_PRIVATE_SUCCESS,
  SET_SMURF_PUBLIC_SUCCESS,
  ACCOUNT_UPDATE_SUCCESS,
} = require("../constants/commands");

const help_command = (message, command, args) => {
  if (!args.length) {
    message.reply(ALL_COMMANDS);
  } else if (args.length === 1 && JSONHasValue(args[0], COMMANDS)) {
    if (args[0] === COMMANDS.getCommands) {
      message.reply(COMMAND_DESCRIPTIONS.getCommands);
    } else if (args[0] === COMMANDS.getAllRanks) {
      message.reply(COMMAND_DESCRIPTIONS.getAllRanks);
    } else if (args[0] === COMMANDS.getRankPlayer) {
      message.reply(COMMAND_DESCRIPTIONS.getRankPlayer);
    } else if (args[0] === COMMANDS.getSmurfCred) {
      message.reply(COMMAND_DESCRIPTIONS.getSmurfCred);
    } else {
      message.reply(COMMAND_DESCRIPTIONS.setSmurf);
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
