const {
  COMMAND_ERRORS,
  RANKS_INTRO,
  RANK_EMOJIS,
} = require("../constants/commands");

const { getAccounts } = require("../data/mongoDb");

const { getRankedDataByPUUIDs } = require("../fetching/fetching");

const { STATUS_CODES } = require("../constants/status_codes");

const {
  stringArrToString,
  updateNameAndTag,
  JSONHasKey,
  checkValidTierNum,
  rankSpecificity,
  checkArrayRespStatusMatch,
} = require("../services");

const ranks_command = (message, command, args) => {
  if (args.length <= 2) {
    let reply = RANKS_INTRO;
    getAccounts()
      .then((accountData, err) => {
        if (err) {
          throw err;
        } else {
          getRankedDataByPUUIDs(accountData.map((user) => user.puuid)).then(
            (rankedData, err) => {
              if (
                !checkArrayRespStatusMatch(rankedData, STATUS_CODES.ok) ||
                err
              ) {
                message.reply(COMMAND_ERRORS.getAllRanks_errorFetching);
              }
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
                  let hasError = false;
                  rankedData.forEach((data, index) => {
                    if (data.status !== STATUS_CODES.ok) {
                      hasError = true;
                      data.data = {
                        currenttierpatched: "Error",
                        name: accountData[index].name,
                        tag: accountData[index].tag,
                        elo: 0,
                      };
                    }
                  });
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
                  if (!hasError) {
                    updateNameAndTag(rankedData);
                  }
                }
              }
            }
          );
        }
      })
      .catch((err) => {
        console.error(err.message);
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
