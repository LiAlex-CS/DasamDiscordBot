const {
  COMMAND_ERRORS,
  HAS_SPACES_REMINDER,
  ACCOUNT_UPDATE_SUCCESS,
} = require("../constants/commands");

const {
  getAccountByNameAndTag,
  isDiscordUserAdmin,
} = require("../data/mongoDb");

const { getModifiedArguments, removeHashtagFromTag } = require("../services");

const makePublic_command = async (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length === 4) {
    const name = modifiedArgs[0];
    const tag = removeHashtagFromTag(modifiedArgs[1]);
    const username = modifiedArgs[2];
    const password = modifiedArgs[3];
    const valAccount = await getAccountByNameAndTag(name, tag);
    const isAdmin = await isDiscordUserAdmin(message.author.id);

    if (!valAccount) {
      message.reply(`**${name} #${tag}** ` + COMMAND_ERRORS.not_in_db);
    } else if (message.author.id !== valAccount.creator_disc_id || !isAdmin) {
      message.reply("not your smurf. not premeted");
    } else if (!valAccount.private) {
      message.reply(
        `**${name} #${tag}** ` + COMMAND_ERRORS.makePublic_already_public
      );
    } else {
      valAccount.username = username;
      valAccount.password = password;
      valAccount.private = false;
      valAccount.save((err) => {
        if (err) {
          message.reply("error saving account status");
        } else {
          message.reply(ACCOUNT_UPDATE_SUCCESS);
        }
      });
    }
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
