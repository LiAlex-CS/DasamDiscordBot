const {
  PREFIX,
  COMMANDS,
  ALL_COMMANDS,
  UNKNOWN_COMMAND,
  COMMAND_ERRORS,
  COMMAND_DESCRIPTIONS,
  rank_INTRO,
  HAS_SPACES_REMINDER,
  SET_SMURF_PRIVATE_SUCCESS,
  SET_SMURF_PUBLIC_SUCCESS,
  ACCOUNT_UPDATE_SUCCESS,
} = require("../constants/commands");

const {
  getAccounts,
  getAccountByNameAndTag,
  addToCollection,
  findOneByNameAndTagAndUpdate,
  ServerApiVersion,
} = require("../data/mongoDb");

const {
  getRankedData,
  getUserData,
  getRankedDataByPUUIDs,
} = require("../fetching/fetching");

const {
  JSONHasValue,
  stringArrToString,
  mmrDataToString,
  updateNameAndTag,
  mmrDataSingleToString,
  getModifiedArguments,
} = require("../services");

const setSmurf_command = (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length === 4 || modifiedArgs.length === 2) {
    getUserData(modifiedArgs[0], modifiedArgs[1])
      .then((data) => {
        if (data.status !== 200) {
          throw data;
        } else {
          const private = !modifiedArgs[2] || !modifiedArgs[3];

          addToCollection(
            {
              name: modifiedArgs[0],
              tag: modifiedArgs[1],
              puuid: data.data.puuid,
              username: private ? null : modifiedArgs[2],
              password: private ? null : modifiedArgs[3],
              private: private,
            },
            (name, tag) => {
              message.reply(
                `${name} #${tag} ${
                  private ? SET_SMURF_PRIVATE_SUCCESS : SET_SMURF_PUBLIC_SUCCESS
                }`
              );
            }
          );
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
          console.log(err);
          message.reply("error: " + err);
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
