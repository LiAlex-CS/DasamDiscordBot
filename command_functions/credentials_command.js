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

const credentials_command = (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length >= 2) {
    const name = stringArrToString(modifiedArgs.slice(0, -1));
    const tag = modifiedArgs[modifiedArgs.length - 1];

    getAccountByNameAndTag(name, tag).then((data) => {
      if (Object.keys(data).length) {
        if (data.private) {
          message.reply(
            `User: ${name} #${tag} ` +
              COMMAND_ERRORS.getSmurfCred_privateAccount
          );
        } else {
          message.reply(
            `For account: ${name} #${tag}, Username: ${data.username} Password: ${data.password}`
          );
        }
      } else {
        message.reply(`User: ${name} #${tag} ` + COMMAND_ERRORS.getSmurfCred);
      }
    });
  } else {
    message.reply(
      `"${command} ` +
        stringArrToString(modifiedArgs) +
        '" ' +
        COMMAND_ERRORS.getSmurfCred_invalidArgs
    );
  }
};

module.exports = { credentials_command };
