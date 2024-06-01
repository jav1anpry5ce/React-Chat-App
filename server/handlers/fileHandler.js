const fs = require("fs");
const getUsers = require("../getUsers");
const { getUser } = require("../sql/userSql");
const { getConversationById } = require("../sql/conversationSql");
const { createMessage } = require("../sql/messageSql");
const logger = require("../config/logger.config");

module.exports = function (data, emitter, pubClient) {
  try {
    base64Data = data.message.file.split(";base64,").pop();
    const date = new Date();
    const fileName = `${date.getTime()}_${data.message.name}`;
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
          ...data.message,
          file: `${process.env.IP}/${fileName}`
        };

        const message = {
          id: data.id,
          conversationId: data.conversationId,
          sender: await getUser(data.sender),
          receiver: await getUser(data.receiver),
          message: messageData,
          time: data.time
        };
        await createMessage(message);
        const conversation = await getConversationById(data.conversationId);
        const toUsers = JSON.parse(conversation.users);
        const users = await getUsers(pubClient);
        users.forEach((user) => {
          if (toUsers.includes(user.username)) {
            emitter.to(user.id).emit("newMessage", message);
          }
        });
      }
    );
  } catch (err) {
    logger.error(err.message);
  }
};
