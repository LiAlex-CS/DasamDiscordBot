const { ServerApiVersion } = require("mongodb");
const { SmurfAccounts } = require("./schemas/accountSchema");
const { DiscordUsers } = require("./schemas/discordUserSchema");
const { getUserData } = require("../fetching/fetching");
const { STATUS_CODES } = require("../constants/status_codes");

const getAccountsByGuild = async (guildId) => {
  const data = await SmurfAccounts.find({ guild: guildId }).exec();
  return data;
};

const getAccountByPuuid = async (puuid, guild) => {
  const account = await SmurfAccounts.findOne({ puuid: puuid, guild: guild });
  return account;
};

const getAccountByNameAndTag = async (name, tag, guild) => {
  const userData = await getUserData(name, tag);
  if (userData.status !== STATUS_CODES.ok) {
    throw userData;
  } else {
    const account = await getAccountByPuuid(userData.data.puuid, guild);
    return account;
  }
};

const updateAccountNameByPuuid = async (puuid, newName) => {
  await SmurfAccounts.updateMany({ puuid: puuid }, { $set: { name: newName } });
};

const updateAccountTagByPuuid = async (puuid, newTag) => {
  await SmurfAccounts.updateMany({ puuid: puuid }, { $set: { tag: newTag } });
};

const addToCollection = async (data, savingCallback) => {
  const NewAccount = new SmurfAccounts({
    name: data.name,
    tag: data.tag,
    puuid: data.puuid,
    username: data.username,
    password: data.password,
    private: data.private,
    creator_disc_id: data.creator_disc_id,
    guild: data.guild,
  });

  NewAccount.save((err, account) => {
    savingCallback(err, account.name, account.tag);
  });
};

const addDiscordUser = async (id, savingCallback) => {
  const found = await DiscordUsers.findOne({ disc_id: id });
  if (!found) {
    const newDiscordUser = new DiscordUsers({
      disc_id: id,
      isAdmin: false,
    });
    newDiscordUser.save((err) => {
      savingCallback(err);
    });
  }
};

const isDiscordUserAdmin = async (id) => {
  const user = await DiscordUsers.findOne({ disc_id: id });
  if (user) {
    return user.isAdmin;
  }
  return false;
};

module.exports = {
  ServerApiVersion,
  getAccountsByGuild,
  getAccountByNameAndTag,
  getAccountByPuuid,
  updateAccountNameByPuuid,
  updateAccountTagByPuuid,
  addToCollection,
  addDiscordUser,
  isDiscordUserAdmin,
};
