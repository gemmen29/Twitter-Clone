const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema(
  {
    username: String,
    text: String,
    room: String,
  },
  { timestamps: true }
);

const Msg = mongoose.model("Msg", msgSchema);

module.exports = Msg;
