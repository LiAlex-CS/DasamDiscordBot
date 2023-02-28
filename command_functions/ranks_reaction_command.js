const {
  REGION_INDICATOR_SYMBOLS,
  COMMAND_ERRORS,
} = require("../constants/commands");

const ranksReaction_command = (ranksMessage, message, ranksAccountData) => {
  const MAX_REACTION_LIMIT = 20;
  const numReactions =
    ranksAccountData.length > MAX_REACTION_LIMIT
      ? MAX_REACTION_LIMIT
      : ranksAccountData.length;

  const REGIONAL_INDICATOR_SYMBOLS_ARR = Object.keys(
    REGION_INDICATOR_SYMBOLS
  ).slice(0, numReactions);

  REGIONAL_INDICATOR_SYMBOLS_ARR.forEach((symbol) => {
    ranksMessage.react(symbol);
  });

  const filter = (reaction, user) => {
    return (
      REGIONAL_INDICATOR_SYMBOLS_ARR.includes(reaction.emoji.name) && !user.bot
    );
  };

  const collector = ranksMessage.createReactionCollector({
    time: 300000,
  });

  collector.on("collect", (reaction, user) => {
    if (filter(reaction, user)) {
      const userInfo =
        ranksAccountData[REGION_INDICATOR_SYMBOLS[reaction.emoji.name]];

      if (userInfo.private) {
        message.reply(
          `User: ${userInfo.name} #${userInfo.tag} ${COMMAND_ERRORS.getSmurfCred_privateAccount}`
        );
      } else {
        message.reply(
          `For account: ${userInfo.name} #${userInfo.tag}, Username: ${userInfo.username} Password: ${userInfo.password}`
        );
      }
    }
  });
};

module.exports = { ranksReaction_command };
