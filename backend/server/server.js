const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
require("cors");
const shortid = require("shortid");
const sql = require("./sql");
const express = require("express");

const app = express();

app.use(express.static(path.join(__dirname, "/files")));
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
  console.log(`connection established with id ${socket.id}`);
  const id = socket.id;
  socket.on("userData", (data) => {
    sql.get_or_create_user(data).then((user) => {
      const joinedUser = {
        id: id,
        name: user.name,
        image: user.image,
        userName: user.userName,
      };
      const us = usersList.find((u) => u.userName === user.userName);
      if (us) {
        us.id = id;
        us.name = user.name;
        us.image = user.image;
      } else {
        usersList.push(joinedUser);
      }
    });
  });

  socket.on("online", (userName) => {
    const user = usersList.find((user) => user.userName === userName);
    if (user) {
      socket.emit("online", { userName, online: true });
    } else {
      socket.emit("online", { userName, online: false });
    }
  });

  socket.on("addingUser", (userName) => {
    sql
      .addUser(userName)
      .then((data) => {
        socket.emit("userAdded", data);
      })
      .catch(() => {
        socket.emit("notFound");
      });
  });

  socket.on("updateMe", ({ userName, name, image }) => {
    sql.updateUser(userName, name, image).then(() => {
      socket.emit("updated", { name, image });
    });
  });

  socket.on("userChanged", (userName) => {
    sql.getUser(userName).then((data) => {
      socket.emit("userChanged", data);
    });
  });

  socket.on("stuffChanged", ({ user, me, name, image }) => {
    const u = usersList.find((u) => u.userName === user);
    if (u) {
      socket.to(u.id).emit("stuffChanged", { user: me, name, image });
    }
  });

  socket.on("typing", (data) => {
    const user = usersList.find((user) => user.userName === data.userName);
    if (user)
      io.to(user.id).emit("usertyping", {
        user: data.userName,
        typing: data.typing,
      });
  });

  socket.on("chat", (data) => {
    try {
      if (data.message.file) {
        base64Data = data.message.file.split(";base64,").pop();
        const date = Date.now();
        fs.writeFile(
          `files/${date}-${data.message.name}`,
          base64Data,
          { encoding: "base64" },
          (err) => {
            if (err) console.log(err);
            let message = {
              ...data.message,
              file: `http://192.168.1.234:5000/${date}-${data.message.name}`,
            };
            const newMessage = {
              id: data.id,
              conversationId: data.conversationId,
              sender: data.sender,
              receiver: data.receiver,
              message: message,
              time: data.time,
            };
            sql.createMessage(newMessage).then(() => {
              sql
                .getConversation({ users: [data.sender, data.receiver] })
                .then((conversation) => {
                  const users = JSON.parse(conversation.users);
                  users.map((user) => {
                    const id = usersList.find((u) => u.userName === user);
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
          (err) => {
            if (err) console.log(err);
            let message = {
              ...data.message,
              data: `http://192.168.1.234:5000/${date}.wav`,
            };
            const newMessage = {
              id: data.id,
              conversationId: data.conversationId,
              sender: data.sender,
              receiver: data.receiver,
              message: message,
              time: data.time,
            };
            sql.createMessage(newMessage).then(() => {
              sql
                .getConversation({ users: [data.sender, data.receiver] })
                .then((conversation) => {
                  const users = JSON.parse(conversation.users);
                  users.map((user) => {
                    const id = usersList.find((u) => u.userName === user);
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
          sender: data.sender,
          receiver: data.receiver,
          message: data.message,
          time: data.time,
        };
        sql.createMessage(newMessage).then(() => {
          sql
            .getConversation({ users: [data.sender, data.receiver] })
            .then((conversation) => {
              const users = JSON.parse(conversation.users);
              users.map((user) => {
                const id = usersList.find((u) => u.userName === user);
                if (id) io.to(id.id).emit("newMessage", newMessage);
              });
            });
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("getMyChats", (data) => {
    try {
      sql
        .getConversation({ users: [data.sender, data.receiver] })
        .then((conversation) => {
          if (conversation) {
            sql.getConversationMessages(conversation.id).then((messages) => {
              const con = {
                id: conversation.id,
                users: JSON.parse(conversation.users),
                messages: messages,
              };
              socket.emit("yourChats", [con]);
            });
          } else {
            const newConversation = {
              id: shortid.generate(),
              users: [data.sender, data.receiver],
              messages: [],
            };
            sql.createConversation(newConversation).then(() => {
              sql
                .getConversation({ users: [data.sender, data.receiver] })
                .then((conversation) => {
                  const con = {
                    id: conversation.id,
                    users: JSON.parse(conversation.users),
                    messages: [],
                  };
                  socket.emit("yourChats", [con]);
                });
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("callUser", (data) => {
    const user = usersList.find((user) => user.userName === data.userToCall);
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
    const user = usersList.find((user) => user.userName === data.to);
    io.to(user.id).emit("callAccepted", data.signal);
  });

  socket.on("endCall", (userName) => {
    const user = usersList.find((us) => us.userName === userName);
    if (user) io.to(user.id).emit("endCall");
  });

  socket.on("ignoreCall", (userName) => {
    const user = usersList.find((user) => user.userName === userName);
    if (user) io.to(user.id).emit("ignoreCall");
  });

  socket.on("busy", (userName) => {
    const user = usersList.find((user) => user.userName === userName);
    if (user) io.to(user.id).emit("busy");
  });

  socket.on("deleteMessage", ({ messageID, conversationID, userName }) => {
    sql
      .deleteMessage(messageID)
      .then(() => {
        io.emit("messageDeleted", { messageID, conversationID });
      })
      .catch((err) => {
        const user = usersList.find((user) => user.userName === userName);
        if (user) io.to(user.id).emit("error", err);
      });
  });

  socket.on("disconnect", () => {
    usersList = usersList.filter((user) => user.id !== id);
    io.emit("users", usersList);
  });
});

server.listen(process.env.PORT || 5000, process.env.IP, () =>
  console.log(
    `Server has started on ${process.env.IP} using port ${process.env.PORT}`
  )
);
