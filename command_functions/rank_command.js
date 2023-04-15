const { COMMAND_ERRORS, RANK_EMOJIS } = require("../constants/commands");

const { STATUS_CODES } = require("../constants/status_codes");

const { getRankedData } = require("../fetching/fetching");

const {
  generateLoadingTime,
  removeLoadingInstance,
} = require("../fetching/loading");

const { handleAPIError } = require("../fetching/errorHandling");

const {
  stringArrToString,
  mmrDataSingleToString,
  getRankFromRankAndTier,
  removeHashtagFromTag,
} = require("../services");

const rank_command = (message, command, args) => {
  if (args.length >= 2) {
    const dataLoading = generateLoadingTime(message);
    const name = stringArrToString(args.slice(0, -1));
    const tag = removeHashtagFromTag(args[args.length - 1]);
    getRankedData(name, tag)
      .then((data, err) => {
        if (parseInt(data.status, 10) !== STATUS_CODES.ok || err) {
          throw data;
        } else {
          const rank = getRankFromRankAndTier(data.data.currenttierpatched);

          const rankEmoji = RANK_EMOJIS[rank];

          removeLoadingInstance(dataLoading);
          message.reply(rankEmoji + " " + mmrDataSingleToString(data));
        }
      })
      .catch((err) => {
        removeLoadingInstance(dataLoading);
        const errorResponses = {
          notFound: `"**${name} #${tag}**" ${COMMAND_ERRORS.getRankPlayer}`,
        };
        handleAPIError(message, err, errorResponses);
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
