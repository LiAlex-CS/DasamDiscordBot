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

const updateCommand = async (message, command, argsAsString) => {
  const parsedArgs = parseArgsFromArgsAsString(argsAsString);
  if (parsedArgs.length === 4 || parsedArgs.length === 2) {
    const name = parsedArgs[0];
    const tag = removeHashtagFromTag(parsedArgs[1]);
    const username = parsedArgs.length === 4 ? parsedArgs[2] : null;
    const password = parsedArgs.length === 4 ? parsedArgs[3] : null;
    const setPrivate = !username || !password;

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
      } else {
        if (setPrivate) {
          if (valAccount.private) {
            removeLoadingInstance(savingInstance);
            message.reply(
              `**${name} #${tag}** ${COMMAND_ERRORS.alreadyPrivate}`
            );
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
      }
    } catch (error) {
      removeLoadingInstance(savingInstance);
      const errorResponses = {
        notFound: `"**${name} #${tag}**" ${COMMAND_ERRORS.updateSmurfInvalidAccount}`,
        forbidden: `"**${name} #${tag}**" ${COMMAND_ERRORS.updateSmurfForbidden}`,
      };
      handleAPIError(message, error, errorResponses);
    }
  } else {
    message.reply(
      `*${command} ${argsAsString}* ${COMMAND_ERRORS.updateSmurfInvalidArgs}`
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { updateCommand };
