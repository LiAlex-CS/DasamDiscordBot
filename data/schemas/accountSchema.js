const mongoose = require("mongoose");
const {
  ACCOUNTS_COLLECTION,
  DATABASE,
} = require("../../constants/mongodb_consts");

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    name: { type: String, required: true },
    tag: { type: String, required: true },
    puuid: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { collection: ACCOUNTS_COLLECTION }
);

const AccountDetails = mongoose.model(
  ACCOUNTS_COLLECTION,
  AccountSchema,
  ACCOUNTS_COLLECTION
);

module.exports = { AccountDetails };
