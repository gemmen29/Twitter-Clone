const socket = io();
let token = "";
let usernameTo = "";
let currentChat = "";
let usernameFrom = "";
let otherIsTyping = false;
const $chatWith = document.getElementById("chatWith");

fetch("./token")
  .then((response) => response.json())
  .then((data) => {
    token = data.token;
    usernameTo = data.usernameTo;
    console.log(token);
    console.log(usernameTo);
    $chatWith.innerText = "Chatting with " + usernameTo.toLocaleUpperCase();

    socket.emit(
      "startChat",
      { token, usernameTo },
      (current_Chat, username_From) => {
        currentChat = current_Chat;
        usernameFrom = username_From;
        socket.emit("getMsgs", current_Chat);
        socket.emit("joined", currentChat, usernameFrom);
      }
    );
  });

//Elements
const $msgForm = document.getElementById("msgForm");
console.log($msgForm);
const $msgFormInput = document.getElementById("msgFormInput");
const $msgFormBtn = document.getElementById("msgFormBtn");
const $sendLocationBtn = document.getElementById("sendLocationBtn");
const $msgs = document.getElementById("msgs");
// const $sideBar = document.getElementById("sideBar");

//Templates
const sentMsg = document.getElementById("sentMsg").innerHTML;
const revievedMsg = document.getElementById("revievedMsg").innerHTML;
const typing = document.getElementById("typing").innerHTML;
// const locationTemplate = document.getElementById("locationTemplate").innerHTML;
// const sideBarTemplate = document.getElementById("sideBarTemplate").innerHTML;
//Options
const { username, user } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

$msgFormInput.addEventListener("keydown", () => {
  if (!otherIsTyping) {
    otherIsTyping = true;
    socket.emit("typing", usernameFrom, currentChat);
  }
});

$msgFormInput.addEventListener("blur", () => {
  otherIsTyping = false;
  socket.emit("doneTyping", currentChat);
});

$msgForm.addEventListener("submit", (e) => {
  console.log("d");
  e.preventDefault();
  $msgFormBtn.setAttribute("disabled", "disabled");
  $msgFormInput.blur();
  otherIsTyping = false;

  const msg = $msgFormInput.value;
  socket.emit("sendMessage", currentChat, usernameFrom, msg, (err) => {
    $msgFormBtn.removeAttribute("disabled");
    $msgFormInput.value = "";
    $msgFormInput.focus();

    if (err) return console.log(err);
    console.log("Deliverd!");
  });
});

const autoScroll = () => {
  const $newMsg = $msgs.lastElementChild;

  const newMsgStyles = getComputedStyle($newMsg);
  const newMsgMargin = parseInt(newMsgStyles.marginBottom);
  const newMsgHeight = $newMsg.offsetHeight + newMsgMargin;

  const visibleHeight = $msgs.offsetHeight;

  const containerHeight = $msgs.scrollHeight;

  //How far have I scrolled?
  const scrollOffset = $msgs.scrollTop + visibleHeight;

  if (containerHeight - newMsgHeight <= scrollOffset) {
    $msgs.scrollTop = containerHeight;
  }
  console.log("scroll");
};

socket.on("showTyping", (username) => {
  const html = Mustache.render(typing, {
    username,
  });
  $msgs.insertAdjacentHTML("beforeend", html);
});

socket.on("removeTyping", (username) => {
  document.getElementById("helperToRemove").remove();
});

socket.on("populate", (msgs) => {
  msgs.map((msg) => {
    if (msg.username === usernameFrom) {
      const html = Mustache.render(sentMsg, {
        username: msg.username,
        msg: msg.text,
        createdAt: moment(msg.createdAt).format("h:mm a"),
      });
      $msgs.insertAdjacentHTML("beforeend", html);
    } else {
      const html = Mustache.render(revievedMsg, {
        username: msg.username,
        msg: msg.text,
        createdAt: moment(msg.createdAt).format("h:mm a"),
      });
      $msgs.insertAdjacentHTML("beforeend", html);
    }
  });
});

socket.on("message", (msg) => {
  console.log(msg);
  if (msg.username === usernameFrom) {
    const html = Mustache.render(sentMsg, {
      username: msg.username,
      msg: msg.text,
      createdAt: moment(msg.createdAt).format("h:mm a"),
    });
    $msgs.insertAdjacentHTML("beforeend", html);
  } else {
    const html = Mustache.render(revievedMsg, {
      username: msg.username,
      msg: msg.text,
      createdAt: moment(msg.createdAt).format("h:mm a"),
    });
    $msgs.insertAdjacentHTML("beforeend", html);
  }

  autoScroll();
});
