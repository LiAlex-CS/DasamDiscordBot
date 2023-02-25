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

const mmrDataToString = (dataArr, accountData, rankFilter, tierFilter) => {
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

    const concatAccount = () => {
      reply =
        reply +
        (accountData[index].private
          ? `\n${rankEmoji}  ${justifyContentApart(
              [`**${newData.data.currenttierpatched}**`, " "],
              30
            )}:lock: Private ${startingPrivateText}${rankData}${endingPrivateText}`
          : `\n${rankEmoji}  ${justifyContentApart(
              [`**${newData.data.currenttierpatched}**`, " "],
              30
            )}:unlock: Public ${startingPublicText}${rankData}${endingPublicText}`);
    };

    if (rankFilter && tierFilter) {
      if (rankFilter + " " + tierFilter === newData.data.currenttierpatched) {
        concatAccount();
      }
    } else if (rankFilter) {
      if (newData.data.currenttierpatched.includes(rankFilter)) {
        concatAccount();
      }
    } else {
      concatAccount();
    }
  });

  return reply;
};

const rankSpecificity = (args, data, accountData) => {
  if (args.length === 2) {
    return mmrDataToString(data, accountData, args[0], args[1]);
  } else if (args.length === 1) {
    return mmrDataToString(data, accountData, args[0]);
  } else {
    return mmrDataToString(data, accountData);
  }
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

module.exports = {
  JSONHasValue,
  JSONHasKey,
  stringArrToString,
  mmrDataToString,
  updateNameAndTag,
  mmrDataSingleToString,
  getModifiedArguments,
  checkValidTierNum,
  rankSpecificity,
  justifyContentApart,
  getRankFromRankAndTier,
  checkArrayRespStatusMatch,
  errorRespToErrorMessage,
};
