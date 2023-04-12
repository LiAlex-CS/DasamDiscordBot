const MONGO_USERNAME = process.env.MONGO_USERNAME;

const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@dasamdiscordbot.nm5jkob.mongodb.net/discord_bot?retryWrites=true&w=majority`;

const DATABASE = "DiscordBotAccountDetails";
const ACCOUNTS_COLLECTION = "AccountDetails";
const DISCORD_USER_COLLECTION = "DiscordUsers";

module.exports = {
  uri,
  DATABASE,
  ACCOUNTS_COLLECTION,
  DISCORD_USER_COLLECTION,
};
