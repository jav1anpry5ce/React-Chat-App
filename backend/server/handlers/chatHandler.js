const sql = require("../sql");
const logger = require("../config/logger.config");

module.exports = function (socket, emitter) {
  socket.on("getChats", async (username) => {
    try {
      const groupChats = await sql.getGroupChat(username);
      const privateChats = await sql.getChats(username);
      const chats = [...groupChats, ...privateChats];
      emitter.to(socket.id).emit("chats", chats);
    } catch (err) {
      logger.error(err);
      emitter.to(socket.id).emit("error", {
        message: "Something went wrong. Try again later.",
      });
    }
  });

  socket.on("getChatInfo", ({ chatId, username }) => {
    try {
      sql.getChat(chatId, username).then((chat) => {
        emitter.to(socket.id).emit("chatInfo", chat);
      });
    } catch (err) {
      logger.error(err);
      emitter.to(socket.id).emit("error", {
        message: "Something went wrong. Try again later.",
      });
    }
  });
};
