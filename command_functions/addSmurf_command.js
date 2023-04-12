const {
  COMMAND_ERRORS,
  HAS_SPACES_REMINDER,
  SET_SMURF_PRIVATE_SUCCESS,
  SET_SMURF_PUBLIC_SUCCESS,
} = require("../constants/commands");

const { STATUS_CODES } = require("../constants/status_codes");

const {
  addToCollection,
  getAccountByPuuid,
  addDiscordUser,
} = require("../data/mongoDb");

const { getUserData } = require("../fetching/fetching");

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
        if (parseInt(fetchData.status, 10) !== STATUS_CODES.ok) {
          throw fetchData;
        } else {
          const isPrivate = !username || !password;

          getAccountByPuuid(fetchData.data.puuid).then((data) => {
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
          });
        }
      })
      .catch((err) => {
        const errorStatus = parseInt(err.status, 10);
        if (
          errorStatus === STATUS_CODES.notFound ||
          errorStatus == STATUS_CODES.clientError
        ) {
          message.reply(`${name} and ${tag} ` + COMMAND_ERRORS.addSmurf);
        } else if (errorStatus === STATUS_CODES.internalServerError) {
          message.reply(
            `**${name} #${tag}** ` + COMMAND_ERRORS.addSmurf_privateAccount
          );
        } else {
          message.reply("Error: " + err.message);
        }
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