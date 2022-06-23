const {
  COMMAND_ERRORS,
  HAS_SPACES_REMINDER,
  ACCOUNT_UPDATE_SUCCESS,
} = require("../constants/commands");

const { findOneByNameAndTagAndUpdate } = require("../data/mongoDb");

const { stringArrToString, getModifiedArguments } = require("../services");

const makePrivate_command = (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length === 2) {
    findOneByNameAndTagAndUpdate(
      modifiedArgs[0],
      modifiedArgs[1],
      (account, successSaveCallback) => {
        if (!account) {
          message.reply(
            `${modifiedArgs[0]} #${modifiedArgs[1]} ` + COMMAND_ERRORS.not_in_db
          );
        } else if (account.private) {
          message.reply(
            `${modifiedArgs[0]} #${modifiedArgs[1]} ` +
              COMMAND_ERRORS.makePrivate_already_private
          );
        } else {
          account.username = null;
          account.password = null;
          account.private = true;
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
        COMMAND_ERRORS.makePrivate_invalidArgs
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { makePrivate_command };
