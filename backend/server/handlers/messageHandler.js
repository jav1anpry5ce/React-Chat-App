const fileHandler = require("./fileHandler");
const audioHandler = require("./audioHandler");
const textHandler = require("./textHandler");
const sql = require("../sql");
const getUsers = require("../getUsers");
const logger = require("../config/logger.config");

module.exports = function (socket, emitter, pubClient) {
  const id = socket.id;

  socket.on("chat", async (data) => {
    const message = {
      id,
      ...data,
    };

    try {
      if (data.message.file) {
        fileHandler(message, emitter, pubClient);
      } else if (data.message.type === "audio") {
        audioHandler(message, emitter, pubClient);
      } else {
        textHandler(message, emitter, pubClient);
      }
    } catch (err) {
      logger.error(err);
    }
  });

  socket.on(
    "deleteMessage",
    async ({ messageID, conversationID, username }) => {
      const users = await getUsers(pubClient);
      try {
        const message = await sql.deleteMessage(messageID);
        users.forEach((user) => {
          emitter.to(user.id).emit("messageDeleted", {
            messageID,
            conversationID,
            message,
          });
        });
      } catch (err) {
        logger.error(err);
        const user = users.filter((user) => user.username === username);
        user.forEach((user) => {
          emitter.to(user.id).emit("error", { message: err });
        });
      }
    }
  );
};
