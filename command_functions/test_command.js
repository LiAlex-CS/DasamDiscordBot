const test_command = (message, command, commandBody, args, argsAsString) => {
  message.reply(
    `commandBody: ${commandBody}\nargs: ${args}\ncommand: ${command}\nargsAsString: ${argsAsString}`
  );
  message.reply(
    "from: " + message.author.username + ", id: " + message.author.id
  );
};

module.exports = { test_command };
