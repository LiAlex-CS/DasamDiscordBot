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
    getAccounts()
      .then((accountData, err) => {
        if (err) {
          throw err;
        } else {
          getRankedDataByPUUIDs(accountData.map((user) => user.puuid))
            .then((rankedData) => {
              if (args.length == 1 && !JSONHasKey(args[0], RANK_EMOJIS)) {
                message.reply(
                  args[0] + " " + COMMAND_ERRORS.getAllRanks_invalidRank
                );
              } else if (
                args.length == 2 &&
                (!JSONHasKey(args[0], RANK_EMOJIS) ||
                  !checkValidTierNum(args[1]))
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
                  const combinedData = accountData.map((data, index) => ({
                    rankedData: rankedData[index],
                    accountData: data,
                  }));
                  const sortedCombinedData = combinedData.sort(
                    (a, b) => b.rankedData.data.elo - a.rankedData.data.elo
                  );
                  const sortedAccountData = sortedCombinedData.map(
                    (data) => data.accountData
                  );
                  const sortedRankedData = sortedCombinedData.map(
                    (data) => data.rankedData
                  );
                  reply =
                    reply +
                    rankSpecificity(args, sortedRankedData, sortedAccountData);

                  if (
                    rankSpecificity(args, sortedRankedData, sortedAccountData)
                      .length === 0
                  ) {
                    reply = COMMAND_ERRORS.getAllRanks_noAccounts;
                  }

                  message.reply(reply);

                  updateNameAndTag(rankedData);
                }
              }
            })
            .catch((err) => {
              message.reply("error: " + err.message);
            });
        }
      })
      .catch((err) => {
        console.log(err);
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
