const userConnectHandler = require("./userConnectHandler");
const { getUser } = require("../sql/userSql");
const {
  getConversation,
  createConversation
} = require("../sql/conversationSql");
const shortid = require("shortid");
const getUsers = require("../getUsers");
const setUsers = require("../setUsers");
const logger = require("../config/logger.config");

module.exports = function (socket, emitter, pubClient) {
  socket.on("userData", async (userData) => {
    try {
      if (!userData) return;
      const data = {
        id: socket.id,
        ...userData
      };
      userConnectHandler(emitter, data, pubClient);
    } catch (err) {
      logger.error(err.message);
    }
  });

  socket.on("online", async (username) => {
    try {
      const users = await getUsers(pubClient);
      const user = users.find((user) => user.username === username);
      if (user) {
        emitter.to(socket.id).emit("online", { username, online: true });
      } else {
        emitter.to(socket.id).emit("online", { username, online: false });
      }
    } catch (err) {
      logger.error(err.message);
    }
  });

  socket.on("typing", async (data) => {
    const users = await getUsers(pubClient);
    const user = users.filter((user) => user.username === data.username);
    user.forEach((user) => {
      emitter.to(user.id).emit("usertyping", {
        user: data.username,
        typing: data.typing
      });
    });
  });

  socket.on("addingUser", async ({ userToAdd, user: username }) => {
    try {
      const conversation = await getConversation({
        users: [userToAdd, username]
      });
      if (conversation) {
        emitter
          .to(socket.id)
          .emit("error", { message: "Conversation already exists" });
      } else if (userToAdd === username) {
        emitter.to(socket.id).emit("error", {
          message: "You can't add yourself to a conversation"
        });
      } else {
        const user = await getUser(userToAdd);
        const conversation = {
          id: shortid.generate(),
          users: [userToAdd, username]
        };
        await createConversation(conversation);
        const chat = {
          id: conversation.id,
          name: user.name,
          image: user.image,
          username: user.username,
          messages: [],
          chatType: "private",
          unread: 0
        };
        emitter.to(socket.id).emit("userAdded", chat);
        const users = await getUsers(pubClient);
        const u = users.filter((user) => user.username === userToAdd);
        u.forEach((user) => {
          emitter.to(user.id).emit("userAdded", chat);
        });
      }
    } catch (err) {
      logger.error(err.message);
      emitter.to(socket.id).emit("notFound");
    }
  });

  socket.on("disconnect", async () => {
    try {
      logger.info("User disconnected");
      const users = await getUsers(pubClient);
      const list = users.filter((user) => user.id !== socket.id);
      await setUsers(list, pubClient);
    } catch (err) {
      logger.error(err.message);
    }
  });
};
