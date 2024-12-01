const { helpCommand } = require("./help_command");
const { ranksCommand } = require("./ranks_command");
const { rankCommand } = require("./rank_command");
const { credentialsCommand } = require("./credentials_command");
const { addCommand } = require("./add_command");
const { makePublicCommand } = require("./make_public_command");
const { makePrivateCommand } = require("./make_private_command");
const { updateCommand } = require("./update_command");
const { deleteCommand } = require("./delete_command");
const { unknownCommand } = require("./unknown_command");
const { testCommand } = require("./test_command");
const { noCommand } = require("./no_command");

module.exports = {
  helpCommand,
  ranksCommand,
  rankCommand,
  credentialsCommand,
  addCommand,
  makePublicCommand,
  makePrivateCommand,
  updateCommand,
  deleteCommand,
  unknownCommand,
  testCommand,
  noCommand,
};
