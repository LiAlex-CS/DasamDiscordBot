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

const rank_command = (message, command, args) => {
  if (args.length >= 2) {
    getRankedData(stringArrToString(args.slice(0, -1)), args[args.length - 1])
      .then((data) => {
        if (data.status !== 200) {
          throw data;
        } else {
          message.reply(mmrDataSingleToString(data));
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          message.reply(
            stringArrToString(args) + '" ' + COMMAND_ERRORS.getRankPlayer
          );
        } else if (parseInt(err.status, 10) === 500) {
          message.reply(
            stringArrToString(args) +
              '" ' +
              COMMAND_ERRORS.getRankPlayer_privateAccount
          );
        } else {
          message.reply("error: " + err);
        }
      });
  } else {
    message.reply(
      `"${command} ` +
        stringArrToString(args) +
        '" ' +
        COMMAND_ERRORS.getRankPlayer_invalidArgs
    );
  }
};

module.exports = { rank_command };
