const logger = require("../config/logger.config");
const { getChat, getChats } = require("../sql/chatSql");
const { getGroupChat } = require("../sql/groupSql");

module.exports = function (socket, emitter) {
  socket.on("getChats", async (username) => {
    try {
      const groupChats = await getGroupChat(username);
      const privateChats = await getChats(username);
      const chats = [...groupChats, ...privateChats];
      emitter.to(socket.id).emit("chats", chats);
    } catch (err) {
      logger.error(err.message);
      emitter.to(socket.id).emit("error", {
        message: "Something went wrong. Try again later."
      });
    }
  });

  socket.on("getChatInfo", ({ chatId, username }) => {
    try {
      getChat(chatId, username).then((chat) => {
        emitter.to(socket.id).emit("chatInfo", chat);
      });
    } catch (err) {
      logger.error(err.message);
      emitter.to(socket.id).emit("error", {
        message: "Something went wrong. Try again later."
      });
    }
  });
};
