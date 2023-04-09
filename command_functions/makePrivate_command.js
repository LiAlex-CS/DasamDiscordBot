const {
  COMMAND_ERRORS,
  HAS_SPACES_REMINDER,
  ACCOUNT_UPDATE_SUCCESS,
} = require("../constants/commands");

const { findOneByNameAndTagAndUpdate } = require("../data/mongoDb");

const { getModifiedArguments, removeHashtagFromTag } = require("../services");

const makePrivate_command = (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length === 2) {
    const name = modifiedArgs[0];
    const tag = removeHashtagFromTag(modifiedArgs[1]);

    findOneByNameAndTagAndUpdate(name, tag, (account, successSaveCallback) => {
      if (!account) {
        message.reply(`**${name} #${tag}** ` + COMMAND_ERRORS.not_in_db);
      } else if (account.private) {
        message.reply(
          `**${name} #${tag}** ` + COMMAND_ERRORS.makePrivate_already_private
        );
      } else {
        account.username = null;
        account.password = null;
        account.private = true;
        successSaveCallback();
        message.reply(ACCOUNT_UPDATE_SUCCESS);
      }
    });
  } else {
    message.reply(
      `"${command} ` +
        argsAsString +
        '" ' +
        COMMAND_ERRORS.makePrivate_invalidArgs
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { makePrivate_command };
