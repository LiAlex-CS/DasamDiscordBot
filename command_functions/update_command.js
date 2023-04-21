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

const { getModifiedArguments, removeHashtagFromTag } = require("../services");

const update_command = async (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length === 4 || modifiedArgs.length === 2) {
    const name = modifiedArgs[0];
    const tag = removeHashtagFromTag(modifiedArgs[1]);
    const username = modifiedArgs.length === 4 ? modifiedArgs[2] : null;
    const password = modifiedArgs.length === 4 ? modifiedArgs[3] : null;
    const setPrivate = !username || !password;

    try {
      const valAccount = await getAccountByNameAndTag(
        name,
        tag,
        message.guildId
      );
      const isAdmin = await isDiscordUserAdmin(message.author.id);

      if (!valAccount) {
        message.reply(`**${name} #${tag}** ` + COMMAND_ERRORS.not_in_db);
      } else if (message.author.id !== valAccount.creator_disc_id || !isAdmin) {
        message.reply(COMMAND_ERRORS.unauthorized_modification);
      } else {
        if (setPrivate) {
          if (valAccount.private) {
            message.reply(
              `**${name} #${tag}** ` + COMMAND_ERRORS.already_private
            );
          } else {
            valAccount.username = null;
            valAccount.password = null;
            valAccount.private = true;
            valAccount.save((err) => {
              if (err) {
                message.reply(COMMAND_ERRORS.error_saving_val_account);
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
            if (err) {
              message.reply(COMMAND_ERRORS.error_saving_val_account);
            } else {
              message.reply(ACCOUNT_UPDATE_SUCCESS);
            }
          });
        }
      }
    } catch (error) {
      const errorResponses = {
        notFound: `"**${name} #${tag}**" ${COMMAND_ERRORS.updateSmurf_invalidAccount}`,
        forbidden: `"**${name} #${tag}**" ${COMMAND_ERRORS.updateSmurf_forbidden}`,
      };
      handleAPIError(message, error, errorResponses);
    }
  } else {
    message.reply(
      `"${command} ` +
        argsAsString +
        '" ' +
        COMMAND_ERRORS.updateSmurf_invalidArgs
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { update_command };
