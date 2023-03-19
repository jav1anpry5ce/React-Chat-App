const mysql = require("mysql2");
require("dotenv").config();

const con = mysql.createConnection({
  host: process.env.HOST || "localhost",
  user: process.env.USER || "root",
  port: process.env.DBPORT || 3306,
  password: process.env.PASSWORD || "password",
  database: process.env.DB || "chat_app",
});

const openConnection = () => {
  con.connect((err) => {
    if (err) throw err;
  });
};

openConnection();

const get_or_create_user = (data) => {
  const sql = `SELECT * FROM users WHERE userName = '${data.userName}'`;
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, (err, result) => {
        if (err) return reject(err);
        if (result.length > 0) return resolve(result[0]);
        const sql =
          "INSERT INTO users (userName, name, image) VALUES (?, ?, ?)";
        con.query(
          sql,
          [data.userName.trim(), data.name.trim(), data.image],
          (err) => {
            if (err) return reject(err);
            return resolve(data);
          }
        );
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const getUser = (userName) => {
  const sql = `SELECT * FROM users WHERE userName = '${userName}'`;
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, (err, result) => {
        if (err) return reject(err);
        if (result && result.length > 0) return resolve(result[0]);
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const addUser = (userName) => {
  const sql = `SELECT * FROM users WHERE userName = '${userName}'`;
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, (err, result) => {
        if (err) return reject(err);
        if (result.length > 0) return resolve(result[0]);
        return reject("NotFound");
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const updateUser = (userName, name, image) => {
  const sql = `UPDATE users SET name = "${name}", image = "${image}" WHERE userName = "${userName}"`;
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, (err) => {
        if (err) return reject(err);
        return resolve("Success");
      });
    } catch (err) {
      return reject(err);
    }
  });
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
      return reject(err);
    }
  });
};

const createGroupChat = async (data) => {
  const sql = "INSERT INTO groups (id) VALUES (?)";
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, [data.id], (err) => {
        if (err) return reject(err);
        data.users.forEach((user) => {
          const sql =
            "INSERT INTO members (groupId, userName, admin) VALUES (?, ?, ?)";
          con.query(sql, [data.id, user.userName, user.admin], (err) => {
            if (err) return reject(err);
          });
        });
        return resolve("Success");
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const getGroupChat = async (id) => {};

const getMessage = (id) => {
  const sql = `SELECT * FROM message WHERE id = '${id}'`;
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, (err, result) => {
        if (err) reject(err);
        return resolve(result[0]);
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const conversationMessages = (id) => {
  const sql = `SELECT * FROM messages WHERE conversationId = '${id}' ORDER BY time ASC`;
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, async (err, result) => {
        if (err) reject(err);
        return resolve(result);
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const getConversationMessages = async (id) => {
  const results = await conversationMessages(id);
  const promises = results.map((result) => {
    return getMessage(result.message).then((message) => {
      return {
        id: result.id,
        conversationId: result.conversationId,
        sender: result.sender,
        receiver: result.receiver,
        message: message,
        time: result.time,
      };
    });
  });
  return await Promise.all(promises);
};

const createMessage = (data) => {
  const sql = `INSERT INTO messages (id, conversationId, sender, receiver, message) 
    VALUES (?,?,?,?,?)`;
  return new Promise((resolve, reject) => {
    try {
      con.query(
        sql,
        [
          data.id,
          data.conversationId,
          data.sender,
          data.receiver,
          data.message.id,
          data.time,
        ],
        (err) => {
          if (err) reject(err);
          const sql =
            "INSERT INTO message (id, type, name, file, text, data) VALUES (?,?,?,?,?,?)";
          con.query(
            sql,
            [
              data.message.id,
              data.message.type,
              data.message?.name,
              data.message.file,
              data.message.text,
              data.message.data,
            ],
            (err) => {
              if (err) reject(err);
              return resolve("Success");
            }
          );
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};

const deleteMessage = (id) => {
  const sql = `DELETE FROM messages WHERE id = '${id}'`;
  const sql2 = `DELETE FROM message WHERE id = '${id}'`;
  const timeSql = `SELECT time FROM messages WHERE id = '${id}'`;
  return new Promise((resolve, reject) => {
    try {
      con.query(timeSql, (err, result) => {
        if (err) return reject(err);
        const time = new Date(result[0].time).getTime();
        const limit = 1000 * 60 * 15;
        const isTimePassed = new Date().getTime() - time < limit ? false : true;
        if (isTimePassed) return reject("Time limit exceeded");
        con.query(sql, (err) => {
          if (err) return reject(err);
          con.query(sql2, (err) => {
            if (err) return reject(err);
            return resolve("Success");
          });
        });
      });
    } catch (err) {
      return reject(err);
    }
  });
};

module.exports = {
  createConversation,
  getConversation,
  getConversationMessages,
  createMessage,
  get_or_create_user,
  addUser,
  updateUser,
  getUser,
  createGroupChat,
  deleteMessage,
};
