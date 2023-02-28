const {
  COMMAND_ERRORS,
  HAS_SPACES_REMINDER,
  ACCOUNT_UPDATE_SUCCESS,
} = require("../constants/commands");

const { findOneByNameAndTagAndUpdate } = require("../data/mongoDb");

const { stringArrToString, getModifiedArguments } = require("../services");

const makePublic_command = (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length === 4) {
    findOneByNameAndTagAndUpdate(
      modifiedArgs[0],
      modifiedArgs[1],
      (account, successSaveCallback) => {
        if (!account) {
          message.reply(
            `**${modifiedArgs[0]} #${modifiedArgs[1]}** ` +
              COMMAND_ERRORS.not_in_db
          );
        } else if (!account.private) {
          message.reply(
            `**${modifiedArgs[0]} #${modifiedArgs[1]}** ` +
              COMMAND_ERRORS.makePublic_already_public
          );
        } else {
          account.username = modifiedArgs[2];
          account.password = modifiedArgs[3];
          account.private = false;
          successSaveCallback();
          message.reply(ACCOUNT_UPDATE_SUCCESS);
        }
      }
    );
  } else {
    message.reply(
      `"${command}` +
        stringArrToString(args) +
        '" ' +
        COMMAND_ERRORS.makePublic_invalidArgs
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { makePublic_command };
