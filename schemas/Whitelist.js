const { Schema, model } = require("mongoose");

const Whitelist = new Schema({
  MessageID: {
    type: String,
    require: true,
  },
  AuthorID: {
    type: String,
    require: true,
  },
});

module.exports = model("whitelist", Whitelist);
