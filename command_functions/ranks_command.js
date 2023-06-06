const {
  COMMAND_ERRORS,
  RANK_EMOJIS,
  MAX_ACCOUNTS_PER_PAGE,
} = require("../constants/commands");

const { getAccountsByGuild } = require("../data/mongoDb");

const { sendRanksMessage } = require("./ranks/send_ranks_message");

const { getRankedDataByPUUIDs } = require("../fetching/fetching");

const {
  generateLoadingTime,
  removeLoadingInstance,
} = require("../fetching/loading");

const { handleAPIError } = require("../fetching/error_handling");

const { STATUS_CODES_API } = require("../constants/status_codes");

const {
  stringArrToString,
  updateNameAndTag,
  JSONHasKey,
  checkValidTierNum,
  checkArrayRespStatusMatch,
  filterByRankAndTier,
  fixRank,
} = require("../services");

const ranksCommand = async (message, command, args) => {
  let dataLoading = null;
  if (args.length <= 2) {
    const rank = fixRank(args[0]);
    const tier = args.length === 2 ? args[1] : null;
    dataLoading = generateLoadingTime(message);

    try {
      const accountData = await getAccountsByGuild(message.guildId);
      const rankedData = await getRankedDataByPUUIDs(
        accountData.map((user) => user.puuid)
      );

      if (!checkArrayRespStatusMatch(rankedData, STATUS_CODES_API.ok)) {
        message.reply(COMMAND_ERRORS.getAllRanksErrorFetching);
      }

      if (args.length === 1 && !JSONHasKey(rank, RANK_EMOJIS)) {
        removeLoadingInstance(dataLoading);
        message.reply(`${rank} ${COMMAND_ERRORS.getAllRanksInvalidRank}`);
      } else if (
        args.length === 2 &&
        (!JSONHasKey(rank, RANK_EMOJIS) || !checkValidTierNum(tier))
      ) {
        removeLoadingInstance(dataLoading);
        message.reply(
          `${rank} ${tier} ${COMMAND_ERRORS.getAllRanksInvalidRankOrTier}`
        );
      } else {
        removeLoadingInstance(dataLoading);
        if (rank === "Radiant" && args.length !== 1) {
          message.reply(COMMAND_ERRORS.getAllRanksInvalidTierRadiant);
        } else {
          let hasError = false;
          rankedData.forEach((data, index) => {
            if (data.status !== STATUS_CODES_API.ok) {
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

          const filteredData = filterByRankAndTier(
            sortedCombinedData,
            rank,
            tier
          );

          const sortedFilteredAccountData = filteredData.map(
            (data) => data.accountData
          );
          const sortedFilteredRankedData = filteredData.map(
            (data) => data.rankedData
          );

          const totalPages = Math.ceil(
            sortedFilteredAccountData.length / MAX_ACCOUNTS_PER_PAGE
          );

          sendRanksMessage(
            message,
            0,
            totalPages,
            sortedFilteredRankedData,
            sortedFilteredAccountData
          );

          if (!hasError) {
            updateNameAndTag(message.guildId, rankedData, (err) => {
              removeLoadingInstance(dataLoading);
              message.reply("Error: " + err.message);
            });
          }
        }
      }
    } catch (error) {
      handleAPIError(message, error);
    }
  } else {
    message.reply(
      `*${command} ${stringArrToString(args)}* ${
        COMMAND_ERRORS.getAllRanksInvalidArgs
      }`
    );
  }
};

module.exports = { ranksCommand };
