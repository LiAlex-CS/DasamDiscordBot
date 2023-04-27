require("dotenv").config();
const http = require("http");
const { ServerApiVersion } = require("./data/mongoDb");
const config = require("./token");

const { PREFIX, COMMANDS, PREFIX_DEV } = require("./constants/commands");
const { uri } = require("./constants/mongodb_consts");

const mongoose = require("mongoose");
const Discord = require("discord.js");

const {
  help_command,
  ranks_command,
  rank_command,
  credentials_command,
  addSmurf_command,
  makePublic_command,
  makePrivate_command,
  update_command,
  delete_command,
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

  if (process.env.BOT_ENV === "DEV") {
    if (
      !commandAsArray.length ||
      commandAsArray[0] !== PREFIX_DEV ||
      (message.author.id !== process.env.DISCORD_ID &&
        process.env.ALLOW_PUBLIC_ACCESS === "FALSE")
    )
      return;
  } else if (!commandAsArray.length || commandAsArray[0] !== PREFIX) return;

  const args = commandAsArray.slice(1);
  const commandBody = args.join(" ");
  const command = args.shift();
  const argsAsString = args.join(" ");

  switch (command) {
    // Help Command - $smurf help
    case COMMANDS.getCommands:
      help_command(message, command, args);
      break;
    // Ranks Command - $smurf ranks
    case COMMANDS.getAllRanks:
      ranks_command(message, command, args);
      break;
    // Rank Command - $smurf rank
    case COMMANDS.getRankPlayer:
      rank_command(message, command, argsAsString);
      break;
    // Credentials Command - $smurf credentials
    case COMMANDS.getSmurfCred:
      credentials_command(message, command, argsAsString);
      break;
    // Set Smurf Command - $smurf addSmurf
    case COMMANDS.addSmurf:
      addSmurf_command(message, command, argsAsString);
      break;
    // Make Public Command - $smurf makePublic
    case COMMANDS.makePublic:
      makePublic_command(message, command, argsAsString);
      break;
    // Make Private Command - $smurf makePrivate
    case COMMANDS.makePrivate:
      makePrivate_command(message, command, argsAsString);
      break;
    // Update Command - $smurf update
    case COMMANDS.update:
      update_command(message, command, argsAsString);
      break;
    // Delete Command - $smurf delete
    case COMMANDS.delete:
      delete_command(message, command, argsAsString);
      break;
    // Test Command - $smurf test
    case COMMANDS.test:
      if (process.env.BOT_ENV === "DEV")
        test_command(message, command, commandBody, args, argsAsString);
      else unknown_command(message, command);
      break;
    // No Command - $smurf
    case undefined:
      no_command(message);
      break;
    // Unkown Command
    default:
      unknown_command(message, command);
  }
});

client.login(config.BOT_TOKEN);

const server = http.createServer((req, res) => {
  res.end("Dasam Discord Bot");
});
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("Listening..."));
