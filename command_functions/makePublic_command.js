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
  parseArgsFromArgsAsString,
  removeHashtagFromTag,
  stringArrToString,
} = require("../services");

const makePublic_command = async (message, command, argsAsString) => {
  const parsedArgs = parseArgsFromArgsAsString(argsAsString);
  if (parsedArgs.length === 4) {
    const name = parsedArgs[0];
    const tag = removeHashtagFromTag(parsedArgs[1]);
    const username = parsedArgs[2];
    const password = parsedArgs[3];

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
      } else if (!valAccount.private) {
        message.reply(
          `**${name} #${tag}** ${COMMAND_ERRORS.makePublic_already_public}`
        );
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
    } catch (error) {
      const errorResponses = {
        notFound: `"**${name} #${tag}**" ${COMMAND_ERRORS.makePublic_invalidAccount}`,
        forbidden: `"**${name} #${tag}**" ${COMMAND_ERRORS.makePublic_forbidden}`,
      };
      handleAPIError(message, error, errorResponses);
    }
  } else {
    message.reply(
      `*${command} ${argsAsString}* ${COMMAND_ERRORS.makePublic_invalidArgs}`
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { makePublic_command };
