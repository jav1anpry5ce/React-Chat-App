const sql = require("../sql");
const fs = require("fs");
const getUsers = require("../getUsers");

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
          console.error(err);
          return;
        }
        const messageData = {
          ...data.message,
          file: `${process.env.IP}/${fileName}`,
        };

        const message = {
          id: data.id,
          conversationId: data.conversationId,
          sender: await sql.getUser(data.sender),
          receiver: await sql.getUser(data.receiver),
          message: messageData,
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
      }
    );
  } catch (err) {
    console.error(err);
  }
};
