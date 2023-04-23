const {
  COMMAND_ERRORS,
  RANKS_INTRO,
  REACTIONS_DESCRIPTION,
  RANK_EMOJIS,
} = require("../constants/commands");

const { getAccountsByGuild } = require("../data/mongoDb");

const { ranksReaction_command } = require("./ranks_reaction_command");

const { getRankedDataByPUUIDs } = require("../fetching/fetching");
const {
  generateLoadingTime,
  removeLoadingInstance,
} = require("../fetching/loading");
const { handleAPIError } = require("../fetching/errorHandling");

const { STATUS_CODES_API } = require("../constants/status_codes");
const { REGION_INDICATOR_SYMBOLS } = require("../constants/commands");

const {
  stringArrToString,
  updateNameAndTag,
  JSONHasKey,
  checkValidTierNum,
  mmrDataToString,
  checkArrayRespStatusMatch,
  filterByRankAndTier,
  fixRank,
} = require("../services");

const ranks_command = async (message, command, args) => {
  let dataLoading = null;
  if (args.length <= 2) {
    let reply = RANKS_INTRO;
    const rank = fixRank(args[0]);
    const tier = args.length === 2 ? args[1] : null;
    dataLoading = generateLoadingTime(message);

    try {
      const accountData = await getAccountsByGuild(message.guildId);
      const rankedData = await getRankedDataByPUUIDs(
        accountData.map((user) => user.puuid)
      );

      if (!checkArrayRespStatusMatch(rankedData, STATUS_CODES_API.ok)) {
        message.reply(COMMAND_ERRORS.getAllRanks_errorFetching);
      }

      if (args.length === 1 && !JSONHasKey(rank, RANK_EMOJIS)) {
        removeLoadingInstance(dataLoading);
        message.reply(`${rank} ${COMMAND_ERRORS.getAllRanks_invalidRank}`);
      } else if (
        args.length === 2 &&
        (!JSONHasKey(rank, RANK_EMOJIS) || !checkValidTierNum(tier))
      ) {
        removeLoadingInstance(dataLoading);
        message.reply(
          `${rank} ${tier} ${COMMAND_ERRORS.getAllRanks_invalidRankOrTier}`
        );
      } else {
        removeLoadingInstance(dataLoading);
        if (rank === "Radiant" && args.length !== 1) {
          message.reply(COMMAND_ERRORS.getAllRanks_invalidTierRadiant);
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

          reply =
            reply +
            mmrDataToString(
              sortedFilteredRankedData,
              sortedFilteredAccountData,
              Object.keys(REGION_INDICATOR_SYMBOLS)
            );

          reply += REACTIONS_DESCRIPTION;

          if (filteredData.length === 0) {
            reply = COMMAND_ERRORS.getAllRanks_noAccounts;
          }

          message.reply(reply).then((reaction) => {
            ranksReaction_command(reaction, message, sortedFilteredAccountData);
          });

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
        COMMAND_ERRORS.getAllRanks_invalidArgs
      }`
    );
  }
};

module.exports = { ranks_command };
