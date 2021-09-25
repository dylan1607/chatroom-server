const Room = require("../models/Room");

// Create Room
// const createRoom = async (req, res) => {
//   const newRoom = new Room(req.body);
//   try {
//     // Check room exist
//     const checkRoom = await Room.findOne({ roomId: req.body.roomId });
//     // If not, create new one. Then, return respone room object
//     if (checkRoom === null) {
//       const room = await newRoom.save();
//       res.status(201).json(room);
//     } else res.status(201).json(checkRoom);
//   } catch (error) {
//     console.log(error);
//   }
// };

const createRoom = async (req) => {
  const newRoom = new Room(req);
  try {
    // Check room exist
    const checkRoom = await Room.findOne(req);
    // If not, create new one. Then, return respone room object
    if (checkRoom === null) {
      const room = await newRoom.save();
      return room;
    } else return checkRoom;
  } catch (error) {
    console.log(error);
  }
};

// Delete Room
const deleteRoom = async (req, res) => {
  try {
    await Room.findOneAndDelete({ roomId: req.body.roomId });
    res.status(200).json("User has been deleted");
  } catch (error) {}
};

// Update room by insert new message
const updateRoom = async (req) => {
  const { roomId, messages } = req;
  try {
    const rooms = await Room.findOneAndUpdate(
      { roomId: roomId },
      { $push: { messages: messages } },
      { new: true }
    );
    return rooms;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createRoom,
  deleteRoom,
  updateRoom,
};
