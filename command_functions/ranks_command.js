const { COMMAND_ERRORS, RANKS_INTRO } = require("../constants/commands");

const { getAccounts } = require("../data/mongoDb");

const { getRankedDataByPUUIDs } = require("../fetching/fetching");

const {
  stringArrToString,
  mmrDataToString,
  updateNameAndTag,
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
