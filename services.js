const JSONHasValue = (value, json) => {
    return Object.values(json).includes(value);
}

const stringArrToString = (strArr) => {
    return strArr.reduce((prev, newVal) => (prev + ' ' + newVal));
}

const mmrDataToString = (dataArr) => {
    let reply = '';
    dataArr.forEach((newData)=>{
        reply = reply + `\n\nAccount Name: ${newData.data.name}, Tagline: ${newData.data.tag}, Rank: ${newData.data.currenttierpatched}`;
    });

    return reply;
}

module.exports = { JSONHasValue, stringArrToString, mmrDataToString }