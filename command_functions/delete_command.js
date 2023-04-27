const {
  COMMAND_ERRORS,
  HAS_SPACES_REMINDER,
  ACCOUNT_DELETE_SUCCESS,
} = require("../constants/commands");

const {
  getAccountByNameAndTag,
  isDiscordUserAdmin,
  deleteFromCollection,
} = require("../data/mongoDb");

const { handleAPIError } = require("../fetching/errorHandling");

const {
  parseArgsFromArgsAsString,
  removeHashtagFromTag,
} = require("../services");

const delete_command = async (message, command, argsAsString) => {
  const parsedArgs = parseArgsFromArgsAsString(argsAsString);
  if (parsedArgs.length === 2) {
    const name = parsedArgs[0];
    const tag = removeHashtagFromTag(parsedArgs[1]);

    try {
      const valAccount = await getAccountByNameAndTag(
        name,
        tag,
        message.guildId
      );
      const isAdmin = await isDiscordUserAdmin(message.author.id);

      if (!valAccount) {
        message.reply(`**${name} #${tag}** ${COMMAND_ERRORS.not_in_db}`);
      } else if (message.author.id !== valAccount.creator_disc_id || !isAdmin) {
        message.reply(COMMAND_ERRORS.unauthorized_modification);
      } else {
        await deleteFromCollection(valAccount.puuid, message.guildId);
        message.reply(ACCOUNT_DELETE_SUCCESS);
      }
    } catch (error) {
      const errorResponses = {
        notFound: `"**${name} #${tag}**" ${COMMAND_ERRORS.delete_invalidAccount}`,
        forbidden: `"**${name} #${tag}**" ${COMMAND_ERRORS.delete_forbidden}`,
      };
      handleAPIError(message, error, errorResponses);
    }
  } else {
    message.reply(
      `*${command} ${argsAsString}* ${COMMAND_ERRORS.delete_invalidArgs}`
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { delete_command };
