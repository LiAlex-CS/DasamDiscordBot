const PREFIX = "$smurf ";

const COMMANDS = {
  getCommands: "help",
  getAllRanks: "ranks",
  getRankPlayer: "rank",
  getSmurfCred: "credentials",
  setSmurf: "setSmurf",
  makePublic: "makePublic",
  makePrivate: "makePrivate",
  test: "test",
};

const ALL_COMMANDS =
  'Here is a list of all commands:\n:question: **help**\n:question: **help** `<command>`\n:trophy: **ranks**\n:medal: **rank** `<player name>` `<tagline>`\n:page_facing_up: **credentials** `<player name>` `<tagline>`\n:pencil2: **setSmurf** `"<player name>"` `<tagline>`\n:pencil2: **setSmurf** `"<player name>"` `<tagline>` `<username>` `"<password>"`\n:unlock: **makePublic** `"<player name>"` `<tagline>` `<username>` `"<password>"`\n:lock: **makePrivate** `"<player name>"` `<tagline>`';

const UNKNOWN_COMMAND =
  'is a unknown command, type: "$smurf help" for a list of all commands or type: "$smurf help `<command>`" for a description of the command.';

const COMMAND_ERRORS = {
  getCommands:
    'is not a valid command, for all commands "type: $smurf help", for explanation on a command type: "$smurf help `<command>`".',
  getAllRanks_invalidRankOrTier: "has either invalid rank or tier.",
  getAllRanks_invalidRank: "is an invalid rank.",
  getAllRanks_invalidTierRadiant: "The Radiant rank has no tiers.",
  getAllRanks_noAccounts:
    "There are no acounts with the desired criteria. :x: :mag:",
  getAllRanks_errorFetching:
    "```fix\nThere was an error fetching some accounts, all available accounts are shown below:\n```",
  getRankPlayer:
    'is not a valid account, type: "$smurf rank `<player name>` `<tagline>`" to get the rank of your account.',
  getRankPlayer_privateAccount:
    'is a private account, you cannot retrieve this data, type: "$smurf rank `<player name>` `<tagline>`" to get the rank of your account.',
  getSmurfCred:
    'is not a valid account in the database, type: "$smurf credentials `<player name>` `<tagline>`" to get the credentials to your account.',
  getSmurfCred_privateAccount:
    "is a private account, you cannot access the credentials of this account. Public accounts are labeled in blue, while private accounts are labeled in white.",
  setSmurf:
    'are not valid player name and tagline, to set a smurf in the database type: "$smurf setSmurf `"<player name>"` `<tagline>` `<username>` `"<password>"`", or type: "$smurf setSmurf `"<player name>"` `<tagline>`".',
  setSmurf_nonUnique_account:
    'is already stored within the database, type: "$smurf ranks" to get all the accounts in the database.',
  setSmurf_privateAccount:
    'is a private account, you cannot retrieve this data. To set a smurf in the database type: "$smurf setSmurf `"<player name>"` `<tagline>` `<username>` `"<password>"`", or type: "$smurf setSmurf `"<player name>"` `<tagline>`".',
  getAllRanks_invalidArgs:
    'has invalid arguments, type: "$smurf ranks" to get all accounts. Type: "$smurf ranks `<rank>`" to get all accounts in a specific rank. Type: "$smurf ranks `<rank>` `<tier>`" to get all accounts in a specific tier.',
  getRankPlayer_invalidArgs:
    "has invalid arguments, this command takes the arguments `<player name>` `<tagline>`.",
  getSmurfCred_invalidArgs:
    "has invalid arguments, this command takes the arguments `<player name>` `<tagline>`.",
  setSmurf_invalidArgs:
    'has invalid arguments, this command takes the arguments `"<player name>"` `<tagline>` or the argmuents `"<player name>"` `<tagline>` `<username>` `"<password>"`.',
  makePublic_invalidArgs:
    'has invalid arguments, this command takes the arguments `"<player name>"` `<tagline>` `<username>` `"<password>"`.',
  makePrivate_invalidArgs:
    'has invalid arguments, this command takes the arguments `"<player name>"` `<tagline>`.',
  not_in_db:
    'is not stored within the database, type: "$smurf ranks" to get all the accounts in the database.',
  makePublic_already_public:
    'is already a public account, type: "$smurf ranks" to get all the accounts in the database. Public accounts are labeled in blue, while private accounts are labeled in white.',
  makePrivate_already_private:
    'is already a private account, type: "$smurf ranks" to get all the accounts in the database. Public accounts are labeled in blue, while private accounts are labeled in white.',
};

const COMMAND_DESCRIPTIONS = {
  getCommands:
    ':question: **help**: This command gives some support on using this discord bot, type: "$smurf help" for a list of all commands or type: "$smurf help `<command>`" for a description of the command. Ex. ```$smurf help ranks```',
  getAllRanks:
    ':trophy: **ranks**: This command gives the ranks of all accounts within the database.\nType: "$smurf ranks" to get all accounts.\nType: "$smurf ranks `<rank>`" to get all accounts in a specific rank.\nEx. ```$smurf ranks Silver```Type: "$smurf ranks `<rank>` `<tier>`" to get all accounts in a specific tier.\nEx. ```$smurf ranks Silver 1```',
  getRankPlayer:
    ':medal: **rank**: This command gives the rank of the player requested, type: "$smurf rank `<player name>` `<tagline>`" to get the rank of your account. Ex. ```$smurf rank nugnug 6135```',
  getSmurfCred:
    ':page_facing_up: **credentials**: This command gives the credentials to the requested account, type: "$smurf credentials `<player name>` `<tagline>`" to get the credentials to your account. Ex. ```$smurf credentials nugnug 6135```',
  setSmurf:
    ':pencil2: **setSmurf**: This command sets a new smurf account into the database.\nType: \n"$smurf setSmurf `"<player name>"` `<tagline>`" to set a private account.\nEx. ```$smurf setSmurf "nugnug" 6135```Type: \n"$smurf setSmurf `"<player name>"` `<tagline>` `<username>` `"<password>"` to set a public account".\nEx. ```$smurf setSmurf "nugnug" 6135 AlexUsername "Alex Password123"``` **Please only add valid accounts.**',
  makePublic:
    ':unlock: **makePublic**: This account sets a private account in the database into a public account.\nType:\n"$smurf makePublic `"<player name>"` `<tagline>` `<username>` `"<password>"`" to make a private account public.\n Ex.```$smurf makePublic nugnug 6135 AlexUsername "Alex Password123"```',
  makePrivate:
    ':lock: **makePrivate**: This account sets a public account in the database into a private account.\nType:\n"$smurf makePrivate `"<player name>"` `<tagline>`" to make a public account private.\n Ex.```$smurf makePrivate nugnug 6135```',
};

const SET_SMURF_PUBLIC_SUCCESS =
  "and its credentials has been added to the database!  :confetti_ball:  **Please note that this account and its credentials are now accessable to anyone who uses this bot.**";

const SET_SMURF_PRIVATE_SUCCESS =
  "has been added to the database!  :confetti_ball:";

const ACCOUNT_UPDATE_SUCCESS =
  "The account has been updated successfully! :confetti_ball:";

const RANKS_INTRO = "Here is a list of all accounts and their ranks:\n\n";

const HAS_SPACES_REMINDER =
  'If any arguments have spaces, remember to add quotation marks around them. Ex. `<player name>: "nug nug"`.';

const RANK_EMOJIS = {
  Radiant: ":sparkles:",
  Immortal: ":white_flower:",
  Ascendant: ":sparkle:",
  Diamond: ":gem:",
  Platinum: ":shield:",
  Gold: ":first_place:",
  Silver: ":second_place:",
  Bronze: ":third_place:",
  Iron: ":gear:",
  Error: ":x:",
};

const REGION_INDICATOR_SYMBOLS = {
  "🇦": 0,
  "🇧": 1,
  "🇨": 2,
  "🇩": 3,
  "🇪": 4,
  "🇫": 5,
  "🇬": 6,
  "🇭": 7,
  "🇮": 8,
  "🇯": 9,
  "🇰": 10,
  "🇱": 11,
  "🇲": 12,
  "🇳": 13,
  "🇴": 14,
  "🇵": 15,
  "🇶": 16,
  "🇷": 17,
  "🇸": 18,
  "🇹": 19,
};

module.exports = {
  PREFIX,
  COMMANDS,
  ALL_COMMANDS,
  UNKNOWN_COMMAND,
  COMMAND_ERRORS,
  COMMAND_DESCRIPTIONS,
  RANKS_INTRO,
  HAS_SPACES_REMINDER,
  SET_SMURF_PUBLIC_SUCCESS,
  SET_SMURF_PRIVATE_SUCCESS,
  RANK_EMOJIS,
  ACCOUNT_UPDATE_SUCCESS,
  REGION_INDICATOR_SYMBOLS,
};
