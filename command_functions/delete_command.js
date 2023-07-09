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

const { handleAPIError } = require("../fetching/error_handling");

const {
  generateLoadingTime,
  removeLoadingInstance,
} = require("../fetching/loading");

const { SAVING_MESSAGE } = require("../constants/fetching_consts");

const {
  parseArgsFromArgsAsString,
  removeHashtagFromTag,
} = require("../services");

const deleteCommand = async (message, command, argsAsString) => {
  const parsedArgs = parseArgsFromArgsAsString(argsAsString);
  if (parsedArgs.length === 2) {
    const name = parsedArgs[0];
    const tag = removeHashtagFromTag(parsedArgs[1]);

    const savingInstance = generateLoadingTime(message, {
      loadingMessage: SAVING_MESSAGE,
    });

    try {
      const valAccount = await getAccountByNameAndTag(
        name,
        tag,
        message.guildId
      );
      const isAdmin = await isDiscordUserAdmin(message.author.id);

      if (!valAccount) {
        removeLoadingInstance(savingInstance);
        message.reply(`**${name} #${tag}** ${COMMAND_ERRORS.notInDatabase}`);
      } else if (message.author.id !== valAccount.creator_disc_id && !isAdmin) {
        removeLoadingInstance(savingInstance);
        message.reply(COMMAND_ERRORS.unauthorizedModification);
      } else {
        await deleteFromCollection(valAccount.puuid, message.guildId);
        removeLoadingInstance(savingInstance);
        message.reply(ACCOUNT_DELETE_SUCCESS);
      }
    } catch (error) {
      const errorResponses = {
        notFound: `"**${name} #${tag}**" ${COMMAND_ERRORS.deleteInvalidAccount}`,
        forbidden: `"**${name} #${tag}**" ${COMMAND_ERRORS.deleteForbidden}`,
      };
      removeLoadingInstance(savingInstance);
      handleAPIError(message, error, errorResponses);
    }
  } else {
    message.reply(
      `*${command} ${argsAsString}* ${COMMAND_ERRORS.deleteInvalidArgs}`
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { deleteCommand };
