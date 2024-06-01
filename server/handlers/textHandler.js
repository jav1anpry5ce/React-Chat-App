const getUsers = require("../getUsers");
const { getUser } = require("../sql/userSql");
const { getConversationById } = require("../sql/conversationSql");
const { createMessage } = require("../sql/messageSql");
const logger = require("../config/logger.config");

module.exports = async function (data, emitter, pubClient) {
  try {
    const message = {
      id: data.id,
      conversationId: data.conversationId,
      sender: await getUser(data.sender),
      receiver: await getUser(data.receiver),
      message: data.message,
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
  } catch (err) {
    logger.error(err.message);
  }
};
