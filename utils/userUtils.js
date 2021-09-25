const users = [];

// Check user in room
const userCheck = (username, roomId) => {
  return users.some(
    (item) => item.username === username && item.roomId === roomId
  );
};

// User join room name
const userJoin = (id, username, roomId) => {
  const user = { id, username, roomId };
  users.push(user);
  return user;
};
console.log(`Available: ${users}`);

// Get user detail from socketId
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

// called when the user leaves the chat and its user object deleted from array
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

module.exports = {
  userCheck,
  userJoin,
  getUser,
  userLeave,
};
