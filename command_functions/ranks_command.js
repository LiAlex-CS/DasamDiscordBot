const {
  PREFIX,
  COMMANDS,
  ALL_COMMANDS,
  UNKNOWN_COMMAND,
  COMMAND_ERRORS,
  COMMAND_DESCRIPTIONS,
  RANKS_INTRO,
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

const ranks_command = (message, command, args) => {
  if (!args.length) {
    let reply = RANKS_INTRO;
    getAccounts().then((accountData, err) => {
      if (err) {
        console.error(err);
      } else {
        getRankedDataByPUUIDs(accountData.map((user) => user.puuid))
          .then((data) => {
            reply = reply + mmrDataToString(data, accountData);
            message.reply(reply);
            updateNameAndTag(data);
          })
          .catch((err) => {
            message.reply("error: " + err);
          });
      }
    });
  } else {
    message.reply(
      `"${command} ` +
        stringArrToString(args) +
        '" ' +
        COMMAND_ERRORS.getAllRanks_invalidArgs
    );
  }
};

module.exports = { ranks_command };
