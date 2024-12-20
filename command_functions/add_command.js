const {
  COMMAND_ERRORS,
  HAS_SPACES_REMINDER,
  SET_SMURF_PRIVATE_SUCCESS,
  SET_SMURF_PUBLIC_SUCCESS,
} = require("../constants/commands");

const { STATUS_CODES_API } = require("../constants/status_codes");

const {
  addToCollection,
  addDiscordUser,
  getAccountByPuuid,
} = require("../data/mongoDb");

const { getUserData } = require("../fetching/fetching");

const { handleAPIError } = require("../fetching/error_handling");

const {
  parseArgsFromArgsAsString,
  removeHashtagFromTag,
} = require("../services");

const addCommand = async (message, command, argsAsString) => {
  const parsedArgs = parseArgsFromArgsAsString(argsAsString);
  if (parsedArgs.length === 4 || parsedArgs.length === 2) {
    const name = parsedArgs[0];
    const tag = removeHashtagFromTag(parsedArgs[1]);
    const username = parsedArgs.length === 4 ? parsedArgs[2] : null;
    const password = parsedArgs.length === 4 ? parsedArgs[3] : null;
    const isPrivate = !username || !password;

    try {
      const valAccount = await getUserData(name, tag);

      if (valAccount.status !== STATUS_CODES_API.ok) {
        throw valAccount;
      } else {
        const accountInDatabase = await getAccountByPuuid(
          valAccount.data.puuid,
          message.guildId
        );
        if (!accountInDatabase) {
          addToCollection(
            {
              name: name,
              tag: tag,
              puuid: valAccount.data.puuid,
              username: username,
              password: password,
              private: isPrivate,
              creator_disc_id: message.author.id,
              guild: message.guildId,
            },
            (err) => {
              if (err) {
                message.reply(COMMAND_ERRORS.errorSavingValorantAccount);
              } else {
                message.reply(
                  `**${name} #${tag}** ${
                    isPrivate
                      ? SET_SMURF_PRIVATE_SUCCESS
                      : SET_SMURF_PUBLIC_SUCCESS
                  }`
                );
                addDiscordUser(message.author.id, (err) => {
                  if (err) {
                    message.reply(COMMAND_ERRORS.errorSavingDiscordAccount);
                  }
                });
              }
            }
          );
        } else {
          message.reply(
            `**${name} #${tag}** ${COMMAND_ERRORS.addNonUniqueAccount}`
          );
        }
      }
    } catch (error) {
      const errorResponses = {
        notFound: `**${name}** and **#${tag}** ${COMMAND_ERRORS.add}`,
        forbidden: `**${name} #${tag}** ${COMMAND_ERRORS.addForbidden}`,
      };
      handleAPIError(message, error, errorResponses);
    }
  } else {
    message.reply(
      `*${command} ${argsAsString}* ${COMMAND_ERRORS.getSmurfCredInvalidArgs}`
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { addCommand };
