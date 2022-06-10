const {
  getAccounts,
  updateAccountNameByPuuid,
  updateAccountTagByPuuid,
} = require("./data/mongoDb");

const { RANK_EMOJIS } = require("./constants/commands");

const JSONHasValue = (value, json) => {
  return Object.values(json).includes(value);
};

const stringArrToString = (strArr) => {
  if (!strArr || !strArr.length) return "";

  return strArr.reduce((prev, newVal) => prev + " " + newVal);
};

const mmrDataToString = (dataArr, accountData) => {
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

    const tier = newData.data.currenttierpatched
      .split(/(\s+)/)
      .filter(function (e) {
        return e.trim().length > 0;
      })[0];

    const tierEmoji = RANK_EMOJIS[tier];

    reply =
      reply +
      (accountData[index].private
        ? `\n${tierEmoji}  ${newData.data.currenttierpatched} ${startingPrivateText}${rankData}${endingPrivateText}`
        : `\n${tierEmoji}  ${newData.data.currenttierpatched} ${startingPublicText}${rankData}${endingPublicText}`);
  });

  return reply;
};

const mmrDataSingleToString = (data) => {
  return `Account Name: ${data.data.name}, Tagline: ${data.data.tag}, Rank: ${data.data.currenttierpatched}`;
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
  stringArrToString,
  mmrDataToString,
  updateNameAndTag,
  mmrDataSingleToString,
  getModifiedArguments,
};
