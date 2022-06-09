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
    if (!args.length) {
      message.reply(ALL_COMMANDS);
    } else if (args.length === 1 && JSONHasValue(args[0], COMMANDS)) {
      if (args[0] === COMMANDS.getCommands) {
        message.reply(COMMAND_DESCRIPTIONS.getCommands);
      } else if (args[0] === COMMANDS.getAllRanks) {
        message.reply(COMMAND_DESCRIPTIONS.getAllRanks);
      } else if (args[0] === COMMANDS.getRankPlayer) {
        message.reply(COMMAND_DESCRIPTIONS.getRankPlayer);
      } else if (args[0] === COMMANDS.getSmurfCred) {
        message.reply(COMMAND_DESCRIPTIONS.getSmurfCred);
      } else {
        message.reply(COMMAND_DESCRIPTIONS.setSmurf);
      }
    } else {
      message.reply(
        `"${command} ` +
          stringArrToString(args) +
          '" ' +
          COMMAND_ERRORS.getCommands
      );
    }
    // ranks command
  } else if (command === COMMANDS.getAllRanks) {
    if (!args.length) {
      let reply = RANKS_INTRO;
      getAccounts().then((accountData, err) => {
        if (err) {
          console.error(err);
        } else {
          getRankedDataByPUUIDs(accountData.map((user) => user.puuid))
            .then((data) => {
              reply = reply + mmrDataToString(data, accountData);
              message.reply(reply);
              updateNameAndTag(data);
            })
            .catch((err) => {
              message.reply("error: " + err);
            });
        }
      });
    } else {
      message.reply(
        `"${command} ` +
          stringArrToString(args) +
          '" ' +
          COMMAND_ERRORS.getAllRanks_invalidArgs
      );
    }
    // rank command
  } else if (command === COMMANDS.getRankPlayer) {
    if (args.length >= 2) {
      getRankedData(stringArrToString(args.slice(0, -1)), args[args.length - 1])
        .then((data) => {
          if (data.status !== 200) {
            throw data;
          } else {
            message.reply(mmrDataSingleToString(data));
          }
        })
        .catch((err) => {
          if (err.status === 404) {
            message.reply(
              stringArrToString(args) + '" ' + COMMAND_ERRORS.getRankPlayer
            );
          } else if (parseInt(err.status, 10) === 500) {
            message.reply(
              stringArrToString(args) +
                '" ' +
                COMMAND_ERRORS.getRankPlayer_privateAccount
            );
          } else {
            message.reply("error: " + err);
          }
        });
    } else {
      message.reply(
        `"${command} ` +
          stringArrToString(args) +
          '" ' +
          COMMAND_ERRORS.getRankPlayer_invalidArgs
      );
    }
    // credentials command
  } else if (command === COMMANDS.getSmurfCred) {
    const modifiedArgs = getModifiedArguments(argsAsString);
    if (modifiedArgs.length >= 2) {
      const name = stringArrToString(modifiedArgs.slice(0, -1));
      const tag = modifiedArgs[modifiedArgs.length - 1];

      getAccountByNameAndTag(name, tag).then((data) => {
        if (Object.keys(data).length) {
          if (data.private) {
            message.reply(
              `User: ${name} #${tag} ` +
                COMMAND_ERRORS.getSmurfCred_privateAccount
            );
          } else {
            message.reply(
              `For account: ${name} #${tag}, Username: ${data.username} Password: ${data.password}`
            );
          }
        } else {
          message.reply(`User: ${name} #${tag} ` + COMMAND_ERRORS.getSmurfCred);
        }
      });
    } else {
      message.reply(
        `"${command} ` +
          stringArrToString(modifiedArgs) +
          '" ' +
          COMMAND_ERRORS.getSmurfCred_invalidArgs
      );
    }
    // setSmurf command
  } else if (command === COMMANDS.setSmurf) {
    const modifiedArgs = getModifiedArguments(argsAsString);
    if (modifiedArgs.length === 4 || modifiedArgs.length === 2) {
      getUserData(modifiedArgs[0], modifiedArgs[1])
        .then((data) => {
          if (data.status !== 200) {
            throw data;
          } else {
            const private = !modifiedArgs[2] || !modifiedArgs[3];

            addToCollection(
              {
                name: modifiedArgs[0],
                tag: modifiedArgs[1],
                puuid: data.data.puuid,
                username: private ? null : modifiedArgs[2],
                password: private ? null : modifiedArgs[3],
                private: private,
              },
              (name, tag) => {
                message.reply(
                  `${name} #${tag} ${
                    private
                      ? SET_SMURF_PRIVATE_SUCCESS
                      : SET_SMURF_PUBLIC_SUCCESS
                  }`
                );
              }
            );
          }
        })
        .catch((err) => {
          if (err.status === 404) {
            message.reply(
              `${modifiedArgs[0]} and ${modifiedArgs[1]} ` +
                COMMAND_ERRORS.setSmurf
            );
          } else if (err.status === 500) {
            message.reply(
              `${modifiedArgs[0]} #${modifiedArgs[1]} ` +
                COMMAND_ERRORS.setSmurf_privateAccount
            );
          } else {
            console.log(err);
            message.reply("error: " + err);
          }
        });
    } else {
      message.reply(
        `"${command}` +
          stringArrToString(args) +
          '" ' +
          COMMAND_ERRORS.getSmurfCred_invalidArgs
      );
      message.reply(HAS_SPACES_REMINDER);
    }
    // makePublic command
  } else if (command === COMMANDS.makePublic) {
    const modifiedArgs = getModifiedArguments(argsAsString);
    if (modifiedArgs.length === 4) {
      findOneByNameAndTagAndUpdate(
        modifiedArgs[0],
        modifiedArgs[1],
        (account, successCallback) => {
          if (!account) {
            message.reply("account no exist");
          } else if (!account.private) {
            message.reply("already public");
          } else {
            account.username = modifiedArgs[2];
            account.password = modifiedArgs[3];
            account.private = false;
            successCallback();
            message.reply("update success");
          }
        }
      );
    } else {
      message.reply(
        `"${command}` +
          stringArrToString(args) +
          '" ' +
          COMMAND_ERRORS.getSmurfCred_invalidArgs
      );
      message.reply(HAS_SPACES_REMINDER);
    }
    // makePrivate command
  } else if (command === COMMANDS.makePrivate) {
    const modifiedArgs = getModifiedArguments(argsAsString);
    if (modifiedArgs.length === 2) {
      findOneByNameAndTagAndUpdate(
        modifiedArgs[0],
        modifiedArgs[1],
        (account, successCallback) => {
          if (!account) {
            message.reply("account no exist");
          } else if (account.private) {
            message.reply("already private");
          } else {
            account.username = null;
            account.password = null;
            account.private = true;
            successCallback();
            message.reply("update success");
          }
        }
      );
    } else {
      message.reply(
        `"${command}` +
          stringArrToString(args) +
          '" ' +
          COMMAND_ERRORS.getSmurfCred_invalidArgs
      );
      message.reply(HAS_SPACES_REMINDER);
    }
  } else {
    message.reply(`"${command}" ` + UNKNOWN_COMMAND);
  }

  if (command === "Test") {
    message.reply(
      `commandBody: ${commandBody} args: ${args} command: ${command} argsAsString: ${argsAsString}`
    );
  }
});

client.login(config.BOT_TOKEN);
