const fs = require("fs");
const db = require("./data/smurfCreds.json");

const JSONHasValue = (value, json) => {
    return Object.values(json).includes(value);
}

const stringArrToString = (strArr) => {
    return strArr.reduce((prev, newVal) => (prev + ' ' + newVal));
}

const mmrDataToString = (dataArr) => {
    let reply = '';
    dataArr.forEach((newData)=>{
        reply = reply + `\n\n     Account Name: ${newData.data.name}, Tagline: ${newData.data.tag}, Rank: ${newData.data.currenttierpatched}`;
    });

    return reply;
}

const updateNameAndTag = (dataArr) => {
    const fileData = fs.readFileSync('./data/smurfCreds.json');
    const userData = JSON.parse(fileData);

    let hasChanged = false;

    dataArr.forEach((data, index)=>{
        if(userData.user_credentials[index].name !== data.data.name){
            userData.user_credentials[index].name = data.data.name;
            hasChanged = true;
        }
        if(userData.user_credentials[index].tag !== data.data.tag){
            userData.user_credentials[index].tag = data.data.tag;
            hasChanged = true;
        }
    });

    if(hasChanged){
        fs.writeFileSync('./data/smurfCreds.json', JSON.stringify(userData));
    }

}

module.exports = { JSONHasValue, stringArrToString, mmrDataToString, updateNameAndTag }