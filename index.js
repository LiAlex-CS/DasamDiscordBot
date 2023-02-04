require("dotenv").config();
const { ServerApiVersion } = require("./data/mongoDb");
const config = require("./token");

const { PREFIX, COMMANDS } = require("./constants/commands");
const { uri } = require("./constants/mongodb_consts");

const mongoose = require("mongoose");
const Discord = require("discord.js");

const {
  help_command,
  ranks_command,
  rank_command,
  credentials_command,
  setSmurf_command,
  makePublic_command,
  makePrivate_command,
  unknown_command,
  test_command,
} = require("./command_functions/index");

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

mongoose.set("strictQuery", false);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const database = mongoose.connection;
database.on("error", console.error.bind(console, "MongoDB connection error:"));

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const commandBody = message.content.slice(PREFIX.length);
  const args = commandBody.split(" ");
  const command = args.shift();
  const argsAsString = message.content.slice(
    PREFIX.length + command.length + 1
  );
  // help command
  if (command === COMMANDS.getCommands) {
    help_command(message, command, args);
  }
  // ranks command
  else if (command === COMMANDS.getAllRanks) {
    ranks_command(message, command, args);
  }
  // rank command
  else if (command === COMMANDS.getRankPlayer) {
    rank_command(message, command, args);
  }
  // credentials command
  else if (command === COMMANDS.getSmurfCred) {
    credentials_command(message, command, argsAsString);
  }
  // setSmurf command
  else if (command === COMMANDS.setSmurf) {
    setSmurf_command(message, command, argsAsString);
  }
  // makePublic command
  else if (command === COMMANDS.makePublic) {
    makePublic_command(message, command, argsAsString);
  }
  // makePrivate command
  else if (command === COMMANDS.makePrivate) {
    makePrivate_command(message, command, argsAsString);
  }
  // test command
  else if (command === COMMANDS.test && process.env.BOT_ENV === "DEV") {
    test_command(message, command, commandBody, args, argsAsString);
  }
  // unknown command
  else {
    unknown_command(message, command);
  }
});

client.login(config.BOT_TOKEN);
