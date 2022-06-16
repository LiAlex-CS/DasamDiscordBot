const {
  COMMAND_ERRORS,
  HAS_SPACES_REMINDER,
  SET_SMURF_PRIVATE_SUCCESS,
  SET_SMURF_PUBLIC_SUCCESS,
} = require("../constants/commands");

const { addToCollection, getAccountByPuuid } = require("../data/mongoDb");

const { getUserData } = require("../fetching/fetching");

const { stringArrToString, getModifiedArguments } = require("../services");

const setSmurf_command = (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length === 4 || modifiedArgs.length === 2) {
    getUserData(modifiedArgs[0], modifiedArgs[1])
      .then((fetchData) => {
        if (fetchData.status !== 200) {
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
        if (err.status === 404) {
          message.reply(
            `${modifiedArgs[0]} and ${modifiedArgs[1]} ` +
              COMMAND_ERRORS.setSmurf
          );
        } else if (err.status === 500) {
          message.reply(
            `${modifiedArgs[0]} #${modifiedArgs[1]} ` +
              COMMAND_ERRORS.setSmurf_privateAccount
          );
        } else {
          console.error(err.message);
          message.reply("error: " + err.message);
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
