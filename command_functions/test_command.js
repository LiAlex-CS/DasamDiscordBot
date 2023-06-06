const testCommand = (message, command, commandBody, args, argsAsString) => {
  message.reply(
    `commandBody: ${commandBody}\nargs: ${args}\ncommand: ${command}\nargsAsString: ${argsAsString}`
  );
  message.reply(
    `from: "${message.author.username}", id: "${message.author.id}`
  );
  message.reply(
    `Guild Id: ${message.guildId}, Channel Id: ${message.channelId}`
  );
};

module.exports = { testCommand };
