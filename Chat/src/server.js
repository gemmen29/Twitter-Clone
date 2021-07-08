const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const Filter = require("bad-words");
var jwtDecode = require("jwt-decode");
var cors = require("cors");

const { generateMsg } = require("./utils/messages");
const { createRoom } = require("./utils/rooms");
const Msg = require("./models/msg");

const publicDirectoryPath = path.join(__dirname, "../public");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(publicDirectoryPath));
app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("Connected to socket");

  socket.on("typing", (usernameFrom, currentChat) => {
    socket.broadcast.to(currentChat).emit("showTyping", usernameFrom);
  });
  socket.on("doneTyping", (currentChat) => {
    socket.broadcast.to(currentChat).emit("removeTyping");
  });

  socket.on("startChat", ({ token, usernameTo }, callback) => {
    const { sub: usernameFrom } = jwtDecode(token);
    createRoom(usernameFrom, usernameTo).then((currentChat) => {
      callback(currentChat, usernameFrom);
    });
  });
  socket.on("getMsgs", async (room) => {
    const msgs = await Msg.find({ room });
    console.log(msgs);
    socket.emit("populate", msgs);
  });
  socket.on("joined", (currentChat, usernameFrom) => {
    console.log("joined to", currentChat);
    socket.join(currentChat);
  });
  socket.on("sendMessage", (currentChat, usernameFrom, msg, callback) => {
    console.log("send to", currentChat);
    io.to(currentChat).emit(
      "message",
      generateMsg(usernameFrom, msg, currentChat)
    );
    callback();
  });
});
app.get("/", async (req, res) => {
  res.render("index.html");
});
let data = {};
app.post("/chat", (req, res) => {
  console.log(
    "new usernew usernew usernew usernew usernew usernew user",
    req.body
  );
  data = req.body;
  res.send();
});

app.get("/set1", (req, res) => {
  const d1 = {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2hpZXkiLCJqdGkiOiI4ZjJjOWEwNi02NDViLTQ4MmItOGM3OS03NzQwMTM5ZWQ3ZTkiLCJlbWFpbCI6Im1vaGhpZXlAZ21haWwuY29tIiwidWlkIjoiMjU4M2NlNGMtYWZhNy00NzY0LTk4MGItZjVhNGRkNTFiMTdhIiwicm9sZXMiOiJVc2VyIiwiZXhwIjoxNjI1NjU5NDIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQ0MzkyIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwIn0.gkVIIDbHCEzcGm0xyGuLkrk6tPRNgn8VLmKCsMxDPVI",
    usernameTo: "shawkat",
  };
  // data = req.body;
  data = d1;
  res.redirect("/");
});

app.get("/set2", (req, res) => {
  const d2 = {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaGF3a2F0IiwianRpIjoiOWY3YzJjMTktMGVkYS00NGU1LWIxMTctM2ZiZDg0ZjliNzgzIiwiZW1haWwiOiJzaGFkeUBnbWFpbC5jb20iLCJ1aWQiOiI3ZTk4MGZlYS0wMTExLTQzZDctOGVmMi1lY2M4YjBiYWZiMGIiLCJyb2xlcyI6IlVzZXIiLCJleHAiOjE2MjU3NzM5MjQsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDQzOTIiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAifQ.yKxYkhlJhUTf-hdFjJNAZNghIAbdp69ckHlXP4yeH14",
    usernameTo: "mohiey",
  };
  data = d2;
  res.redirect("/");
});

app.get("/token", (req, res) => {
  console.log("tesssssssssssssssssssssssssssssssssssssssssssssssst", data);
  res.send(data);
});
module.exports = server;
