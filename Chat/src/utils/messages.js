const Msg = require("../models/msg");

const generateMsg = (username, text, room) => {
  const msg = new Msg({ username, text, room });
  msg.save();
  return { username, text, createdAt: new Date().getTime() };
};

const generateLocationMsg = (username, url) => {
  return { username, url, createdAt: new Date().getTime() };
};
module.exports = { generateMsg, generateLocationMsg };
