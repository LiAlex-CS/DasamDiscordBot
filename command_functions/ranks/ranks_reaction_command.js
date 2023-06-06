const {
  REGION_INDICATOR_SYMBOLS,
  COMMAND_ERRORS,
  MAX_ACCOUNTS_PER_PAGE,
  REACTION_COLLECTION_TIME,
} = require("../../constants/commands");

const ranksReactionCommand = (ranksMessage, ranksAccountDataOnPage) => {
  const numReactions =
    ranksAccountDataOnPage.length > MAX_ACCOUNTS_PER_PAGE
      ? MAX_ACCOUNTS_PER_PAGE
      : ranksAccountDataOnPage.length;

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
    time: REACTION_COLLECTION_TIME,
  });

  collector.on("collect", (reaction, user) => {
    if (filter(reaction, user)) {
      const userInfo =
        ranksAccountDataOnPage[REGION_INDICATOR_SYMBOLS[reaction.emoji.name]];

      if (userInfo.private) {
        ranksMessage.reply(
          `<@${user.id}>. User: **${userInfo.name} #${userInfo.tag}** ${COMMAND_ERRORS.getSmurfCredPrivateAccount}`
        );
      } else {
        ranksMessage.reply(
          `<@${user.id}>. For account: **${userInfo.name} #${userInfo.tag}**, Username: ${userInfo.username} Password: ${userInfo.password}`
        );
      }
    }
  });
};

module.exports = { ranksReactionCommand };
