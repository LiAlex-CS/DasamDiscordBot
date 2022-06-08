const MONGO_USERNAME = process.env.MONGO_USERNAME;
// const MONGO_USERNAME = "DiscordBotUser";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
// const MONGO_PASSWORD = "SBaTjjZtmJF2tC72";

const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@accountdetails.hh9drpy.mongodb.net/?retryWrites=true&w=majority`;

const DATABASE = "DiscordBotAccountDetails";
const ACCOUNTS_COLLECTION = "AccountDetails";

module.exports = { uri, DATABASE, ACCOUNTS_COLLECTION };
