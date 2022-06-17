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

const justify_content_apart = (strArr, totalLength) => {
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
          ? `\n${rankEmoji}  ${justify_content_apart(
              [`**${newData.data.currenttierpatched}**`, " "],
              30
            )}:lock: Private ${startingPrivateText}${rankData}${endingPrivateText}`
          : `\n${rankEmoji}  ${justify_content_apart(
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
  return `__Account Name:__ **${data.data.name}**, __Tagline:__ **${data.data.tag}**, __Rank:__ **${data.data.currenttierpatched}**`;
};

const updateNameAndTag = (dataArr) => {
  getAccounts().then((userData) => {
    dataArr.forEach((data, index) => {
      if (userData[index].name !== data.data.name) {
        updateAccountNameByPuuid(userData[index].puuid, data.data.name);
      }
      if (userData[index].tag !== data.data.tag) {
        updateAccountTagByPuuid(userData[index].puuid, data.data.tag);
      }
    });
  });
};

const getModifiedArguments = (commandBody) => {
  let inQuotation = false;
  let args = [];
  let startIndex = 0;
  let endIndex = 0;
  let prevStartIndex = null;
  let prevEndIndex = null;
  let numQuotations = 0;

  for (let i = 0; i < commandBody.length; i++) {
    if (commandBody[i] === '"') {
      inQuotation = !inQuotation;
      numQuotations += 1;
    }
    if (inQuotation) {
      if (i > 0 && commandBody[i - 1] === '"') {
        startIndex = i;
      }
      if (i < commandBody.length - 1 && commandBody[i + 1] === '"') {
        endIndex = i;
      }
    } else {
      if (
        (i > 0 && commandBody[i - 1] === " ") ||
        (i === 0 && commandBody[i] !== " ")
      ) {
        startIndex = i;
      }
      if (
        (i < commandBody.length - 1 && commandBody[i + 1] === " ") ||
        (i === commandBody.length - 1 && commandBody[i] !== " ")
      ) {
        endIndex = i;
      }
    }
    if (
      (startIndex || endIndex) &&
      commandBody[endIndex] !== '"' &&
      endIndex >= startIndex &&
      startIndex !== prevStartIndex &&
      endIndex !== prevEndIndex
    ) {
      args.push(commandBody.slice(startIndex, endIndex + 1));
      prevStartIndex = startIndex;
      prevEndIndex = endIndex;
    }
  }
  if (numQuotations % 2 !== 0) {
    return [];
  }
  return args;
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
  justify_content_apart,
  getRankFromRankAndTier,
};
