require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path');
const socket = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/database");
const {
  userCheck,
  getUser,
  userLeave,
  userJoin,
} = require("./utils/userUtils");
const { createRoom, updateRoom } = require("./utils/databaseUtils");

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.use(cors());

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  try {
    connectDB();
    console.log(`Server is running on the port: ${PORT} `);
  } catch (error) {
    console.log(error);
  }
});

// Initializing the socket io
const io = socket(server);

// Listen User join room
io.on("connection", (socket) => {
  socket.on("joinRoom", async ({ username, roomId }) => {
    //check username existing inside room
    const checkUser = userCheck(username, roomId);

    if (!checkUser) {
      const user = userJoin(socket.id, username, roomId);
      socket.join(user.roomId);
      socket.emit("joined", { roomId: user.roomId, username: user.username });

      //fetch data from database by roomId
      const data = { roomId: user.roomId };
      socket.emit("oldmessage", await createRoom(data));

      // Display a message to another user in roomId. Future
      // socket.broadcast.to(user.roomId).emit("message", {
      //   userId: user.id,
      //   username: user.username,
      //   notify: `${user.username} has joined the chat`,
      // });
    } else {
      socket.emit("joined", "Username is currently inside a room");
    }
  });

  //Listen User send message
  socket.on("chat", (text) => {
    const user = getUser(socket.id);
    io.to(user.roomId).emit("message", {
      messages: {
        userId: user?.id,
        username: user?.username,
        content: text,
      },
    });
    // insert message to database
    const data = {
      roomId: user?.roomId,
      messages: {
        userId: user?.id,
        username: user?.username,
        content: text,
      },
    };
    updateRoom(data);
  });

  // Listen when user reload tab or exit the room
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
  });
});
