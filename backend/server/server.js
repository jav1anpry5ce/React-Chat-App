const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const cors = require("cors");
const shortid = require("shortid");
const sql = require("./sql");
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/files")));
app.use("/api", router);
app.use("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/files"));
});

// const server = createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
//   },
//   app
// );

const server = createServer(app);

const io = new Server(server, {
  maxHttpBufferSize: 1e50,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let usersList = [];

io.on("connection", (socket) => {
  console.log(
    `connection established from ${socket.request.socket._peername.address}:${socket.request.socket._peername.port}`
  );
  const id = socket.id;
  socket.on("userData", (data) => {
    if (!data) return;
    sql.get_or_create_user(data).then((user) => {
      const joinedUser = {
        id: id,
        name: user.name,
        image: user.image,
        username: user.username,
      };
      const u = usersList.find((u) => u.username === user.username);
      if (u) {
        u.id = id;
        u.name = user.name;
        u.image = user.image;
      } else {
        usersList.push(joinedUser);
      }
    });
  });

  socket.on("online", (username) => {
    const user = usersList.find((user) => user.username === username);
    if (user) {
      socket.emit("online", { username, online: true });
    } else {
      socket.emit("online", { username, online: false });
    }
  });

  socket.on("addingUser", async ({ userToAdd, user }) => {
    const conversation = await sql.getConversation({
      users: [userToAdd, user],
    });
    if (conversation)
      return socket.emit("error", { message: "Conversation already exists" });
    if (userToAdd === user)
      return socket.emit("error", {
        message: "You can't talk to yourself silly!",
      });
    sql
      .getUser(userToAdd)
      .then((data) => {
        const conversation = {
          id: shortid.generate(),
          users: [userToAdd, user],
        };
        sql.createConversation(conversation).then(() => {
          const chat = {
            id: conversation.id,
            name: data.name,
            image: data.image,
            username: data.username,
            messages: [],
            chatType: "private",
            unread: 0,
          };
          io.to(id).emit("userAdded", chat);
          const user = usersList.find((user) => user.username === userToAdd);
          if (user) io.to(user.id).emit("userAdded", chat);
        });
      })
      .catch(() => {
        socket.emit("notFound");
      });
  });

  socket.on("updateMe", ({ username, name, image }) => {
    sql.updateUser(username, name, image).then(() => {
      socket.emit("updated", { name, image });
    });
  });

  socket.on("typing", (data) => {
    const user = usersList.find((user) => user.username === data.username);
    if (user)
      io.to(user.id).emit("usertyping", {
        user: data.username,
        typing: data.typing,
      });
  });

  socket.on("chat", async (data) => {
    try {
      if (data.message.file) {
        base64Data = data.message.file.split(";base64,").pop();
        const date = Date.now();
        fs.writeFile(
          `files/${date}-${data.message.name}`,
          base64Data,
          { encoding: "base64" },
          async (err) => {
            if (err) console.log(err);
            let message = {
              ...data.message,
              file: `http://localhost:5000/${date}-${data.message.name}`,
            };
            const newMessage = {
              id: data.id,
              conversationId: data.conversationId,
              sender: await sql.getUser(data.sender),
              receiver: await sql.getUser(data.receiver),
              message: message,
              time: data.time,
            };
            sql.createMessage(newMessage).then(() => {
              sql
                .getConversationById(data.conversationId)
                .then((conversation) => {
                  const users = JSON.parse(conversation.users);
                  users.map((user) => {
                    const id = usersList.find((u) => u.username === user);
                    if (id) io.to(id.id).emit("newMessage", newMessage);
                  });
                });
            });
          }
        );
      } else if (data.message.type === "audio") {
        const date = Date.now();
        base64Data = data.message.data.split(";base64,").pop();
        fs.writeFile(
          `files/${date}.wav`,
          base64Data,
          { encoding: "base64" },
          async (err) => {
            if (err) console.log(err);
            let message = {
              ...data.message,
              data: `http://localhost:5000/${date}.wav`,
            };
            const newMessage = {
              id: data.id,
              conversationId: data.conversationId,
              sender: await sql.getUser(data.sender),
              receiver: await sql.getUser(data.receiver),
              message: message,
              time: data.time,
            };
            sql.createMessage(newMessage).then(() => {
              sql
                .getConversationById(data.conversationId)
                .then((conversation) => {
                  const users = JSON.parse(conversation.users);
                  users.map((user) => {
                    const id = usersList.find((u) => u.username === user);
                    if (id) io.to(id.id).emit("newMessage", newMessage);
                  });
                });
            });
          }
        );
      } else {
        const newMessage = {
          id: data.id,
          conversationId: data.conversationId,
          sender: await sql.getUser(data.sender),
          receiver: await sql.getUser(data.receiver),
          message: data.message,
          time: data.time,
        };
        sql.createMessage(newMessage).then(() => {
          sql.getConversationById(data.conversationId).then((conversation) => {
            const users = JSON.parse(conversation.users);
            users.map((user) => {
              const id = usersList.find((u) => u.username === user);
              if (id) io.to(id.id).emit("newMessage", newMessage);
            });
          });
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("callUser", (data) => {
    const user = usersList.find((user) => user.username === data.userToCall);
    if (user) {
      io.to(user.id).emit("callUser", {
        signal: data.signalData,
        type: data.type,
        from: data.from,
        name: data.name,
        image: data.image,
      });
    }
  });

  socket.on("answerCall", (data) => {
    const user = usersList.find((user) => user.username === data.to);
    io.to(user.id).emit("callAccepted", data.signal);
  });

  socket.on("endCall", (username) => {
    const user = usersList.find((us) => us.username === username);
    if (user) io.to(user.id).emit("endCall");
  });

  socket.on("ignoreCall", (username) => {
    const user = usersList.find((user) => user.username === username);
    if (user) io.to(user.id).emit("ignoreCall");
  });

  socket.on("busy", (username) => {
    const user = usersList.find((user) => user.username === username);
    if (user) io.to(user.id).emit("busy");
  });

  socket.on("deleteMessage", ({ messageID, conversationID, username }) => {
    sql
      .deleteMessage(messageID)
      .then((message) => {
        io.emit("messageDeleted", { messageID, conversationID, message });
      })
      .catch((err) => {
        const user = usersList.find((user) => user.username === username);
        if (user) io.to(user.id).emit("error", { message: err });
      });
  });

  socket.on("sendGroupMessage", async (data) => {
    try {
      if (data.message?.file) {
        base64Data = data.message.file.split(";base64,").pop();
        const date = Date.now();
        fs.writeFile(
          `files/${date}-${data.message.name}`,
          base64Data,
          { encoding: "base64" },
          async (err) => {
            if (err) console.log(err);
            let message = {
              ...data.message,
              file: `http://localhost:5000/${date}-${data.message.name}`,
            };
            const newMessage = {
              id: data.id,
              conversationId: data.conversationId,
              sender: await sql.getUser(data.sender),
              receiver: { username: data.conversationId },
              message: message,
              time: data.time,
            };
            sql.createMessage(newMessage).then(() => {
              sql.getGroupMembers(data.conversationId).then((members) => {
                members.map((member) => {
                  const user = usersList.find(
                    (u) => u.username === member.username
                  );
                  if (user) io.to(user.id).emit("newMessage", newMessage);
                });
              });
            });
          }
        );
      } else if (data.message.type === "audio") {
        const date = Date.now();
        base64Data = data.message.data.split(";base64,").pop();
        fs.writeFile(
          `files/${date}.wav`,
          base64Data,
          { encoding: "base64" },
          async (err) => {
            if (err) console.log(err);
            let message = {
              ...data.message,
              data: `http://localhost:5000/${date}.wav`,
            };
            const newMessage = {
              id: data.id,
              conversationId: data.conversationId,
              sender: await sql.getUser(data.sender),
              receiver: { username: data.conversationId },
              message: message,
              time: data.time,
            };
            sql.createMessage(newMessage).then(() => {
              sql.getGroupMembers(data.conversationId).then((members) => {
                members.map((member) => {
                  const user = usersList.find(
                    (u) => u.username === member.username
                  );
                  if (user) io.to(user.id).emit("newMessage", newMessage);
                });
              });
            });
          }
        );
      } else {
        const newMessage = {
          id: data.id,
          conversationId: data.conversationId,
          sender: await sql.getUser(data.sender),
          receiver: { username: data.conversationId },
          message: data.message,
          time: data.time,
        };
        sql.createMessage(newMessage).then(() => {
          sql.getGroupMembers(data.conversationId).then((members) => {
            members.map((member) => {
              const user = usersList.find(
                (u) => u.username === member.username
              );
              if (user) io.to(user.id).emit("newMessage", newMessage);
            });
          });
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("createGroup", (data) => {
    const newGroup = {
      id: shortid.generate(),
      name: data.groupName,
      image: data.groupImage,
      members: data.members,
      messages: [],
      chatType: "group",
    };
    sql.createGroupChat(newGroup).then(() => {
      data.members.forEach((member) => {
        const user = usersList.find((u) => u.username === member.username);
        if (user) io.to(user.id).emit("newGroup", newGroup);
      });
    });
  });

  socket.on("getChats", async (username) => {
    const groupChats = await sql.getGroupChat(username);
    const privateChats = await sql.getChats(username);
    privateChats.forEach((chat) => {
      chat.chatType = "private";
    });
    groupChats.forEach((chat) => {
      chat.chatType = "group";
    });
    const chats = [...groupChats, ...privateChats];
    io.to(id).emit("chats", chats);
  });

  socket.on("getChatInfo", ({ chatId, username }) => {
    sql.getChat(chatId, username).then((chat) => {
      io.to(id).emit("chatInfo", chat);
    });
  });

  socket.on("addGroupMember", ({ groupId, username }) => {
    sql
      .addMemberToGroup({ groupId, username })
      .then(() => {
        sql
          .getGroupChatById(groupId)
          .then((group) => {
            group.members.forEach((member) => {
              const user = usersList.find(
                (u) => u.username === member.username
              );
              if (user) io.to(user.id).emit("groupMemberAdded", group);
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });

  socket.on("disconnect", () => {
    usersList = usersList.filter((user) => user.id !== id);
    io.emit("users", usersList);
  });
});

try {
  server.listen(process.env.PORT || 5000, process.env.IP, () =>
    console.log(
      `Server has started on ${process.env.IP} using port ${process.env.PORT}`
    )
  );
} catch (err) {
  console.log(err);
}


