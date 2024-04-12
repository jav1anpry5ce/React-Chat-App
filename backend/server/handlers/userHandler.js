const userConnectHandler = require("./userConnectHandler");
const sql = require("../sql");
const shortid = require("shortid");
const getUsers = require("../getUsers");
const setUsers = require("../setUsers");

module.exports = function (socket, emitter, pubClient) {
  socket.on("userData", async (userData) => {
    try {
      if (!userData) return;
      const data = {
        id: socket.id,
        ...userData,
      };
      userConnectHandler(emitter, data, pubClient);
    } catch (err) {
      console.log(err);
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
      console.log(err);
    }
  });

  socket.on("typing", async (data) => {
    const users = await getUsers(pubClient);
    const user = users.filter((user) => user.username === data.username);
    user.forEach((user) => {
      emitter.to(user.id).emit("usertyping", {
        user: data.username,
        typing: data.typing,
      });
    });
  });

  socket.on("addingUser", async ({ userToAdd, user }) => {
    try {
      const conversation = await sql.getConversation({
        users: [userToAdd, user],
      });
      if (conversation) {
        emitter
          .to(socket.id)
          .emit("error", { message: "Conversation already exists" });
      } else if (userToAdd === user) {
        emitter.to(socket.id).emit("error", {
          message: "You can't add yourself to a conversation",
        });
      } else {
        const user = await sql.getUser(userToAdd);
        const conversation = {
          id: shortid.generate(),
          users: [userToAdd, user],
        };
        await sql.createConversation(conversation);
        const chat = {
          id: conversation.id,
          name: user.name,
          image: user.image,
          username: user.username,
          messages: [],
          chatType: "private",
          unread: 0,
        };
        emitter.to(socket.id).emit("userAdded", chat);
        const users = await getUsers(pubClient);
        const u = users.filter((user) => user.username === userToAdd);
        u.forEach((user) => {
          emitter.to(user.id).emit("userAdded", chat);
        });
      }
    } catch (err) {
      console.log(err);
      emitter.to(socket.id).emit("notFound");
    }
  });

  socket.on("disconnect", async () => {
    try {
      const users = await getUsers(pubClient);
      const index = users.findIndex((user) => user.id === socket.id);
      if (index !== -1) {
        users.splice(index, 1);
        setUsers(users, pubClient);
      }
    } catch (err) {
      console.log(err);
    }
  });
};
