const socket = io();
let users = [];
// const token = sessionStorage.getItem("auth-token");
const token =
  '"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2hpZXkiLCJqdGkiOiI4ZjJjOWEwNi02NDViLTQ4MmItOGM3OS03NzQwMTM5ZWQ3ZTkiLCJlbWFpbCI6Im1vaGhpZXlAZ21haWwuY29tIiwidWlkIjoiMjU4M2NlNGMtYWZhNy00NzY0LTk4MGItZjVhNGRkNTFiMTdhIiwicm9sZXMiOiJVc2VyIiwiZXhwIjoxNjI1NjU5NDIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQ0MzkyIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwIn0.gkVIIDbHCEzcGm0xyGuLkrk6tPRNgn8VLmKCsMxDPVI"';
console.log("token", token);
let y = "";
fetch("./token")
  .then((response) => response.json())
  .then((t) => {
    y = t;
    console.log(y);
  });
const $onlineUsersDropdown = document.getElementById("onlineUsers");
const $startChatForm = document.getElementById("startChatForm");

socket.emit("getOnlineUsers", (onlineUsers) => {
  users = onlineUsers;
  users.map((user) =>
    $onlineUsersDropdown.insertAdjacentHTML(
      "beforeend",
      `<option value="${user.username}">${user.username}</option>`
    )
  );
});

$startChatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit(
    "startChat",
    { token, usernameTo: $onlineUsersDropdown.value },
    (currentChat, usernameFrom) => {
      sessionStorage.setItem("currentChat", currentChat);
      sessionStorage.setItem("usernameFrom", usernameFrom);
      location.href = "/chat.html";
    }
  );
});
