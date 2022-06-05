const { JSONHasValue, stringArrToString, mmrDataToString, updateNameAndTag, mmrDataSingleToString, searchDbByNameAndTag, getModifiedArguments } = require('./services');
const { getRankedData, getUserData, getRankedDataByPUUIDs } = require("./fetching/fetching");
const { PREFIX, COMMANDS, ALL_COMMANDS, UNKNOWN_COMMAND, COMMAND_ERRORS, COMMAND_DESCRIPTIONS, RANKS_INTRO, HAS_SPACES_REMINDER, SET_SMURF_SUCCESS } = require("./constants/commands");
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
    const argsAsString =  message.content.slice(PREFIX.length + command.length + 1);


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
        if (args.length >= 2) {
            getRankedData(stringArrToString(args.slice(0, -1)), args[args.length - 1])
                .then((data) => { 
                    if(data.status !== 200){
                        throw data;
                    }else{
                        message.reply(mmrDataSingleToString(data));
                    }
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
        const modifiedArgs = getModifiedArguments(argsAsString);
        if (modifiedArgs.length >= 2) {
            const name = stringArrToString(modifiedArgs.slice(0, -1));
            const tag = modifiedArgs[modifiedArgs.length - 1];

            const data = searchDbByNameAndTag(name, tag, db.user_credentials);
            if(Object.keys(data).length){
                message.reply(`For account: ${name} #${tag}, Username: ${data.username} Password: ${data.password}`);
            }
            else{
                message.reply(`User: ${name} #${tag} ` + COMMAND_ERRORS.getSmurfCred);
            }
        }
        else {
            message.reply(`"${command} ` + stringArrToString(modifiedArgs) + '" ' + COMMAND_ERRORS.getSmurfCred_invalidArgs)
        }
    }
    else if (command === COMMANDS.setSmurf) {
        const modifiedArgs = getModifiedArguments(argsAsString);
        if (modifiedArgs.length === 4) {
            let userData = db;
            getUserData(modifiedArgs[0], modifiedArgs[1]).then((data)=>{
                if(data.status !== 200){
                    throw data
                }
                else {
                    userData.user_credentials.push(
                        {
                            name: modifiedArgs[0],
                            tag: modifiedArgs[1],
                            puuid: data.data.puuid,
                            username: modifiedArgs[2],
                            password: modifiedArgs[3]
                        }
                    )
                    fs.writeFileSync('./data/smurfCreds.json', JSON.stringify(userData));
                    message.reply(SET_SMURF_SUCCESS);
                }
            }).catch((err)=>{
                if(err.status === 404){
                    message.reply(`${modifiedArgs[0]} and ${modifiedArgs[1]} ` + COMMAND_ERRORS.setSmurf);
                }
                else{
                    message.reply('error: ' + err);
                }
            });
            
        }
        else {
            message.reply(`"${command} ` + stringArrToString(args) + '" ' + COMMAND_ERRORS.getSmurfCred_invalidArgs);
            message.reply(HAS_SPACES_REMINDER);
        }
    }
    else {
        message.reply(`"${command}" ` + UNKNOWN_COMMAND);
    }

    if (command === "test") {
        message.reply(`commandBody: ${commandBody} args: ${args} command: ${command} argsAsString: ${argsAsString}`);
    }
});



client.login(config.BOT_TOKEN);