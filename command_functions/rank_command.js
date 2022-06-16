const { COMMAND_ERRORS, RANK_EMOJIS } = require("../constants/commands");

const { getRankedData } = require("../fetching/fetching");

const {
  stringArrToString,
  mmrDataSingleToString,
  getRankFromRankAndTier,
} = require("../services");

const rank_command = (message, command, args) => {
  if (args.length >= 2) {
    getRankedData(stringArrToString(args.slice(0, -1)), args[args.length - 1])
      .then((data) => {
        if (data.status !== 200) {
          throw data;
        } else {
          const rank = getRankFromRankAndTier(data.data.currenttierpatched);

          const rankEmoji = RANK_EMOJIS[rank];

          message.reply(rankEmoji + " " + mmrDataSingleToString(data));
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          message.reply(
            `"${stringArrToString(args.slice(0, -1))} #${
              args[args.length - 1]
            }" ` + COMMAND_ERRORS.getRankPlayer
          );
        } else if (parseInt(err.status, 10) === 500) {
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
