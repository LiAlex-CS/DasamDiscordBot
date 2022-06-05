const { JSONHasValue, stringArrToString, mmrDataToString, updateNameAndTag, mmrDataSingleToString } = require('./services');
const { getRankedData, getUserData, getRankedDataByPUUIDs } = require("./fetching/fetching");
const { PREFIX, COMMANDS, ALL_COMMANDS, UNKNOWN_COMMAND, COMMAND_ERRORS, COMMAND_DESCRIPTIONS, RANKS_INTRO } = require("./constants/commands");
const Discord = require("discord.js");
const config = require("./config.json");
const db = require("./data/smurfCreds.json");
const fs = require("fs");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const commandBody = message.content.slice(PREFIX.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();


    if (command === COMMANDS.getCommands) {
        if (!args.length) {
            message.reply(ALL_COMMANDS);
        }
        else if (args.length === 1 && JSONHasValue(args[0], COMMANDS)) {
            if (args[0] === COMMANDS.getCommands) {
                message.reply(COMMAND_DESCRIPTIONS.getCommands)
            }
            else if (args[0] === COMMANDS.getAllRanks) {
                message.reply(COMMAND_DESCRIPTIONS.getAllRanks)
            }
            else if (args[0] === COMMANDS.getRankPlayer) {
                message.reply(COMMAND_DESCRIPTIONS.getRankPlayer)
            }

            else if (args[0] === COMMANDS.getSmurfCred) {
                message.reply(COMMAND_DESCRIPTIONS.getSmurfCred)
            }
            else {
                message.reply(COMMAND_DESCRIPTIONS.setSmurf)
            }
        }
        else {
            message.reply(`"${command} ` + stringArrToString(args) + '" ' + COMMAND_ERRORS.getCommands)
        }
    }
    else if (command === COMMANDS.getAllRanks) {
        if (!args.length) {
            let reply = RANKS_INTRO;
            getRankedDataByPUUIDs(db.user_credentials.map((user) => user.puuid))
                .then((data) => { 
                    reply = reply + mmrDataToString(data);
                    message.reply(reply);
                    updateNameAndTag(data);
                }).catch((err)=>{
                    message.reply('error: ' + err);
                });
        }
        else {
            message.reply(`"${command} ` + stringArrToString(args) + '" ' + COMMAND_ERRORS.getAllRanks_invalidArgs)
        }
    }
    else if (command === COMMANDS.getRankPlayer) {
        if (args.length === 2) {
            getRankedData(args[0], args[1])
                .then((data) => { 
                    if(data.status === 404){
                        throw data;
                    }
                    message.reply(mmrDataSingleToString(data));
                }).catch((err)=>{
                    if(err.status === 404){
                        message.reply(stringArrToString(args) + '" ' + COMMAND_ERRORS.getRankPlayer);
                    }
                    else{
                        message.reply('error: ' + err);
                    }
                });
        }
        else {
            message.reply(`"${command} ` + stringArrToString(args) + '" ' + COMMAND_ERRORS.getRankPlayer_invalidArgs)
        }
    }
    else if (command === COMMANDS.getSmurfCred) {

    }
    else if (command === COMMANDS.setSmurf) {

    }
    else {
        message.reply(`"${command}" ` + UNKNOWN_COMMAND);
    }

    if (command === "test") {
        message.reply(`commandBody: ${commandBody} args: ${args} command: ${command}`);
    }

    // if (command === "ping") {
    //     const timeTaken = Date.now() - message.createdTimestamp;
    //     message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    // }
    // else if (command === "sum") {
    //     const numArgs = args.map(x => parseFloat(x));
    //     const sum = numArgs.reduce((counter, x) => counter += x);
    //     message.reply(`The sum of all the arguments you provided is ${sum}!`);
    // }
});



client.login(config.BOT_TOKEN);