const { COMMAND_ERRORS } = require("../constants/commands");

const { getAccountByNameAndTag } = require("../data/mongoDb");

const { handleAPIError } = require("../fetching/errorHandling");

const {
  stringArrToString,
  getModifiedArguments,
  removeHashtagFromTag,
} = require("../services");

const credentials_command = (message, command, argsAsString) => {
  const modifiedArgs = getModifiedArguments(argsAsString);
  if (modifiedArgs.length >= 2) {
    const name = stringArrToString(modifiedArgs.slice(0, -1));
    const tag = removeHashtagFromTag(modifiedArgs[modifiedArgs.length - 1]);

    getAccountByNameAndTag(name, tag)
      .then((data) => {
        if (!data) {
          message.reply(
            `Account: "**${name} #${tag}**" ` + COMMAND_ERRORS.getSmurfCred
          );
        } else if (Object.keys(data).length) {
          if (data.private) {
            message.reply(
              `Account: **${name} #${tag}** ` +
                COMMAND_ERRORS.getSmurfCred_privateAccount
            );
          } else {
            message.reply(
              `For account: **${name} #${tag}**, Username: ${data.username} Password: ${data.password}`
            );
          }
        } else {
          message.reply(
            `Account: **${name} #${tag}** ` + COMMAND_ERRORS.getSmurfCred
          );
        }
      })
      .catch((err) => {
        const errorResponses = {
          notFound: `"**${name} #${tag}**" ${COMMAND_ERRORS.getSmurfCred_invalidAccount}`,
          forbidden: `"**${name} #${tag}**" ${COMMAND_ERRORS.getSmurfCred_forbidden}`,
        };
        handleAPIError(message, err, errorResponses);
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
