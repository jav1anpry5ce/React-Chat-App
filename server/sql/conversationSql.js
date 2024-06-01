const logger = require("../config/logger.config");
const getConnection = require("./sqlConnection");
const { getUser } = require("./userSql");

const con = getConnection();

const getMessage = async (id) => {
  try {
    const sql = `SELECT * FROM message WHERE id = ?`;
    const result = await new Promise((resolve, reject) => {
      con.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });
    return result;
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
};

const createConversation = async (data) => {
  const sql = `INSERT INTO conversations (id, users) VALUES ('${data.id}', '["${data.users[0]}", "${data.users[1]}"]')`;
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, (err) => {
        if (err) reject(err);
        return resolve("Success");
      });
    } catch (err) {
      logger.error(err.message);
      return reject(err);
    }
  });
};

const getConversation = (data) => {
  const sql = `SELECT * FROM conversations WHERE users = '["${data.users[0]}", "${data.users[1]}"]' OR users = '["${data.users[1]}", "${data.users[0]}"]'`;
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, (err, result) => {
        if (err) reject(err);
        return resolve(result[0]);
      });
    } catch (err) {
      logger.error(err.message);
      return reject(err);
    }
  });
};

const getConversationById = (id) => {
  try {
    const sql = `SELECT * FROM conversations WHERE id = '${id}'`;
    return new Promise((resolve, reject) => {
      con.query(sql, (err, result) => {
        if (err) return reject(err);
        return resolve(result[0]);
      });
    });
  } catch (err) {
    logger.error(err);
  }
};

const conversationMessages = async (id, limit = 30, offset = 0) => {
  try {
    const sql = `SELECT * FROM messages WHERE conversationId = ? ORDER BY time DESC LIMIT ? OFFSET ?`;
    const result = await new Promise((resolve, reject) => {
      con.query(sql, [id, limit, offset], (err, result) => {
        if (err) {
          reject(err); // Handle query errors
        } else {
          resolve(result);
        }
      });
    });
    return result;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

const getConversationMessages = async (id, limit = 30, offset = 0) => {
  try {
    const results = await conversationMessages(id, limit, offset);

    // Sort messages by time in ascending order
    results.sort((a, b) => new Date(a.time) - new Date(b.time));

    const messagePromises = results.map(async (result) => {
      const message = await getMessage(result.message);
      const sender = await getUser(result.sender);
      const receiver = await getUser(result.receiver);

      return {
        id: result.id,
        conversationId: result.conversationId,
        sender: sender,
        receiver: receiver,
        message: message,
        time: result.time
      };
    });

    return await Promise.all(messagePromises);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

module.exports = {
  createConversation,
  getConversation,
  getConversationById,
  getConversationMessages
};
