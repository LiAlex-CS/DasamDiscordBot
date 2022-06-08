const { ServerApiVersion } = require("mongodb");
const { AccountDetails } = require("./schemas/accountSchema");

const getAccounts = async () => {
  const data = await AccountDetails.find({}).exec();
  return data;
};

const getAccountByNameAndTag = async (name, tag) => {
  const account = await AccountDetails.findOne({ name: name, tag: tag });
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

const addToCollection = async (data, cb) => {
  const NewAccount = new AccountDetails({
    name: data.name,
    tag: data.tag,
    puuid: data.puuid,
    username: data.username,
    password: data.password,
  });

  NewAccount.save((err, account) => {
    if (err) console.error(err);
    cb(account.name, account.tag);
  });
};

module.exports = {
  ServerApiVersion,
  getAccounts,
  getAccountByNameAndTag,
  updateAccountNameByPuuid,
  updateAccountTagByPuuid,
  addToCollection,
};
