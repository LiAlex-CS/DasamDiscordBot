const {
  COMMAND_ERRORS,
  HAS_SPACES_REMINDER,
  ACCOUNT_UPDATE_SUCCESS,
} = require("../constants/commands");

const {
  getAccountByNameAndTag,
  isDiscordUserAdmin,
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

const makePrivateCommand = async (message, command, argsAsString) => {
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
      } else if (message.author.id !== valAccount.creator_disc_id || !isAdmin) {
        removeLoadingInstance(savingInstance);
        message.reply(COMMAND_ERRORS.unauthorizedModification);
      } else if (valAccount.private) {
        removeLoadingInstance(savingInstance);
        message.reply(`**${name} #${tag}** ${COMMAND_ERRORS.alreadyPrivate}`);
      } else {
        valAccount.username = null;
        valAccount.password = null;
        valAccount.private = true;
        valAccount.save((err) => {
          removeLoadingInstance(savingInstance);
          if (err) {
            message.reply(COMMAND_ERRORS.errorSavingValorantAccount);
          } else {
            message.reply(ACCOUNT_UPDATE_SUCCESS);
          }
        });
      }
    } catch (error) {
      removeLoadingInstance(savingInstance);
      const errorResponses = {
        notFound: `"**${name} #${tag}**" ${COMMAND_ERRORS.makePrivateInvalidAccount}`,
        forbidden: `"**${name} #${tag}**" ${COMMAND_ERRORS.makePrivateForbidden}`,
      };
      handleAPIError(message, error, errorResponses);
    }
  } else {
    message.reply(
      `*${command} ${argsAsString}* ${COMMAND_ERRORS.makePrivateInvalidArgs}`
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { makePrivateCommand };
