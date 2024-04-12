const sql = require("../sql");
const getUsers = require("../getUsers");

module.exports = async function (data, emitter, pubClient) {
  try {
    const message = {
      id: data.id,
      conversationId: data.conversationId,
      sender: await sql.getUser(data.sender),
      receiver: await sql.getUser(data.receiver),
      message: data.message,
      time: data.time,
    };
    await sql.createMessage(message);
    const conversation = await sql.getConversationById(data.conversationId);
    const toUsers = JSON.parse(conversation.users);
    const users = await getUsers(pubClient);
    users.forEach((user) => {
      if (toUsers.includes(user.username)) {
        emitter.to(user.id).emit("newMessage", message);
      }
    });
  } catch (err) {
    console.error(err);
  }
};
