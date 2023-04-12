const { ServerApiVersion } = require("mongodb");
const { AccountDetails } = require("./schemas/accountSchema");
const { DiscordUsers } = require("./schemas/discordUserSchema");

const getAccountsByGuild = async (guildId) => {
  const data = await AccountDetails.find({ guilds: guildId }).exec();
  return data;
};

const getAccountByNameAndTag = async (name, tag) => {
  const account = await AccountDetails.findOne({ name: name, tag: tag });
  return account;
};

const getAccountByPuuid = async (puuid) => {
  const account = await AccountDetails.findOne({ puuid: puuid });
  return account;
};

const updateAccountNameByPuuid = async (puuid, newName) => {
  const doc = await AccountDetails.findOne({ puuid: puuid });
  doc.name = newName;
  doc.save();
};

const updateAccountTagByPuuid = async (puuid, newTag) => {
  const doc = await AccountDetails.findOne({ puuid: puuid });
  doc.tag = newTag;
  doc.save();
};

const addToCollection = async (data, savingCallback) => {
  const NewAccount = new AccountDetails({
    name: data.name,
    tag: data.tag,
    puuid: data.puuid,
    username: data.username,
    password: data.password,
    private: data.private,
    creator_disc_id: data.creator_disc_id,
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
