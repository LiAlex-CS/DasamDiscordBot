const mongoose = require("mongoose");
const { ACCOUNTS_COLLECTION } = require("../../constants/mongodb_consts");

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    name: { type: String, required: true },
    tag: { type: String, required: true },
    puuid: { type: String, required: true },
    username: { type: String },
    password: { type: String },
    private: { type: Boolean, required: true, default: false },
  },
  { collection: ACCOUNTS_COLLECTION }
);

const AccountDetails = mongoose.model(
  ACCOUNTS_COLLECTION,
  AccountSchema,
  ACCOUNTS_COLLECTION
);

module.exports = { AccountDetails };
