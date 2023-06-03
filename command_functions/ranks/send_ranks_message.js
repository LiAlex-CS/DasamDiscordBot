const {
  RANKS_INTRO,
  REACTIONS_DESCRIPTION,
} = require("../../constants/commands");

const {
  REGION_INDICATOR_SYMBOLS,
  COMMAND_ERRORS,
  MAX_ACCOUNTS_PER_PAGE,
  REACTION_COLLECTION_TIME,
} = require("../../constants/commands");

const { mmrDataToString } = require("../../services");

const { ranksReactionCommand } = require("./ranks_reaction_command");

const getAccountsOnPage = (accounts, page, accountsPerPage) => {
  return accounts.filter((_, index) => {
    return (
      index >= accountsPerPage * page && index < accountsPerPage * (page + 1)
    );
  });
};

const sendRanksMessage = (
  message,
  page,
  totalPages,
  rankedData,
  accountData
) => {
  let reply = RANKS_INTRO;

  const rankedDataOnPage = getAccountsOnPage(
    rankedData,
    page,
    MAX_ACCOUNTS_PER_PAGE
  );
  const accountDataOnPage = getAccountsOnPage(
    accountData,
    page,
    MAX_ACCOUNTS_PER_PAGE
  );

  reply += mmrDataToString(
    rankedDataOnPage,
    accountDataOnPage,
    Object.keys(REGION_INDICATOR_SYMBOLS)
  );

  reply += REACTIONS_DESCRIPTION;

  if (rankedDataOnPage.length === 0) {
    reply = COMMAND_ERRORS.getAllRanksNoAccounts;
  }

  message.reply(reply).then((ranksMessage) => {
    ranksReactionCommand(ranksMessage, accountDataOnPage);
  });
  sendPageControllerMessage(message, page, totalPages, rankedData, accountData);
};

const sendPageControllerMessage = (
  message,
  page,
  totalPages,
  rankedData,
  accountData
) => {
  const firstAndPrevPageText = `First Page: ⏪, Previous Page: ◀️ `;
  const lastAndNextPageText = ` Next Page: ▶️, Last Page: ⏩`;

  const notFirstPage = page !== 0;
  const notLastPage = page !== totalPages - 1;

  if (totalPages >= 2) {
    message
      .reply(
        `${notFirstPage ? firstAndPrevPageText : ""} **Page: ${
          page + 1
        }/${totalPages}** ${notLastPage ? lastAndNextPageText : ""}`
      )
      .then((pageMessage) => {
        addPageReactions(
          pageMessage,
          page,
          totalPages,
          rankedData,
          accountData
        );
      });
  }
};

const addPageReactions = (
  pageMessage,
  page,
  totalPages,
  rankedData,
  accountData
) => {
  const notFirstPage = page !== 0;
  const notLastPage = page !== totalPages - 1;

  if (notFirstPage) {
    pageMessage.react("⏪");
    pageMessage.react("◀️");
  }

  if (notLastPage) {
    pageMessage.react("▶️");
    pageMessage.react("⏩");
  }

  const filter = (reaction, user) => {
    return ["⏪", "◀️", "▶️", "⏩"].includes(reaction.emoji.name) && !user.bot;
  };

  const collector = pageMessage.createReactionCollector({
    time: REACTION_COLLECTION_TIME,
  });

  collector.on("collect", (reaction, user) => {
    if (filter(reaction, user)) {
      if (reaction.emoji.name === "⏪" && page !== 0) {
        sendRanksMessage(pageMessage, 0, totalPages, rankedData, accountData);
      } else if (reaction.emoji.name === "◀️" && page !== 0) {
        sendRanksMessage(
          pageMessage,
          page - 1,
          totalPages,
          rankedData,
          accountData
        );
      } else if (reaction.emoji.name === "▶️" && page !== totalPages - 1) {
        sendRanksMessage(
          pageMessage,
          page + 1,
          totalPages,
          rankedData,
          accountData
        );
      } else if (reaction.emoji.name === "⏩" && page !== totalPages - 1) {
        sendRanksMessage(
          pageMessage,
          totalPages - 1,
          totalPages,
          rankedData,
          accountData
        );
      }
    }
  });
};

module.exports = { sendRanksMessage };
