const PREFIX = "$smurf ";

const COMMANDS = {
  getCommands: "help",
  getAllRanks: "ranks",
  getRankPlayer: "rank",
  getSmurfCred: "credentials",
  setSmurf: "setsmurf",
};

const ALL_COMMANDS =
  "Here is a list of all commands:\nhelp\nhelp <command>\nranks\nrank <player name> <tagline>\ncredentials <player name> <tagline>\nsetSmurf <player name> <tagline> <username> <password>";

const UNKNOWN_COMMAND =
  'is a unknown command, type: "$smurf help" for a list of all commands or type: "$smurf help <command>" for a description of the command';

const COMMAND_ERRORS = {
  getCommands:
    'is not a valid command, for all commands "type: $smurf help", for explanation on a command type: "$smurf help <command>"',
  getRankPlayer:
    'is not a valid account, type: "$smurf rank <player name> <tagline>" to get the rank of your account',
  getRankPlayer_privateAccount:
    'is a private account, this bot cannot retrieve data, type: "$smurf rank <player name> <tagline>" to get the rank of your account',
  getSmurfCred:
    'is not a valid account in the database, type: "$smurf credentials <player name> <tagline>" to get the credentials to your account',
  setSmurf:
    'are not valid player name and tagline, to set a smurf in the database type: "$smurf setSmurf "<player name>" <tagline> <username> "<password>""',
  getAllRanks_invalidArgs:
    "has invalid arguments, this command takes no arguments",
  getRankPlayer_invalidArgs:
    "has invalid arguments, this command takes the arguments <player name> <tagline>",
  getSmurfCred_invalidArgs:
    "has invalid arguments, this command takes the arguments <player name> <tagline>",
  setSmurf_invalidArgs:
    'has invalid arguments, this command takes the arguments "<player name>" <tagline> <username> "<password>"',
};

const COMMAND_DESCRIPTIONS = {
  getCommands:
    ':question: **help**: This command gives some support on using this discord bot, type: "$smurf help" for a list of all commands or type: "$smurf help `<command>`" for a description of the command. Ex. ```$smurf help ranks```',
  getAllRanks:
    ":medal: **ranks**: This command gives the ranks of all accounts within the database",
  getRankPlayer:
    ':medal: **rank**: This command gives the rank of the player requested, type: "$smurf rank `<player name>` `<tagline>`" to get the rank of your account. Ex. ```$smurf rank nugnug 6135```',
  getSmurfCred:
    ':pencil: **credentials**: This command gives the credentials to the requested account, type: "$smurf credentials `<player name>` `<tagline>`" to get the credentials to your account. Ex. ```$smurf credentials nugnug 6135```',
  setSmurf:
    ':pencil2: **setSmurf**: This command sets a new smurf account into the database, type: \n"$smurf setSmurf `"<player name>"` `<tagline>` `<username>` `"<password>"`". Ex. ```$smurf setSmurf "nugnug" 6135 AlexUsername "Alex Password123"```Please only add valid accounts.',
};

const SET_SMURF_SUCCESS =
  "You have successfully added account credentials to the database. Please note that this account and its credentials are now accessible to anyone who uses this bot.";

const RANKS_INTRO = "Here is a list of all accounts and their ranks:";

const HAS_SPACES_REMINDER =
  'If any arguments have spaces, remember to add quotation marks around them. Ex. <player name>: "nug nug"';

module.exports = {
  PREFIX,
  COMMANDS,
  ALL_COMMANDS,
  UNKNOWN_COMMAND,
  COMMAND_ERRORS,
  COMMAND_DESCRIPTIONS,
  RANKS_INTRO,
  HAS_SPACES_REMINDER,
  SET_SMURF_SUCCESS,
};
