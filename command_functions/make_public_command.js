const {
  COMMAND_ERRORS,
  HAS_SPACES_REMINDER,
  ACCOUNT_UPDATE_SUCCESS,
} = require("../constants/commands");

const {
  getAccountByNameAndTag,
  isDiscordUserAdmin,
} = require("../data/mongoDb");

const { handleAPIError } = require("../fetching/errorHandling");

const {
  generateLoadingTime,
  removeLoadingInstance,
} = require("../fetching/loading");

const { SAVING_MESSAGE } = require("../constants/fetching_consts");

const {
  parseArgsFromArgsAsString,
  removeHashtagFromTag,
} = require("../services");

const makePublicCommand = async (message, command, argsAsString) => {
  const parsedArgs = parseArgsFromArgsAsString(argsAsString);
  if (parsedArgs.length === 4) {
    const name = parsedArgs[0];
    const tag = removeHashtagFromTag(parsedArgs[1]);
    const username = parsedArgs[2];
    const password = parsedArgs[3];

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
      } else if (!valAccount.private) {
        removeLoadingInstance(savingInstance);
        message.reply(
          `**${name} #${tag}** ${COMMAND_ERRORS.makePublicAlreadyPublic}`
        );
      } else {
        valAccount.username = username;
        valAccount.password = password;
        valAccount.private = false;
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
        notFound: `"**${name} #${tag}**" ${COMMAND_ERRORS.makePublicInvalidAccount}`,
        forbidden: `"**${name} #${tag}**" ${COMMAND_ERRORS.makePublicForbidden}`,
      };
      handleAPIError(message, error, errorResponses);
    }
  } else {
    message.reply(
      `*${command} ${argsAsString}* ${COMMAND_ERRORS.makePublicInvalidArgs}`
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { makePublicCommand };
