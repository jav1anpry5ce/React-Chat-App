const fs = require("fs");
const getUsers = require("../getUsers");
const { getUser } = require("../sql/userSql");
const { createMessage } = require("../sql/messageSql");
const {
  createGroupChat,
  getGroupChatById,
  updateGroupChat,
  addMemberToGroup,
  getGroupMembers
} = require("../sql/groupSql");
const shortid = require("shortid");
const logger = require("../config/logger.config");

module.exports = function (socket, emitter, pubClient) {
  socket.on("sendGroupMessage", function (messageData) {
    try {
      if (messageData.message.file) {
        fileHandler(messageData, emitter, pubClient);
      } else if (messageData.message.audio) {
        audioHandler(messageData, emitter, pubClient);
      } else {
        textHandler(messageData, emitter, pubClient);
      }
    } catch (err) {
      logger.error(err.message);
    }
  });

  socket.on("createGroup", async function (groupData) {
    try {
      const group = {
        id: shortid.generate(),
        name: groupData.groupName,
        image: groupData.groupImage,
        members: groupData.members,
        messages: [],
        chatType: "group"
      };
      await createGroupChat(group);
      const members = groupData.members;
      const users = await getUsers(pubClient);
      users.forEach((user) => {
        members.forEach((member) => {
          if (member.username === user.username) {
            emitter.to(user.id).emit("newGroup", group);
          }
        });
      });
    } catch (err) {
      logger.error(err.message);
      emitter.to(socket.id).emit("error", {
        message: "Something went wrong. Try again later."
      });
    }
  });

  socket.on("changeGroup", async (groupData) => {
    try {
      const group = await updateGroupChat(groupData);
      const members = group.members;
      const users = await getUsers(pubClient);
      users.forEach((user) => {
        members.forEach((member) => {
          if (member.username === user.username) {
            emitter.to(user.id).emit("groupUpdated", group);
          }
        });
      });
    } catch (err) {
      logger.error(err.message);
      emitter.to(socket.id).emit("error", {
        message: "Something went wrong. Try again later."
      });
    }
  });

  socket.on("addGroupMember", async ({ groupId, username }) => {
    try {
      await addMemberToGroup({ groupId, username });
      const group = await getGroupChatById(groupId);
      const members = group.members;
      const users = await getUsers(pubClient);
      users.forEach((user) => {
        members.forEach((member) => {
          if (member.username === user.username) {
            emitter.to(user.id).emit("groupMemberAdded", group);
          }
        });
      });
    } catch (err) {
      logger.error(err.message);
      emitter.to(socket.id).emit("error", {
        message: "Something went wrong. Try again later."
      });
    }
  });
};

function fileHandler(message, emitter, pubClient) {
  try {
    base64Data = message.message.file.split(";base64,").pop();
    const date = new Date();
    const fileName = `${date.getTime()}_${message.message.name}`;
    fs.writeFile(
      `./files/${fileName}`,
      base64Data,
      { encoding: "base64" },
      async function (err) {
        if (err) {
          console.error(err);
          return;
        }
        const messageData = {
          ...message.message,
          file: `${process.env.IP}/${fileName}`
        };

        const message = {
          id: message.id,
          conversationId: message.conversationId,
          sender: await getUser(message.sender),
          receiver: { username: message.conversationId },
          message: messageData,
          time: message.time
        };
        await createMessage(message);
        const groupMembers = await getGroupMembers(message.conversationId);
        const users = await getUsers(pubClient);
        users.forEach((user) => {
          groupMembers.forEach((member) => {
            if (member.username === user.username) {
              emitter.to(user.id).emit("newMessage", message);
            }
          });
        });
      }
    );
  } catch (err) {
    logger.error(err.message);
  }
}

function audioHandler(message, emitter, pubClient) {
  try {
    base64Data = message.message.file.split(";base64,").pop();
    const date = Date.now();
    const fileName = `${date.getTime()}.wav`;
    fs.writeFile(
      `./files/${fileName}`,
      base64Data,
      { encoding: "base64" },
      async function (err) {
        if (err) {
          logger.error(err);
          return;
        }
        const messageData = {
          ...message.message,
          file: `${process.env.IP}/${fileName}`
        };

        const message = {
          id: message.id,
          conversationId: message.conversationId,
          sender: await getUser(message.sender),
          receiver: { username: message.conversationId },
          message: messageData,
          time: message.time
        };
        await createMessage(message);
        const groupMembers = await getGroupMembers(message.conversationId);
        const users = await getUsers(pubClient);
        users.forEach((user) => {
          groupMembers.forEach((member) => {
            if (member.username === user.username) {
              emitter.to(user.id).emit("newMessage", message);
            }
          });
        });
      }
    );
  } catch (err) {
    logger.error(err.message);
  }
}

async function textHandler(messageData, emitter, pubClient) {
  try {
    const message = {
      id: messageData.id,
      conversationId: messageData.conversationId,
      sender: await getUser(messageData.sender),
      receiver: { username: messageData.conversationId },
      message: messageData.message,
      time: messageData.time
    };
    await createMessage(message);
    const groupMembers = await getGroupMembers(message.conversationId);
    const users = await getUsers(pubClient);
    users.forEach((user) => {
      groupMembers.forEach((member) => {
        if (member.username === user.username) {
          emitter.to(user.id).emit("newMessage", message);
        }
      });
    });
  } catch (err) {
    logger.error(err.message);
  }
}
