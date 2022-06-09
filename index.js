const {
  JSONHasValue,
  stringArrToString,
  mmrDataToString,
  updateNameAndTag,
  mmrDataSingleToString,
  getModifiedArguments,
} = require("./services");
const {
  getRankedData,
  getUserData,
  getRankedDataByPUUIDs,
} = require("./fetching/fetching");
const {
  PREFIX,
  COMMANDS,
  ALL_COMMANDS,
  UNKNOWN_COMMAND,
  COMMAND_ERRORS,
  COMMAND_DESCRIPTIONS,
  RANKS_INTRO,
  HAS_SPACES_REMINDER,
  SET_SMURF_PRIVATE_SUCCESS,
  SET_SMURF_PUBLIC_SUCCESS,
  ACCOUNT_UPDATE_SUCCESS,
} = require("./constants/commands");
const {
  getAccounts,
  getAccountByNameAndTag,
  addToCollection,
  findOneByNameAndTagAndUpdate,
  ServerApiVersion,
} = require("./data/mongoDb");
const Discord = require("discord.js");
const config = require("./token");

const mongoose = require("mongoose");
const { uri } = require("./constants/mongodb_consts");

const {
  help_command,
  ranks_command,
  rank_command,
  credentials_command,
  setSmurf_command,
  makePublic_command,
  makePrivate_command,
  unknown_command,
} = require("./command_functions/index");

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

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
    // ranks command
  } else if (command === COMMANDS.getAllRanks) {
    ranks_command(message, command, args);
    // rank command
  } else if (command === COMMANDS.getRankPlayer) {
    rank_command(message, command, args);
    // credentials command
  } else if (command === COMMANDS.getSmurfCred) {
    credentials_command(message, command, argsAsString);
    // setSmurf command
  } else if (command === COMMANDS.setSmurf) {
    setSmurf_command(message, command, argsAsString);
    // makePublic command
  } else if (command === COMMANDS.makePublic) {
    makePublic_command(message, command, argsAsString);
    // makePrivate command
  } else if (command === COMMANDS.makePrivate) {
    makePrivate_command(message, command, argsAsString);
    // unknown command
  } else {
    unknown_command(message, command);
  }

  if (command === "Test") {
    message.reply(
      `commandBody: ${commandBody} args: ${args} command: ${command} argsAsString: ${argsAsString}`
    );
  }
});

client.login(config.BOT_TOKEN);
