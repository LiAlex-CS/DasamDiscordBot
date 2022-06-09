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

const makePublic_command = (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length === 4) {
    findOneByNameAndTagAndUpdate(
      modifiedArgs[0],
      modifiedArgs[1],
      (account, successCallback) => {
        if (!account) {
          message.reply(
            `${modifiedArgs[0]} #${modifiedArgs[1]} ` + COMMAND_ERRORS.not_in_db
          );
        } else if (!account.private) {
          message.reply(
            `${modifiedArgs[0]} #${modifiedArgs[1]} ` +
              COMMAND_ERRORS.makePublic_already_public
          );
        } else {
          account.username = modifiedArgs[2];
          account.password = modifiedArgs[3];
          account.private = false;
          successCallback();
          message.reply(ACCOUNT_UPDATE_SUCCESS);
        }
      }
    );
  } else {
    message.reply(
      `"${command}` +
        stringArrToString(args) +
        '" ' +
        COMMAND_ERRORS.makePublic_invalidArgs
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { makePublic_command };
