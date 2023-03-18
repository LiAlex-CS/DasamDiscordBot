const {
  getAccounts,
  updateAccountNameByPuuid,
  updateAccountTagByPuuid,
} = require("./data/mongoDb");

const { RANK_EMOJIS } = require("./constants/commands");

const JSONHasValue = (value, json) => {
  return Object.values(json).includes(value);
};

const JSONHasKey = (value, json) => {
  return json.hasOwnProperty(value);
};

const checkValidTierNum = (num) => {
  if (parseInt(num)) {
    if (parseInt(num) <= 3 && parseInt(num) > 0) {
      return true;
    }
  }
  return false;
};

const stringArrToString = (strArr) => {
  if (!strArr || !strArr.length) return "";

  return strArr.reduce((prev, newVal) => prev + " " + newVal);
};

const justifyContentApart = (strArr, totalLength) => {
  const totalLengthWithoutSpaces = strArr.reduce((prev, newVal) => {
    const prevLength = prev ? prev.length : 0;
    return prevLength + newVal.length;
  });

  if (strArr.length !== 2 || totalLength < totalLengthWithoutSpaces) {
    return;
  } else {
    const marginLength = totalLength - totalLengthWithoutSpaces;
    let justifiedString = strArr[0];
    for (let i = 0; i < marginLength; i++) {
      justifiedString = justifiedString + " ";
    }
    justifiedString = justifiedString + strArr[1];
    return justifiedString;
  }
};

const getRankFromRankAndTier = (rankAndTier) => {
  if (!rankAndTier) return "Error";
  return rankAndTier.split(/(\s+)/).filter((e) => {
    return e.trim().length > 0;
  })[0];
};

const mmrDataToString = (dataArr, accountData, regionalIndicatorEmojis) => {
  let reply = "";

  const startingPrivateText = "```\n";
  const endingPrivateText = "\n```";
  const startingPublicText = "```fix\n";
  const endingPublicText = "\n```";

  dataArr.forEach((newData, index) => {
    const rankData =
      "Account Name: " +
      newData.data.name +
      ", Tagline: " +
      newData.data.tag +
      ", Rank: " +
      newData.data.currenttierpatched;

    const rank = getRankFromRankAndTier(newData.data.currenttierpatched);

    const rankEmoji = RANK_EMOJIS[rank];

    reply =
      reply +
      (accountData[index].private
        ? `\n${
            regionalIndicatorEmojis[index]
          }   ${rankEmoji}  ${justifyContentApart(
            [`**${newData.data.currenttierpatched}**`, " "],
            30
          )}:lock: Private ${startingPrivateText}${rankData}${endingPrivateText}`
        : `\n${
            regionalIndicatorEmojis[index]
          }   ${rankEmoji}  ${justifyContentApart(
            [`**${newData.data.currenttierpatched}**`, " "],
            30
          )}:unlock: Public ${startingPublicText}${rankData}${endingPublicText}`);
  });

  return reply;
};

const mmrDataSingleToString = (data) => {
  return `Account Name: **${data.data.name}**, Tagline: **${data.data.tag}**, Rank: **${data.data.currenttierpatched}**`;
};

const updateNameAndTag = (dataArr, errorCB) => {
  getAccounts()
    .then((userData, err) => {
      if (err) {
        throw err;
      } else {
        dataArr.forEach((data, index) => {
          if (userData[index].name !== data.data.name) {
            updateAccountNameByPuuid(userData[index].puuid, data.data.name);
          }
          if (userData[index].tag !== data.data.tag) {
            updateAccountTagByPuuid(userData[index].puuid, data.data.tag);
          }
        });
      }
    })
    .catch((err) => {
      errorCB(err);
    });
};

const filterByRankAndTier = (accountRankDataArr, rankFilter, tierFilter) => {
  if (!rankFilter && !tierFilter) {
    return accountRankDataArr;
  }

  let filteredArr = accountRankDataArr.filter((account) => {
    const rankAndTier = account.rankedData.data.currenttierpatched;
    const rank = rankAndTier.split(" ")[0];

    return rank === rankFilter;
  });
  if (tierFilter) {
    filteredArr = filteredArr.filter((account) => {
      const rankAndTier = account.rankedData.data.currenttierpatched;
      const tier = rankAndTier.split(" ")[1];

      return tier == tierFilter;
    });
  }

  return filteredArr;
};

const getModifiedArguments = (commandBody) => {
  const args = [];
  let inQuotations = false;
  let currString = "";

  const addToArgs = () => {
    if (currString.length > 0) {
      args.push(currString);
      currString = "";
    }
  };

  for (let char of commandBody) {
    if (char === '"') {
      addToArgs();
      inQuotations = !inQuotations;
    } else {
      if (!inQuotations) {
        if (char !== " ") {
          currString += char;
        } else {
          addToArgs();
        }
      } else {
        currString += char;
      }
    }
  }

  addToArgs();

  return args;
};

const checkArrayRespStatusMatch = (respArr, statusCode) => {
  let isMatching = true;
  respArr.forEach((resp) => {
    isMatching = resp.status !== statusCode ? false : isMatching;
  });
  return isMatching;
};

const errorRespToErrorMessage = (resp) => {
  const errors = resp.errors;
  let errorString = "Errors: \n";
  errors.forEach((error) => {
    errorString += `${error.message},\n`;
  });
  return errorString;
};

const removeHashtagFromTag = (tag) => {
  if (tag[0] == "#") {
    return tag.substring(1);
  }
  return tag;
};

const fixRank = (rank) => {
  let lowerCaseRank = rank.toLowerCase();
  const shortForms = {
    plat: "platinum",
    asc: "ascendant",
    imm: "immortal",
    rad: "radiant",
  };
  if (JSONHasKey(lowerCaseRank, shortForms)) {
    lowerCaseRank = shortForms[lowerCaseRank];
  }
  return (
    lowerCaseRankstring.charAt(0).toUpperCase() + lowerCaseRankstring.slice(1)
  );
};

module.exports = {
  JSONHasValue,
  JSONHasKey,
  stringArrToString,
  mmrDataToString,
  updateNameAndTag,
  mmrDataSingleToString,
  getModifiedArguments,
  checkValidTierNum,
  justifyContentApart,
  getRankFromRankAndTier,
  checkArrayRespStatusMatch,
  errorRespToErrorMessage,
  filterByRankAndTier,
  removeHashtagFromTag,
  fixRank,
};
