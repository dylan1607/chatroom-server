const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true },
  messages: [
    {
      username: String,
      content: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

const Room = mongoose.model("room", roomSchema);
module.exports = Room;
