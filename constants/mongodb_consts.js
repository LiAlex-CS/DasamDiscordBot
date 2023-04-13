const MONGO_USERNAME = process.env.MONGO_USERNAME;

const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

const DATABASE = "discord_bot";

const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@dasamdiscordbot.nm5jkob.mongodb.net/${DATABASE}?retryWrites=true&w=majority`;

const ACCOUNTS_COLLECTION = "SmurfAccounts";
const DISCORD_USER_COLLECTION = "DiscordUsers";

module.exports = {
  uri,
  DATABASE,
  ACCOUNTS_COLLECTION,
  DISCORD_USER_COLLECTION,
};
