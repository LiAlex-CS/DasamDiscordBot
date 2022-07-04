const {
  COMMAND_ERRORS,
  HAS_SPACES_REMINDER,
  SET_SMURF_PRIVATE_SUCCESS,
  SET_SMURF_PUBLIC_SUCCESS,
} = require("../constants/commands");

const { STATUS_CODES } = require("../constants/status_codes");

const { addToCollection, getAccountByPuuid } = require("../data/mongoDb");

const { getUserData } = require("../fetching/fetching");

const { stringArrToString, getModifiedArguments } = require("../services");

const setSmurf_command = (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length === 4 || modifiedArgs.length === 2) {
    getUserData(modifiedArgs[0], modifiedArgs[1])
      .then((fetchData) => {
        if (parseInt(fetchData.status, 10) !== STATUS_CODES.ok) {
          throw fetchData;
        } else {
          const private = !modifiedArgs[2] || !modifiedArgs[3];

          getAccountByPuuid(fetchData.data.puuid).then((data) => {
            if (!data) {
              addToCollection(
                {
                  name: modifiedArgs[0],
                  tag: modifiedArgs[1],
                  puuid: fetchData.data.puuid,
                  username: private ? null : modifiedArgs[2],
                  password: private ? null : modifiedArgs[3],
                  private: private,
                  creator_disc_id: message.author.id,
                },
                (name, tag) => {
                  message.reply(
                    `${name} #${tag} ${
                      private
                        ? SET_SMURF_PRIVATE_SUCCESS
                        : SET_SMURF_PUBLIC_SUCCESS
                    }`
                  );
                }
              );
            } else {
              message.reply(
                `${modifiedArgs[0]} #${modifiedArgs[1]} ` +
                  COMMAND_ERRORS.setSmurf_nonUnique_account
              );
            }
          });
        }
      })
      .catch((err) => {
        if (parseInt(err.status, 10) === STATUS_CODES.notFound) {
          message.reply(
            `${modifiedArgs[0]} and ${modifiedArgs[1]} ` +
              COMMAND_ERRORS.setSmurf
          );
        } else if (
          parseInt(err.status, 10) === STATUS_CODES.internalServerError
        ) {
          message.reply(
            `${modifiedArgs[0]} #${modifiedArgs[1]} ` +
              COMMAND_ERRORS.setSmurf_privateAccount
          );
        } else {
          message.reply("Error: " + err.message);
        }
      });
  } else {
    message.reply(
      `"${command}` +
        stringArrToString(args) +
        '" ' +
        COMMAND_ERRORS.getSmurfCred_invalidArgs
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { setSmurf_command };
