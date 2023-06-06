const mongoose = require("mongoose");
const { DISCORD_USER_COLLECTION } = require("../../constants/mongodb_consts");

const Schema = mongoose.Schema;

const DiscordUserSchema = new Schema(
  {
    disc_id: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { collection: DISCORD_USER_COLLECTION }
);

const DiscordUsers = mongoose.model(
  DISCORD_USER_COLLECTION,
  DiscordUserSchema,
  DISCORD_USER_COLLECTION
);

module.exports = { DiscordUsers };
