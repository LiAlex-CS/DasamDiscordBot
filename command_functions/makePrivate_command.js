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

const makePrivate_command = (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length === 2) {
    findOneByNameAndTagAndUpdate(
      modifiedArgs[0],
      modifiedArgs[1],
      (account, successCallback) => {
        if (!account) {
          message.reply(
            `${modifiedArgs[0]} #${modifiedArgs[1]} ` + COMMAND_ERRORS.not_in_db
          );
        } else if (account.private) {
          message.reply(
            `${modifiedArgs[0]} #${modifiedArgs[1]} ` +
              COMMAND_ERRORS.makePrivate_already_private
          );
        } else {
          account.username = null;
          account.password = null;
          account.private = true;
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
        COMMAND_ERRORS.makePrivate_invalidArgs
    );
    message.reply(HAS_SPACES_REMINDER);
  }
};

module.exports = { makePrivate_command };
