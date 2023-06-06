const PREFIX = "$smurf";
const PREFIX_DEV = "$smurf-d";

const COMMANDS = {
  getCommands: "help",
  getAllRanks: "ranks",
  getRankPlayer: "rank",
  getSmurfCred: "credentials",
  addSmurf: "addSmurf",
  makePublic: "makePublic",
  makePrivate: "makePrivate",
  update: "update",
  delete: "delete",
  test: "test",
};

const BOT_DESCRIPTION =
  ":wave:   Hi, Do you need a Valorant smurf? The **DasamRankBot** gives you access to all the Dasam smurf accounts and tracks their ranks. To get started, type:\n ```$smurf ranks```\n to get all the ranks of the Dasam accounts, and find an account for you to use. Type:\n ```$smurf help```\n to checkout all the other functions of the bot such as setting your own personal smurfs, and finding the rank of any Valorant account.";

const ALL_COMMANDS =
  'Here is a list of all commands:\n:question: **help**\n:question: **help** `<command>`\n:trophy: **ranks**\n:medal: **rank** `<player name>` `<tagline>`\n:page_facing_up: **credentials** `<player name>` `<tagline>`\n:pencil2: **addSmurf** `"<player name>"` `<tagline>`\n:pencil2: **addSmurf** `"<player name>"` `<tagline>` `<username>` `"<password>"`\n:unlock: **makePublic** `"<player name>"` `<tagline>` `<username>` `"<password>"`\n:lock: **makePrivate** `"<player name>"` `<tagline>`\n:wrench: **update** `"<player name>"` `<tagline>`\n:wrench: **update** `"<player name>"` `<tagline>` `<username>` `"<password>"`\n:soap: **delete** `"<player name>"` `<tagline>`';

const UNKNOWN_COMMAND =
  'is a unknown command.\nType: "*$smurf help*" for a list of all commands or type: "*$smurf help `<command>`*" for a description of the command.';

const COMMAND_ERRORS = {
  getCommands:
    'is not a valid command, for all commands "type: $smurf help", for explanation on a command type: "$smurf help `<command>`".',
  getAllRanksInvalidRankOrTier: "has either invalid rank or tier.",
  getAllRanksInvalidRank: "is an invalid rank.",
  getAllRanksInvalidTierRadiant: "The Radiant rank has no tiers.",
  getAllRanksNoAccounts:
    "There are no acounts with the desired criteria. :x: :mag:",
  getAllRanksErrorFetching:
    "```fix\nThere was an error fetching some accounts, all available accounts are shown below:\n```",
  getRankPlayer:
    'is not a valid Valorant account, type: "$smurf rank `<player name>` `<tagline>`" to get the rank of your account.',
  getSmurfCred:
    'is not in the database, type: "$smurf credentials `<player name>` `<tagline>`" to get the credentials to your account. Ensure that you have already added this acount with "$smurf addSmurf" in this server.',
  getSmurfCredInvalidAccount:
    'is not a valid Valorant account, type: "$smurf credentials `<player name>` `<tagline>`" to get the credentials to your account.',
  updateSmurfInvalidAccount:
    'is not a valid Valorant account, type: "$smurf update `<player name>` `<tagline>`", or "$smurf update `<player name>` `<tagline>` `<username>` `<password>`" to update your account.',
  updateSmurfForbidden:
    "could not be updated because this account data is forbidden. This might be a result of the account owner not publicizing account data or temporary Riot patches, please try again later.",
  updateSmurfInvalidArgs:
    'has invalid arguments, this command takes the arguments `"<player name>"` `<tagline>` or the argmuents `"<player name>"` `<tagline>` `<username>` `"<password>"`.',
  getSmurfCredForbidden:
    "credentials could not be fetched because this account data is forbidden. This might be a result of the account owner not publicizing account data or temporary Riot patches, please try again later.",
  getSmurfCredPrivateAccount:
    "is a private account, you cannot access the credentials of this account. Public accounts are labeled in blue, while private accounts are labeled in white.",
  addSmurf:
    'are not valid player name and tagline, to set a smurf in the database type: "$smurf addSmurf `"<player name>"` `<tagline>` `<username>` `"<password>"`", or type: "$smurf addSmurf `"<player name>"` `<tagline>`".',
  addSmurfNonUniqueAccount:
    'is already stored within the database, type: "$smurf ranks" to get all the accounts in the database.',
  addSmurfForbidden:
    "account data is forbidden and could not be added to the database. This might be a result of the account owner not publicizing account data or temporary Riot patches, please try again later.",
  getAllRanksInvalidArgs:
    'has invalid arguments, type: "$smurf ranks" to get all accounts. Type: "$smurf ranks `<rank>`" to get all accounts in a specific rank. Type: "$smurf ranks `<rank>` `<tier>`" to get all accounts in a specific tier.',
  getRankPlayerInvalidArgs:
    'has invalid arguments, this command takes the arguments `"<player name>"` `<tagline>`.',
  getSmurfCredInvalidArgs:
    'has invalid arguments, this command takes the arguments `"<player name>"` `<tagline>`.',
  addSmurfInvalidArgs:
    'has invalid arguments, this command takes the arguments `"<player name>"` `<tagline>` or the argmuents `"<player name>"` `<tagline>` `<username>` `"<password>"`.',
  makePublicInvalidArgs:
    'has invalid arguments, this command takes the arguments `"<player name>"` `<tagline>` `<username>` `"<password>"`.',
  makePublicAlreadyPublic:
    'is already a public account, type: "$smurf ranks" to get all the accounts in the database. Public accounts are labeled in blue, while private accounts are labeled in white.',
  makePublicInvalidAccount:
    'is not a valid Valorant account, type: "$smurf makePublic `<player name>` `<tagline>` `<username>` `<password>`", to publicize your account.',
  makePublicForbidden:
    "could not be made public because this account data is forbidden. This might be a result of the account owner not publicizing account data or temporary Riot patches, please try again later.",
  makePrivateInvalidArgs:
    'has invalid arguments, this command takes the arguments `"<player name>"` `<tagline>`.',
  makePrivateInvalidAccount:
    'is not a valid Valorant account, type: "$smurf makePrivate `<player name>` `<tagline>`", to privatize your account.',
  makePrivateForbidden:
    "could not be made private because this account data is forbidden. This might be a result of the account owner not publicizing account data or temporary Riot patches, please try again later.",
  deleteForbidden:
    "could not be deleted because this account data is forbidden. This might be a result of the account owner not publicizing account data or temporary Riot patches, please try again later.",
  deleteInvalidAccount:
    'is not a valid Valorant account, type: "$smurf makePrivate `<player name>` `<tagline>`", to delete your account.',
  deleteInvalidArgs:
    'has invalid arguments, this command takes the arguments `"<player name>"` `<tagline>`.',
  notInDatabase:
    'is not stored within the database, type: "$smurf ranks" to get all the accounts in the database.',
  alreadyPrivate:
    'is already a private account, type: "$smurf ranks" to get all the accounts in the database. Public accounts are labeled in blue, while private accounts are labeled in white.',
  unauthorizedModification:
    "This is not your smurf account, you cannot change the status of this account.",
  errorSavingValorantAccount:
    ":x: There was an error saving these account updates.",
  errorSavingDiscordAccount:
    ":x: There was an error saving discord information to the database.",
};

const COMMAND_DESCRIPTIONS = {
  getCommands:
    ':question: **help**: This command gives some support on using this discord bot.\nType: "*$smurf help*" for a list of all commands.\nType: "*$smurf help `<command>`*" for a description of the command.\n\n__Example:__```$smurf help ranks```',
  getAllRanks:
    ':trophy: **ranks**: This command gives the ranks of all accounts within the database.\nType: "*$smurf ranks*" to get all accounts.\nType: "*$smurf ranks `<rank>`*" to get all accounts in a specific rank.\n\n__Example:__```$smurf ranks Silver```\nType: "$smurf ranks `<rank>` `<tier>`" to get all accounts in a specific tier.\n\n__Example:__```$smurf ranks Silver 1```\nReact to the correlating emote ( :regional_indicator_a:,:regional_indicator_b:,:regional_indicator_c:, ... ) to get the credentials for a specific account.',
  getRankPlayer:
    ':medal: **rank**: This command gives the rank of the player requested.\nType: "*$smurf rank `<player name>` `<tagline>`*" to get the rank of your account.\n\n__Example:__```$smurf rank nugnug 6135```',
  getSmurfCred:
    ':page_facing_up: **credentials**: This command gives the credentials to the requested account.\nType: "*$smurf credentials `<player name>` `<tagline>`*" to get the credentials to your account.\n\n__Example:__ ```$smurf credentials nugnug 6135```',
  addSmurf:
    ':pencil2: **addSmurf**: This command sets a new smurf account into the database.\nType: "*$smurf addSmurf `"<player name>"` `<tagline>`*" to set a private account.\n\n__Example:__ ```$smurf addSmurf "nugnug" 6135```\nType: "*$smurf addSmurf `"<player name>"` `<tagline>` `<username>` `"<password>"`*" to set a public account.\n\n__Example:__```$smurf addSmurf nugnug 6135 AlexUsername "Alex Password123"```\n:bangbang:  **Please only add valid accounts with valid account credentials.**  :bangbang:',
  makePublic:
    ':unlock: **makePublic**: This command sets a private account in the database into a public account.\nType: "*$smurf makePublic `"<player name>"` `<tagline>` `<username>` `"<password>"`*" to make a private account public.\n\n__Example:__```$smurf makePublic nugnug 6135 AlexUsername "Alex Password123"```',
  makePrivate:
    ':lock: **makePrivate**: This command sets a public account in the database into a private account.\nType: "*$smurf makePrivate `"<player name>"` `<tagline>`*" to make a public account private.\n\n__Example:__```$smurf makePrivate nugnug 6135```',
  update:
    ':wrench: **update**: This command updates an accounts credentials or status.\n Type: "*$smurf update `"<player name>"` `<tagline>` `<username>` `"<password>"`*" to update the credentials of that account or to make the status of that account public.\n\n__Example:__```$smurf update nugnug 6135 AlexUsername "Alex Password123"```\nType: "*$smurf update `"<player name>"` `<tagline>` *" to make the status of an public account private.\n\n__Example:__```$smurf update nugnug 6135```',
  delete:
    ':soap: **delete**: This command deletes a smurf account.\n Type: "*$smurf delete `"<player name>"` `<tagline>`*" to delete that account.\n\n__Example:__```$smurf delete nugnug 6135```',
};

const SET_SMURF_PUBLIC_SUCCESS =
  "and its credentials has been added to the database!  :confetti_ball:\n**Please note that this account and its credentials are now accessable to anyone in the server who uses this bot.**";

const SET_SMURF_PRIVATE_SUCCESS =
  "has been added to the database!  :confetti_ball:";

const ACCOUNT_UPDATE_SUCCESS =
  "The account has been updated successfully! :confetti_ball:";

const ACCOUNT_DELETE_SUCCESS =
  "The account has been successfully deleted. :wave:";

const RANKS_INTRO = "Here is a list of all accounts and their ranks:\n\n";

const REACTIONS_DESCRIPTION =
  "\n**React to the letters below corresponding to a smurf account to get the credentials of that account.**";

const HAS_SPACES_REMINDER =
  'If any arguments have spaces, remember to add quotation marks around them.\n\n__Example:__   `<player name>: "nug nug"`.';

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

const MAX_ACCOUNTS_PER_PAGE = 12;
const REACTION_COLLECTION_TIME = 300000;

module.exports = {
  PREFIX,
  PREFIX_DEV,
  COMMANDS,
  ALL_COMMANDS,
  UNKNOWN_COMMAND,
  COMMAND_ERRORS,
  COMMAND_DESCRIPTIONS,
  RANKS_INTRO,
  REACTIONS_DESCRIPTION,
  HAS_SPACES_REMINDER,
  SET_SMURF_PUBLIC_SUCCESS,
  SET_SMURF_PRIVATE_SUCCESS,
  ACCOUNT_UPDATE_SUCCESS,
  ACCOUNT_DELETE_SUCCESS,
  RANK_EMOJIS,
  REGION_INDICATOR_SYMBOLS,
  MAX_ACCOUNTS_PER_PAGE,
  REACTION_COLLECTION_TIME,
  BOT_DESCRIPTION,
};
