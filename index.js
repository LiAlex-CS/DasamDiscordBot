require("dotenv").config();
const http = require("http");
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
  no_command,
} = require("./command_functions/index");

const { formatMessage } = require("./services");

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
});

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
  const commandAsArray = formatMessage(message.content);
  if (!commandAsArray.length || commandAsArray[0] !== PREFIX) return;

  const args = commandAsArray.slice(1);
  const commandBody = args.join(" ");
  const command = args.shift();
  const argsAsString = args.join(" ");
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
  // no command
  else if (command === undefined) {
    no_command(message);
  }
  // unknown command
  else {
    unknown_command(message, command);
  }
});

client.login(config.BOT_TOKEN);

const server = http.createServer((req, res) => {
  res.end("Dasam Discord Bot");
});
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("listening"));
