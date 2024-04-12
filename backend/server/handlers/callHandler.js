const getUsers = require("../getUsers");

module.exports = function (socket, emitter, pubClient) {
  socket.on("callUser", async (data) => {
    try {
      const users = await getUsers(pubClient);
      const user = users.filter((user) => user.username === data.userToCall);
      user.forEach((user) => {
        emitter.to(user.id).emit("callUser", {
          signal: data.signalData,
          from: data.from,
          type: data.type,
          name: data.name,
          image: data.image,
        });
      });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("answerCall", async (data) => {
    try {
      const users = await getUsers(pubClient);
      const user = users.filter((user) => user.username === data.to);
      user.forEach((user) => {
        emitter.to(user.id).emit("callAccepted", data.signal);
      });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("endCall", async (username) => {
    try {
      const users = await getUsers(pubClient);
      const user = users.filter((user) => user.username === username);
      user.forEach((user) => {
        emitter.to(user.id).emit("endCall");
      });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("ignoreCall", async (username) => {
    try {
      const users = await getUsers(pubClient);
      const user = users.filter((user) => user.username === username);
      user.forEach((user) => {
        emitter.to(user.id).emit("ignoreCall");
      });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("busy", async (username) => {
    try {
      const users = await getUsers(pubClient);
      const user = users.filter((user) => user.username === username);
      user.forEach((user) => {
        emitter.to(user.id).emit("busy");
      });
    } catch (err) {
      console.error(err);
    }
  });
};
