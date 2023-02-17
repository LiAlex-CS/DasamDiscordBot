const { COMMAND_ERRORS, RANK_EMOJIS } = require("../constants/commands");

const { STATUS_CODES } = require("../constants/status_codes");

const { getRankedData } = require("../fetching/fetching");

const {
  generateLoadingTime,
  removeLoadingInstance,
} = require("../fetching/loading");

const {
  stringArrToString,
  mmrDataSingleToString,
  getRankFromRankAndTier,
} = require("../services");

const rank_command = (message, command, args) => {
  if (args.length >= 2) {
    const dataLoading = generateLoadingTime(message);
    getRankedData(stringArrToString(args.slice(0, -1)), args[args.length - 1])
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
        if (parseInt(err.status, 10) === STATUS_CODES.notFound) {
          message.reply(
            `"${stringArrToString(args.slice(0, -1))} #${
              args[args.length - 1]
            }" ` + COMMAND_ERRORS.getRankPlayer
          );
        } else if (
          parseInt(err.status, 10) === STATUS_CODES.internalServerError
        ) {
          message.reply(
            `"${stringArrToString(args.slice(0, -1))} #${
              args[args.length - 1]
            }" ` + COMMAND_ERRORS.getRankPlayer_privateAccount
          );
        } else {
          message.reply("error: " + err.message);
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
