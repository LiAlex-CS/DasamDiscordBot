const { COMMAND_ERRORS } = require("../constants/commands");

const { getAccountByNameAndTag } = require("../data/mongoDb");

const { handleAPIError } = require("../fetching/errorHandling");

const {
  parseArgsFromArgsAsString,
  removeHashtagFromTag,
} = require("../services");

const credentials_command = async (message, command, argsAsString) => {
  const parsedArgs = parseArgsFromArgsAsString(argsAsString);
  if (parsedArgs.length == 2) {
    const name = parsedArgs[0];
    const tag = removeHashtagFromTag(parsedArgs[1]);

    try {
      const accountData = await getAccountByNameAndTag(
        name,
        tag,
        message.guildId
      );

      if (!accountData) {
        message.reply(
          `Account: "**${name} #${tag}**" ${COMMAND_ERRORS.getSmurfCred}`
        );
      } else if (Object.keys(accountData).length) {
        if (accountData.private) {
          message.reply(
            `Account: **${name} #${tag}** ` +
              COMMAND_ERRORS.getSmurfCred_privateAccount
          );
        } else {
          message.reply(
            `For account: **${name} #${tag}**, Username: ${accountData.username} Password: ${accountData.password}`
          );
        }
      } else {
        message.reply(
          `Account: **${name} #${tag}** ${COMMAND_ERRORS.getSmurfCred}`
        );
      }
    } catch (error) {
      const errorResponses = {
        notFound: `"**${name} #${tag}**" ${COMMAND_ERRORS.getSmurfCred_invalidAccount}`,
        forbidden: `"**${name} #${tag}**" ${COMMAND_ERRORS.getSmurfCred_forbidden}`,
      };
      handleAPIError(message, error, errorResponses);
    }
  } else {
    message.reply(
      `*${command} ${argsAsString}* ${COMMAND_ERRORS.getSmurfCred_invalidArgs}`
    );
  }
};

module.exports = { credentials_command };
