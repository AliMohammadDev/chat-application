import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

let users = {};

// join
io.on("connection", (socket) => {
  socket.on("join", (username) => {
    users[socket.id] = username;
    socket.broadcast.emit("message", {
      user: "system",
      text: `${username}انضم الى الشات`,
    });
  });
  // send message
  socket.on("chatMessage", (msg) => {
    const user = users[socket.id];
    io.emit("message", { user: user, text: msg });
  });
  // discount
  socket.on("disconnect", () => {
    const user = users[socket.id] || "مجهول";

    if (user) {
      socket.broadcast.emit("message", {
        user: "system",
        text: `${user}خرج من الشات`,
      });
      delete users[socket.id];
    }
  });
});

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
