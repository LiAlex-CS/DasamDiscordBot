const {
  COMMAND_ERRORS,
  RANKS_INTRO,
  RANK_EMOJIS,
} = require("../constants/commands");

const { getAccounts } = require("../data/mongoDb");

const { getRankedDataByPUUIDs } = require("../fetching/fetching");

const {
  stringArrToString,
  mmrDataToString,
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
              message.reply("invalid rank");
            } else if (
              args.length == 2 &&
              (!JSONHasKey(args[0], RANK_EMOJIS) || !checkValidTierNum(args[1]))
            ) {
              message.reply(" invalid rank or tier");
            } else {
              if (args[0] === "Radiant" && args.length !== 1) {
                message.reply("radiant has no tiers");
              } else {
                reply = reply + rankSpecificity(args, data, accountData);
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
