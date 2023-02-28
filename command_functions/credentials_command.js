const { COMMAND_ERRORS } = require("../constants/commands");
const {
  STATUS_CODES,
  STATUS_CODE_MESSAGES,
} = require("../constants/status_codes");

const { getAccountByNameAndTag } = require("../data/mongoDb");

const { stringArrToString, getModifiedArguments } = require("../services");

const credentials_command = (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length >= 2) {
    const name = stringArrToString(modifiedArgs.slice(0, -1));
    const tag = modifiedArgs[modifiedArgs.length - 1];

    getAccountByNameAndTag(name, tag)
      .then((data) => {
        if (!data) {
          throw data;
        }
        if (Object.keys(data).length) {
          if (data.private) {
            message.reply(
              `User: **${name} #${tag}** ` +
                COMMAND_ERRORS.getSmurfCred_privateAccount
            );
          } else {
            message.reply(
              `For account: ${name} #${tag}, Username: ${data.username} Password: ${data.password}`
            );
          }
        } else {
          message.reply(
            `User: **${name} #${tag}** ` + COMMAND_ERRORS.getSmurfCred
          );
        }
      })
      .catch((err) => {
        if (parseInt(err.status, 10) === STATUS_CODES.notFound) {
          message.reply(STATUS_CODE_MESSAGES.MongoDBApiDown);
        }
      });
  } else {
    message.reply(
      `"${command} ` +
        stringArrToString(modifiedArgs) +
        '" ' +
        COMMAND_ERRORS.getSmurfCred_invalidArgs
    );
  }
};

module.exports = { credentials_command };
