const fs = require("fs");
const db = require("./data/smurfCreds.json");

const JSONHasValue = (value, json) => {
    return Object.values(json).includes(value);
}

const stringArrToString = (strArr) => {

    if (!strArr || !strArr.length) return '';

    return strArr.reduce((prev, newVal) => (prev + ' ' + newVal));
}

const mmrDataToString = (dataArr) => {
    let reply = '';
    dataArr.forEach((newData) => {
        reply = reply + `\n\n     Account Name: ${newData.data.name}, Tagline: ${newData.data.tag}, Rank: ${newData.data.currenttierpatched}`;
    });

    return reply;
}

const mmrDataSingleToString = (data) => {
    return `Account Name: ${data.data.name}, Tagline: ${data.data.tag}, Rank: ${data.data.currenttierpatched}`;
}

const updateNameAndTag = (dataArr) => {
    const fileData = fs.readFileSync('./data/smurfCreds.json');
    const userData = JSON.parse(fileData);

    let hasChanged = false;

    dataArr.forEach((data, index) => {
        if (userData.user_credentials[index].name !== data.data.name) {
            userData.user_credentials[index].name = data.data.name;
            hasChanged = true;
        }
        if (userData.user_credentials[index].tag !== data.data.tag) {
            userData.user_credentials[index].tag = data.data.tag;
            hasChanged = true;
        }
    });

    if (hasChanged) {
        fs.writeFileSync('./data/smurfCreds.json', JSON.stringify(userData));
    }

}

const searchDbByNameAndTag = (name, tag, data) => {
    for(let i = 0; i < data.length; i++){
        if(data[i].name === name && data[i].tag === tag){
            return data[i];
        }
    }
    return {};
}

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
    if(numQuotations%2 !== 0){
      return [];
    }
    return args;
  };



module.exports = { JSONHasValue, stringArrToString, mmrDataToString, updateNameAndTag, mmrDataSingleToString, searchDbByNameAndTag, getModifiedArguments }