const { COMMAND_ERRORS, RANK_EMOJIS } = require("../constants/commands");

const { STATUS_CODES_API } = require("../constants/status_codes");

const { getRankedData } = require("../fetching/fetching");

const {
  generateLoadingTime,
  removeLoadingInstance,
} = require("../fetching/loading");

const { handleAPIError } = require("../fetching/errorHandling");

const {
  mmrDataSingleToString,
  getRankFromRankAndTier,
  removeHashtagFromTag,
  parseArgsFromArgsAsString,
} = require("../services");

const rankCommand = async (message, command, argsAsString) => {
  const parsedArgs = parseArgsFromArgsAsString(argsAsString);
  if (parsedArgs.length === 2) {
    const dataLoading = generateLoadingTime(message);
    const name = parsedArgs[0];
    const tag = removeHashtagFromTag(parsedArgs[1]);

    try {
      const rankData = await getRankedData(name, tag);
      if (parseInt(rankData.status, 10) !== STATUS_CODES_API.ok) {
        throw rankData;
      } else {
        const rank = getRankFromRankAndTier(rankData.data.currenttierpatched);

        const rankEmoji = RANK_EMOJIS[rank];

        removeLoadingInstance(dataLoading);
        message.reply(`${rankEmoji} ${mmrDataSingleToString(rankData)}`);
      }
    } catch (error) {
      removeLoadingInstance(dataLoading);
      const errorResponses = {
        notFound: `"**${name} #${tag}**" ${COMMAND_ERRORS.getRankPlayer}`,
      };
      handleAPIError(message, error, errorResponses);
    }
  } else {
    message.reply(
      `*${command} ${argsAsString}* ${COMMAND_ERRORS.getRankPlayerInvalidArgs}`
    );
  }
};

module.exports = { rankCommand };
