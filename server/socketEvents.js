const userHandler = require("./handlers/userHandler");
const messageHandler = require("./handlers/messageHandler");
const callHandler = require("./handlers/callHandler");
const groupHandler = require("./handlers/groupHandler");
const chatHandler = require("./handlers/chatHandler");
const logger = require("./config/logger.config");

module.exports = function (io, pubClient, emitter) {
  io.on("connection", function (socket) {
    logger.info(
      `connection established from ${socket.handshake.address}:${socket.request.socket._peername.port}`
    );

    messageHandler(socket, emitter, pubClient);
    userHandler(socket, emitter, pubClient);
    chatHandler(socket, emitter);
    groupHandler(socket, emitter, pubClient);
    callHandler(socket, emitter, pubClient);
  });

  io.on("error", (err) => {
    logger.error(err);
  });
};
