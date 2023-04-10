const { help_command } = require("./help_command");
const { ranks_command } = require("./ranks_command");
const { rank_command } = require("./rank_command");
const { credentials_command } = require("./credentials_command");
const { addSmurf_command } = require("./addSmurf_command");
const { makePublic_command } = require("./makePublic_command");
const { makePrivate_command } = require("./makePrivate_command");
const { unknown_command } = require("./unknown_command");
const { test_command } = require("./test_command");
const { no_command } = require("./no_command");

module.exports = {
  help_command,
  ranks_command,
  rank_command,
  credentials_command,
  addSmurf_command,
  makePublic_command,
  makePrivate_command,
  unknown_command,
  test_command,
  no_command,
};
