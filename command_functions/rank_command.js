const { COMMAND_ERRORS } = require("../constants/commands");

const { STATUS_CODES } = require("../constants/status_codes");

const { getRankedData } = require("../fetching/fetching");

const { stringArrToString, mmrDataSingleToString } = require("../services");

const rank_command = (message, command, args) => {
  if (args.length >= 2) {
    getRankedData(stringArrToString(args.slice(0, -1)), args[args.length - 1])
      .then((data) => {
        if (parseInt(data.status, 10) !== STATUS_CODES.ok) {
          throw data;
        } else {
          message.reply(mmrDataSingleToString(data));
        }
      })
      .catch((err) => {
        if (parseInt(err.status, 10) === STATUS_CODES.notFound) {
          message.reply(
            stringArrToString(args) + '" ' + COMMAND_ERRORS.getRankPlayer
          );
        } else if (
          parseInt(err.status, 10) === STATUS_CODES.internalServerError
        ) {
          message.reply(
            stringArrToString(args) +
              '" ' +
              COMMAND_ERRORS.getRankPlayer_privateAccount
          );
        } else {
          message.reply("error: " + err);
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
