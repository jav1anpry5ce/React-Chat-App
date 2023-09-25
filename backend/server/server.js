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
const fileUpload = require("express-fileupload");
const { instrument } = require("@socket.io/admin-ui");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const { Emitter } = require("@socket.io/redis-emitter");
const IP = process.env.IP;

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
app.use(fileUpload());
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

const pubClient = createClient({ url: "redis://10.27.18.245:6379" });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(async () => {
  io.adapter(createAdapter(pubClient, subClient));
  const emitter = new Emitter(pubClient);

  const usersList = async () => {
    const users = await pubClient.get("userlist");
    return JSON.parse(users);
  };

  io.on("connection", (socket) => {
    console.log(
      `connection established from ${socket.request.socket._peername.address}:${socket.request.socket._peername.port}`
    );
    const id = socket.id;
    socket.on("userData", (data) => {
      if (!data) return;
      sql
        .verifyToken(data.token)
        .then((user) => {
          if (!user)
            return emitter.to(id).emit("error", { message: "Invalid token" });
          sql
            .getUser(data.username)
            .then(async (user) => {
              const joinedUser = {
                id: id,
                name: user.name,
                image: user.image,
                username: user.username,
                lastPing: Date.now(),
              };
              const userList = await usersList();
              const u = userList.find((u) => u.id === id);
              if (!u) {
                const users = await usersList();
                users.push(joinedUser);
                pubClient.set("userlist", JSON.stringify(users));
              }
              emitter.to(id).emit("userData", joinedUser);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          emitter.to(id).emit("tokenNotValid");
        });
    });

    socket.on("online", async (username) => {
      const userList = await usersList();
      const user = userList.find((user) => user.username === username);
      if (user) {
        emitter.to(id).emit("online", { username, online: true });
      } else {
        emitter.to(id).emit("online", { username, online: false });
      }
    });

    socket.on("addingUser", async ({ userToAdd, user }) => {
      const conversation = await sql.getConversation({
        users: [userToAdd, user],
      });
      if (conversation)
        return io
          .to(id)
          .emit("error", { message: "Conversation already exists" });
      if (userToAdd === user)
        return emitter.to(id).emit("error", {
          message: "You can't talk to yourself silly!",
        });
      sql
        .getUser(userToAdd)
        .then((data) => {
          const conversation = {
            id: shortid.generate(),
            users: [userToAdd, user],
          };
          sql.createConversation(conversation).then(async () => {
            const chat = {
              id: conversation.id,
              name: data.name,
              image: data.image,
              username: data.username,
              messages: [],
              chatType: "private",
              unread: 0,
            };
            emitter.to(id).emit("userAdded", chat);
            const userList = await usersList();
            const users = userList.filter(
              (user) => user.username === userToAdd
            );
            users.forEach((user) => {
              emitter.to(user.id).emit("userAdded", chat);
            });
          });
        })
        .catch(() => {
          emitter.to(id).emit("notFound");
        });
    });

    socket.on("typing", async (data) => {
      const userList = await usersList();
      const users = userList.filter((user) => user.username === data.username);
      users.forEach((user) => {
        emitter.to(user.id).emit("usertyping", {
          user: data.username,
          typing: data.typing,
        });
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
                file: `http://${IP}/${date}-${data.message.name}`,
              };
              const newMessage = {
                id: data.id,
                conversationId: data.conversationId,
                sender: await sql.getUser(data.sender),
                receiver: await sql.getUser(data.receiver),
                message: message,
                time: data.time,
              };
              sql
                .createMessage(newMessage)
                .then(() => {
                  sql
                    .getConversationById(data.conversationId)
                    .then(async (conversation) => {
                      const users = JSON.parse(conversation.users);
                      const userList = await usersList();
                      users.map((user) => {
                        const ids = userList.filter((u) => u.username === user);
                        ids.map((id) => {
                          emitter.to(id.id).emit("newMessage", newMessage);
                        });
                      });
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                })
                .catch((err) => {
                  console.error(err);
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
                data: `http://${IP}/${date}.wav`,
              };
              const newMessage = {
                id: data.id,
                conversationId: data.conversationId,
                sender: await sql.getUser(data.sender),
                receiver: await sql.getUser(data.receiver),
                message: message,
                time: data.time,
              };
              sql
                .createMessage(newMessage)
                .then(() => {
                  sql
                    .getConversationById(data.conversationId)
                    .then((conversation) => {
                      const users = JSON.parse(conversation.users);
                      users.map(async (user) => {
                        const userList = await usersList();
                        const ids = userList.filter((u) => u.username === user);
                        ids.forEach((id) => {
                          emitter.to(id.id).emit("newMessage", newMessage);
                        });
                      });
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                })
                .catch((err) => {
                  console.error(err);
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
          sql
            .createMessage(newMessage)
            .then(() => {
              sql
                .getConversationById(data.conversationId)
                .then((conversation) => {
                  const users = JSON.parse(conversation.users);
                  users.map(async (user) => {
                    const userList = await usersList();
                    const ids = userList.filter((u) => u.username === user);
                    ids.forEach((id) => {
                      emitter.to(id.id).emit("newMessage", newMessage);
                    });
                  });
                })
                .catch((err) => {
                  console.error(err);
                });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("callUser", async (data) => {
      const userList = await usersList();
      const users = userList.filter(
        (user) => user.username === data.userToCall
      );
      users.forEach((user) => {
        emitter.to(user.id).emit("callUser", {
          signal: data.signalData,
          from: data.from,
          type: data.type,
          name: data.name,
          image: data.image,
        });
      });
    });

    socket.on("answerCall", async (data) => {
      const userList = await usersList();
      const users = userList.filter((user) => user.username === data.to);
      users.forEach((user) => {
        emitter.to(user.id).emit("callAccepted", data.signal);
      });
    });

    socket.on("endCall", async (username) => {
      const userList = await usersList();
      const users = userList.filter((us) => us.username === username);
      users.forEach((user) => {
        emitter.to(user.id).emit("endCall");
      });
    });

    socket.on("ignoreCall", async (username) => {
      const userList = await usersList();
      const users = userList.filter((user) => user.username === username);
      users.forEach((user) => {
        emitter.to(user.id).emit("ignoreCall");
      });
    });

    socket.on("busy", async (username) => {
      const userList = await usersList();
      const users = userList.filter((user) => user.username === username);
      users.forEach((user) => {
        emitter.to(user.id).emit("busy");
      });
    });

    socket.on("deleteMessage", ({ messageID, conversationID, username }) => {
      sql
        .deleteMessage(messageID)
        .then((message) => {
          io.emit("messageDeleted", { messageID, conversationID, message });
        })
        .catch(async (err) => {
          console.error(err);
          const userList = await usersList();
          const users = userList.filter((user) => user.username === username);
          users.forEach((user) => {
            emitter.to(user.id).emit("error", { message: err });
          });
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
                file: `http://${IP}/${date}-${data.message.name}`,
              };
              const newMessage = {
                id: data.id,
                conversationId: data.conversationId,
                sender: await sql.getUser(data.sender),
                receiver: { username: data.conversationId },
                message: message,
                time: data.time,
              };
              sql
                .createMessage(newMessage)
                .then(() => {
                  sql
                    .getGroupMembers(data.conversationId)
                    .then((members) => {
                      members.map(async (member) => {
                        const userList = await usersList();
                        const users = userList.filter(
                          (u) => u.username === member.username
                        );
                        users.forEach((user) => {
                          if (user)
                            emitter.to(user.id).emit("newMessage", newMessage);
                        });
                      });
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                })
                .catch((err) => {
                  console.error(err);
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
                data: `http://${IP}/${date}.wav`,
              };
              const newMessage = {
                id: data.id,
                conversationId: data.conversationId,
                sender: await sql.getUser(data.sender),
                receiver: { username: data.conversationId },
                message: message,
                time: data.time,
              };
              sql
                .createMessage(newMessage)
                .then(() => {
                  sql
                    .getGroupMembers(data.conversationId)
                    .then((members) => {
                      members.map(async (member) => {
                        const userList = await usersList();
                        const users = userList.filter(
                          (u) => u.username === member.username
                        );
                        users.forEach((user) => {
                          emitter.to(user.id).emit("newMessage", newMessage);
                        });
                      });
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                })
                .catch((err) => {
                  console.error(err);
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
          sql
            .createMessage(newMessage)
            .then(() => {
              sql
                .getGroupMembers(data.conversationId)
                .then((members) => {
                  members.map(async (member) => {
                    const userList = await usersList();
                    const users = userList.filter(
                      (u) => u.username === member.username
                    );
                    users.forEach((user) => {
                      emitter.to(user.id).emit("newMessage", newMessage);
                    });
                  });
                })
                .catch((err) => {
                  console.error(err);
                });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      } catch (err) {
        console.error(err);
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
      sql
        .createGroupChat(newGroup)
        .then(() => {
          data.members.forEach(async (member) => {
            const userList = await usersList();
            const users = userList.filter(
              (u) => u.username === member.username
            );
            users.forEach((user) => {
              emitter.to(user.id).emit("newGroup", newGroup);
            });
          });
        })
        .catch((err) => {
          emitter.to(id).emit("error", {
            message: "Something went wrong. Try again later.",
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
      emitter.to(id).emit("chats", chats);
    });

    socket.on("getChatInfo", ({ chatId, username }) => {
      sql.getChat(chatId, username).then((chat) => {
        emitter.to(id).emit("chatInfo", chat);
      });
    });

    socket.on("changeGroup", (data) => {
      sql
        .updateGroupChat(data)
        .then((group) => {
          group.members.forEach(async (member) => {
            const userList = await usersList();
            const users = userList.filter(
              (u) => u.username === member.username
            );
            users.forEach((user) => {
              emitter.to(user.id).emit("groupUpdated", group);
            });
          });
        })
        .catch((err) => {
          console.error(err);
        });
    });

    socket.on("addGroupMember", ({ groupId, username }) => {
      sql
        .addMemberToGroup({ groupId, username })
        .then(() => {
          sql
            .getGroupChatById(groupId)
            .then((group) => {
              group.members.forEach(async (member) => {
                const userList = await usersList();
                const users = userList.filter(
                  (u) => u.username === member.username
                );
                users.forEach((user) => {
                  emitter.to(user.id).emit("groupMemberAdded", group);
                });
              });
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    });

    socket.on("disconnect", async () => {
      try {

        const userList = await usersList();
        const list = userList.filter((user) => user.id !== id);
        await pubClient.set("userlist", JSON.stringify(list));
      } catch (error) {
        console.error(error)
      }
    });
  });

  instrument(io, {
    auth: {
      type: "basic",
      username: "admin",
      password: "$2y$10$qMMN8mNpyxQvi6utVAnCYOZnqBiSqcmDQ1vFPMhcgBZLtt1Rp9Qny", // "changeit" encrypted with bcrypt
    },
  });

  server.listen(process.env.PORT || 5000, "0.0.0.0", () =>
    console.log(
      `Server has started on ${process.env.IP} using port ${process.env.PORT}`
    )
  );
});