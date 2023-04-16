const {
  COMMAND_ERRORS,
  HAS_SPACES_REMINDER,
  SET_SMURF_PRIVATE_SUCCESS,
  SET_SMURF_PUBLIC_SUCCESS,
} = require("../constants/commands");

const { STATUS_CODES_API } = require("../constants/status_codes");

const {
  addToCollection,
  getAccountByPuuid,
  addDiscordUser,
} = require("../data/mongoDb");

const { getUserData } = require("../fetching/fetching");

const { handleAPIError } = require("../fetching/errorHandling");

const { getModifiedArguments, removeHashtagFromTag } = require("../services");

const addSmurf_command = (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length === 4 || modifiedArgs.length === 2) {
    const name = modifiedArgs[0];
    const tag = removeHashtagFromTag(modifiedArgs[1]);
    const username = modifiedArgs.length === 4 ? modifiedArgs[2] : null;
    const password = modifiedArgs.length === 4 ? modifiedArgs[3] : null;
    getUserData(name, tag)
      .then((fetchData) => {
        if (parseInt(fetchData.status, 10) !== STATUS_CODES_API.ok) {
          throw fetchData;
        } else {
          const isPrivate = !username || !password;

          getAccountByPuuid(fetchData.data.puuid, message.guildId).then(
            (data) => {
              if (!data) {
                addToCollection(
                  {
                    name: name,
                    tag: tag,
                    puuid: fetchData.data.puuid,
                    username: username,
                    password: password,
                    private: isPrivate,
                    creator_disc_id: message.author.id,
                    guild: message.guildId,
                  },
                  (err, name, tag) => {
                    if (err) {
                      message.reply(COMMAND_ERRORS.error_saving_val_account);
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
                          message.reply(
                            COMMAND_ERRORS.error_saving_discord_account
                          );
                        }
                      });
                    }
                  }
                );
              } else {
                message.reply(
                  `**${name} #${tag}** ` +
                    COMMAND_ERRORS.addSmurf_nonUnique_account
                );
              }
            }
          );
        }
      })
      .catch((err) => {
        const errorResponses = {
          notFound: `**${name}** and **#${tag}** ${COMMAND_ERRORS.addSmurf}`,
          forbidden: `**${name} #${tag}** ${COMMAND_ERRORS.addSmurf_forbidden}`,
        };
        handleAPIError(message, err, errorResponses);
      });
  } else {
    message.reply(
      `"${command} ` +
        argsAsString +
        '" ' +
        COMMAND_ERRORS.getSmurfCred_invalidArgs
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { addSmurf_command };
