const logger = require("../config/logger.config");
const getConnection = require("./sqlConnection");
const { getGroupMessages } = require("./groupSql");
const { getConversationMessages } = require("./conversationSql");
const { calculateNextPageUrl } = require("./extraSql");

const con = getConnection();

const createMessage = async (data) => {
  try {
    // Start transaction
    await new Promise((resolve, reject) => {
      con.beginTransaction((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    // Insert data into messages table
    const messagesInsertSql = `INSERT INTO messages (id, conversationId, sender, receiver, message) VALUES (?,?,?,?,?)`;
    await new Promise((resolve, reject) => {
      con.query(
        messagesInsertSql,
        [
          data.id,
          data.conversationId,
          data.sender.username,
          data.receiver.username,
          data.message.id
        ],
        (err) => {
          if (err) {
            con.rollback(() => {
              reject(err);
            });
          } else {
            resolve();
          }
        }
      );
    });

    // Insert data into message table
    const messageInsertSql = `INSERT INTO message (id, type, name, file, text, data) VALUES (?,?,?,?,?,?)`;
    await new Promise((resolve, reject) => {
      con.query(
        messageInsertSql,
        [
          data.message.id,
          data.message.type,
          data.message?.name,
          data.message.file,
          data.message.text,
          data.message.data
        ],
        (err) => {
          if (err) {
            con.rollback(() => {
              reject(err);
            });
          } else {
            resolve();
          }
        }
      );
    });

    // Commit transaction
    await new Promise((resolve, reject) => {
      con.commit((err) => {
        if (err) {
          con.rollback(() => {
            reject(err);
          });
        } else {
          resolve("Success");
        }
      });
    });

    return "Success";
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
};

const deleteMessage = async (id) => {
  try {
    const timeSql = `SELECT time FROM messages WHERE id = ?`;
    const [timeResult] = await new Promise((resolve, reject) => {
      con.query(timeSql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const messageTime = new Date(timeResult.time).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - messageTime;
    const timeLimit = 1000 * 60 * 15; // 15 minutes in milliseconds

    if (timeDifference >= timeLimit) {
      throw new Error("Time limit exceeded");
    }

    const sql = `UPDATE message SET wasUnsent = 1, text = NULL WHERE id = ?`;
    await new Promise((resolve, reject) => {
      con.query(sql, [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const messageSql = `SELECT * FROM message WHERE id = ?`;
    const [messageResult] = await new Promise((resolve, reject) => {
      con.query(messageSql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    return messageResult;
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
};

const getMoreMessages = async (conversationId, limit, offset) => {
  try {
    // Check the type of chat (group or private)
    const chatType = await checkChatType(conversationId);

    // Retrieve messages based on chat type
    let messages;
    if (chatType === "group") {
      messages = await getGroupMessages(conversationId, limit, offset);
    } else {
      messages = await getConversationMessages(conversationId, limit, offset);
    }

    // Calculate the next page URL
    const nextPageUrl = await calculateNextPageUrl(
      conversationId,
      limit,
      offset
    );

    // If no messages are available, reject the promise
    if (!messages) {
      throw new Error("No more messages");
    }

    // Resolve with messages and next page URL
    return { messages, nextPageUrl };
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
};

const checkChatType = (chatId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM `groups` WHERE id = ?";
    con.query(sql, [chatId], (err, result) => {
      if (err) return reject(err);
      if (result.length > 0) return resolve("group");
      return resolve("private");
    });
  });
};

module.exports = {
  createMessage,
  deleteMessage,
  getMoreMessages
};
