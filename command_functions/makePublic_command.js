const {
  COMMAND_ERRORS,
  HAS_SPACES_REMINDER,
  ACCOUNT_UPDATE_SUCCESS,
} = require("../constants/commands");

const { findOneByNameAndTagAndUpdate } = require("../data/mongoDb");

const { getModifiedArguments, removeHashtagFromTag } = require("../services");

const makePublic_command = (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length === 4) {
    const name = modifiedArgs[0];
    const tag = removeHashtagFromTag(modifiedArgs[1]);
    const username = modifiedArgs[2];
    const password = modifiedArgs[3];

    findOneByNameAndTagAndUpdate(name, tag, (account, successSaveCallback) => {
      if (!account) {
        message.reply(`**${name} #${tag}** ` + COMMAND_ERRORS.not_in_db);
      } else if (!account.private) {
        message.reply(
          `**${name} #${tag}** ` + COMMAND_ERRORS.makePublic_already_public
        );
      } else {
        account.username = username;
        account.password = password;
        account.private = false;
        successSaveCallback();
        message.reply(ACCOUNT_UPDATE_SUCCESS);
      }
    });
  } else {
    message.reply(
      `"${command} ` +
        argsAsString +
        '" ' +
        COMMAND_ERRORS.makePublic_invalidArgs
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { makePublic_command };
