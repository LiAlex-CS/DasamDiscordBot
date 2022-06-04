const JSONHasValue = (value, json) => {
    return Object.values(json).includes(value);
}

const stringArrToString = (strArr) =>{
    return strArr.reduce((prev, newVal) => (prev + ' ' + newVal));
}

module.exports = { JSONHasValue, stringArrToString }