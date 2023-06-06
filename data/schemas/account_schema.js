const mongoose = require("mongoose");
const { ACCOUNTS_COLLECTION } = require("../../constants/mongodb_consts");

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    name: { type: String, required: true },
    tag: { type: String, required: true },
    puuid: { type: String, required: true, index: true },
    username: { type: String },
    password: { type: String },
    private: { type: Boolean, required: true, default: false },
    creator_disc_id: { type: String, required: true },
    guild: { type: String, required: true, index: true },
  },
  { collection: ACCOUNTS_COLLECTION }
);

const SmurfAccounts = mongoose.model(
  ACCOUNTS_COLLECTION,
  AccountSchema,
  ACCOUNTS_COLLECTION
);

module.exports = { SmurfAccounts };
