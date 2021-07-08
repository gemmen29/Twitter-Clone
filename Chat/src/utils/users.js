const mongoose = require("./db");

const User = mongoose.model("User", { username: String });
const pop = async () => {
  await User.deleteMany();
  await new User({ username: "mohiey" }).save();
  await new User({ username: "shahier" }).save();
  await new User({ username: "george" }).save();
  await new User({ username: "shady" }).save();
  await new User({ username: "keroo" }).save();
  console.log("db populated");
};
pop();
const getOnlineUsers = async () => {
  console.log("getting users");
  const users = await User.find();
  return users.map((user) => {
    return {
      username: user.username,
    };
  });
};

const addUser = async () => {};

module.exports = { getOnlineUsers };
