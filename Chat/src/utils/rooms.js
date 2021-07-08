const mongoose = require("./db");
const Room = mongoose.model("Room", { room: String });

const rooms = [];
const createRoom = async (usernameFrom, usernameTo) => {
  const currentRoom = await Room.findOne({
    $or: [
      { room: usernameFrom + usernameTo },
      { room: usernameTo + usernameFrom },
    ],
  });
  if (currentRoom) {
    console.log(
      "heeeelooooooooooooooooooooooooooooooooooooooo",
      currentRoom.room
    );
    return currentRoom.room;
  }
  const room = usernameFrom + usernameTo;
  console.log("dddddddddddddddddddddddddddddd", room);
  const newRoom = new Room({ room });
  await newRoom.save();
  return room;
};

module.exports = { createRoom };
