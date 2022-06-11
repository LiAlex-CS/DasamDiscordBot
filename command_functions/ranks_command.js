const {
  COMMAND_ERRORS,
  RANKS_INTRO,
  RANK_EMOJIS,
} = require("../constants/commands");

const { getAccounts } = require("../data/mongoDb");

const { getRankedDataByPUUIDs } = require("../fetching/fetching");

const {
  stringArrToString,
  updateNameAndTag,
  JSONHasKey,
  checkValidTierNum,
  rankSpecificity,
} = require("../services");

const ranks_command = (message, command, args) => {
  if (args.length <= 2) {
    let reply = RANKS_INTRO;
    getAccounts().then((accountData, err) => {
      if (err) {
        console.error(err);
      } else {
        getRankedDataByPUUIDs(accountData.map((user) => user.puuid))
          .then((data) => {
            if (args.length == 1 && !JSONHasKey(args[0], RANK_EMOJIS)) {
              message.reply(
                args[0] + " " + COMMAND_ERRORS.getAllRanks_invalidRank
              );
            } else if (
              args.length == 2 &&
              (!JSONHasKey(args[0], RANK_EMOJIS) || !checkValidTierNum(args[1]))
            ) {
              message.reply(
                args[0] +
                  " " +
                  args[1] +
                  " " +
                  COMMAND_ERRORS.getAllRanks_invalidRankOrTier
              );
            } else {
              if (args[0] === "Radiant" && args.length !== 1) {
                message.reply(COMMAND_ERRORS.getAllRanks_invalidTierRadiant);
              } else {
                reply = reply + rankSpecificity(args, data, accountData);

                if (rankSpecificity(args, data, accountData).length === 0) {
                  reply = COMMAND_ERRORS.getAllRanks_noAccounts;
                }

                message.reply(reply);

                updateNameAndTag(data);
              }
            }
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
