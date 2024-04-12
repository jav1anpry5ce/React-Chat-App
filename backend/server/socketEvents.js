const userHandler = require("./handlers/userHandler");
const messageHandler = require("./handlers/messageHandler");
const callHandler = require("./handlers/callHandler");
const groupHandler = require("./handlers/groupHandler");
const chatHandler = require("./handlers/chatHandler");

module.exports = function (io, pubClient, emitter) {
  io.on("connection", function (socket) {
    console.log(
      `connection established from ${socket.request.socket._peername.address}:${socket.request.socket._peername.port}`
    );

    messageHandler(socket, emitter, pubClient);
    userHandler(socket, emitter, pubClient);
    chatHandler(socket, emitter);
    groupHandler(socket, emitter, pubClient);
    callHandler(socket, emitter, pubClient);
  });

  io.on("error", (err) => {
    console.error(err);
  });
};
