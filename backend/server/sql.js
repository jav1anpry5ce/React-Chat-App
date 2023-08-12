const mysql = require("mysql2");
require("dotenv").config();

const DB_CONFIG = {
  host: process.env.HOST,
  user: process.env.USER,
  port: process.env.DBPORT,
  password: process.env.PASSWORD,
  database: process.env.DB,
};

let con;

const handleConnect = () => {
  con = mysql.createConnection(DB_CONFIG);

  con.connect((err) => {
    if (err) setTimeout(handleConnect, 5000);
  });

  con.on("error", (err) => {
    console.error(err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") handleConnect();
    else throw new Error(err);
  });
};

handleConnect();

const get_or_create_user = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE username = '${data.username}'`;
    try {
      con.query(sql, (err, result) => {
        if (err) return reject(err);
        if (result.length > 0) return resolve(result[0]);
        const sql =
          "INSERT INTO users (username, name, image) VALUES (?, ?, ?)";
        con.query(
          sql,
          [data.username.trim(), data.name.trim(), data.image],
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

const createUser = (data) => {
  const sql = `INSERT INTO users (username, name, password) VALUES ('${data.username}', '${data.name}', '${data.password}')`;
  return new Promise((resolve, reject) => {
    con.query(sql, (err) => {
      if (err) return reject(err);
      return resolve("Success");
    });
  });
};

const getUser = (username) => {
  const sql = `SELECT username, name, image FROM users WHERE username = '${username}'`;
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, (err, result) => {
        if (err) return reject(err);
        if (result && result.length > 0) return resolve(result[0]);
        return reject("NotFound");
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const getUserByToken = (token) => {
  const sql = `SELECT username FROM token WHERE token = '${token}' LIMIT 1`;
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, async (err, result) => {
        if (err) return reject(err);
        if (result && result.length > 0) {
          const user = await getUser(result[0].username);
          return resolve(user);
        }
        return reject("NotFound");
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const addUser = (username) => {
  const sql = `SELECT * FROM users WHERE username = '${username}'`;
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

const updateUser = (username, name) => {
  const sql = `UPDATE users SET name = "${name}" WHERE username = "${username}"`;
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, async (err) => {
        if (err) return reject(err);
        const user = await getUser(username);
        return resolve(user);
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

const getConversationById = (id) => {
  const sql = `SELECT * FROM conversations WHERE id = '${id}'`;
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) return reject(err);
      return resolve(result[0]);
    });
  });
};

const getChats = async (username) => {
  const sql = `SELECT * FROM conversations WHERE users LIKE '%${username}%'`;
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) return reject(err);
      const promises = result.map(async (res) => {
        return new Promise(async (resolve, reject) => {
          const conversation = await getConversationById(res.id);
          if (!conversation) return reject("NotFound");
          const chatUser = JSON.parse(conversation.users).filter(
            (user) => user !== username
          )[0];
          const user = await getUser(chatUser);
          const messages = await getConversationMessages(res.id);
          conversation.name = user.name;
          conversation.image = user.image;
          conversation.username = user.username;
          conversation.messages = messages;
          conversation.unread = 0;
          conversation.lastMessage = messages?.at(-1)?.message;
          return resolve(conversation);
        });
      });
      Promise.all(promises).then((result) => {
        return resolve(result);
      });
    });
  });
};

const getChat = async (chatId, username) => {
  const sql = `SELECT * FROM conversations WHERE id = '${chatId}'`;
  return new Promise((resolve, reject) => {
    con.query(sql, async (err, result) => {
      if (err) return reject(err);
      const conversation = result[0];
      if (conversation) {
        const chatUser = JSON.parse(conversation?.users).filter(
          (user) => user !== username
        )[0];
        const user = await getUser(chatUser);
        const messages = await getConversationMessages(chatId);
        conversation.name = user.name;
        conversation.image = user.image;
        conversation.username = user.username;
        conversation.messages = messages;
        conversation.lastMessage = messages?.at(-1)?.message;
        return resolve(conversation);
      } else {
        const groupChat = await getGroupChatById(chatId);
        if (groupChat) return resolve(groupChat);
      }
    });
  });
};

const createGroupChat = async (data) => {
  const sql = `INSERT INTO groups (id, name, image) VALUES (?, ?, ?)`;
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, [data.id, data.name, data.image], (err) => {
        if (err) return reject(err);
        data.members.forEach((member) => {
          const sql = `INSERT INTO members (groupId, username, admin) VALUES (?,?,?)`;
          con.query(
            sql,
            [data.id, member.username, member?.admin || 0],
            (err) => {
              if (err) return reject(err);
            }
          );
        });
        return resolve("Success");
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const addMemberToGroup = async (data) => {
  return new Promise(async (resolve, reject) => {
    const user = await getUser(data.username);
    if (!user) return reject("NotFound");
    const sql = "INSERT INTO members (groupId, username) VALUES (?,?)";
    try {
      con.query(sql, [data.groupId, data.username], (err) => {
        if (err) return reject(err);
        return resolve("Success");
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const getGroupMembers = async (id) => {
  const sql = `SELECT username, admin FROM members WHERE groupId = '${id}'`;
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, (err, result) => {
        if (err) return reject(err);
        const promises = result.map(async (res) => {
          const user = await getUser(res.username);
          user.admin = res.admin;
          return user;
        });
        Promise.all(promises).then((result) => {
          return resolve(result);
        });
      });
    } catch (err) {
      return reject(err);
    }
  });
};

getGroup = async (id) => {
  const sql = `SELECT * FROM groups WHERE id = '${id}'`;
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) return reject(err);
      return resolve(result[0]);
    });
  });
};

const getGroupChat = async (username) => {
  const sql = `SELECT groupId FROM members WHERE username = '${username}'`;
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) return reject(err);
      const promises = result.map(async (res) => {
        const group = await getGroup(res.groupId);
        const members = await getGroupMembers(res.groupId);
        const messages = await getGroupMessages(res.groupId);
        group.members = members;
        group.messages = messages;
        group.chatType = "group";
        group.unread = 0;
        group.lastMessage = messages?.at(-1)?.message;
        return group;
      });
      Promise.all(promises).then((res) => {
        return resolve(res);
      });
    });
  });
};

const getGroupChatById = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await getGroup(id);
      const members = await getGroupMembers(id);
      const messages = await getGroupMessages(id);
      group.members = members;
      group.messages = messages;
      group.chatType = "group";
      group.lastMessage = messages?.at(-1)?.message;
      return resolve(group);
    } catch (err) {
      return reject(err);
    }
  });
};

const getGroupMessages = async (id) => {
  const sql = `SELECT * FROM messages WHERE conversationId = '${id}' ORDER BY time ASC`;
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) return reject(err);
      const promises = result.map(async (res) => {
        const message = await getMessage(res.message);
        const sender = await getUser(res.sender);
        return {
          id: res.id,
          groupId: res.conversationId,
          sender: sender,
          message: message,
          time: res.time,
        };
      });
      Promise.all(promises).then((res) => {
        return resolve(res);
      });
    });
  });
};

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
  const promises = results.map(async (result) => {
    const message = await getMessage(result.message);
    const sender = await getUser(result.sender);
    const receiver = await getUser(result.receiver);
    return {
      id: result.id,
      conversationId: result.conversationId,
      sender: sender,
      receiver: receiver,
      message: message,
      time: result.time,
    };
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
          data.sender.username,
          data.receiver.username,
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
  const sql = `UPDATE message SET wasUnsent = 1, text = NULL WHERE id = '${id}'`;
  const timeSql = `SELECT time FROM messages WHERE id = '${id}'`;
  const messageSql = `SELECT * FROM message WHERE id = '${id}'`;
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
          con.query(messageSql, (err, result) => {
            if (err) return reject(err);
            return resolve(result[0]);
          });
        });
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const get_or_create_token = ({ username, token }) => {
  const sql = `SELECT token FROM token WHERE username = '${username}'`;
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) return reject(err);
      if (result.length > 0) return resolve(result[0]);
      const sql = `INSERT INTO token (username, token) VALUES ('${username}', '${token}')`;
      con.query(sql, (err) => {
        if (err) return reject(err);
        return resolve({ token });
      });
    });
  });
};

const updateGroupChat = (data) => {
  return new Promise(async (resolve, reject) => {
    const sql = `UPDATE groups SET name = '${data.name}', image = '${data.image}' WHERE id = '${data.id}'`;
    con.query(sql, async (err) => {
      if (err) return reject(err);
      const promises = data.members.map(async (member) => {
        return await addMemberToGroup({
          groupId: data.id,
          username: member.username,
        }).catch((err) => {
          return reject(err);
        });
      });
      await Promise.all(promises);
      const group = await getGroupChatById(data.id);
      resolve(group);
    });
  });
};

const login = (username) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE username = '${username}'`;
    con.query(sql, (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return reject("User not found");
      return resolve(result[0]);
    });
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT username FROM token WHERE token = '${token}'`;
    con.query(sql, (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return reject("Invalid token");
      return resolve(result[0].username);
    });
  });
};

const validateToken = (token) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM token WHERE token = '${token}'`;
    con.query(sql, (err, result) => {
      if (err) return reject(false);
      if (result.length === 0) return reject(false);
      return resolve(true);
    });
  });
};

const uploadPhoto = (token, image_url) => {
  return new Promise(async (resolve, reject) => {
    const user = await getUserByToken(token);
    const sql = `UPDATE users SET image = '${image_url}' WHERE username = '${user.username}'`;
    con.query(sql, (err) => {
      if (err) return reject(err);
    });
    const updatedUser = await getUserByToken(token);
    resolve(updatedUser);
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
  getUserByToken,
  createGroupChat,
  deleteMessage,
  addMemberToGroup,
  getGroupChat,
  getGroupMessages,
  getGroupMembers,
  getChats,
  getChat,
  getGroupChatById,
  getConversationById,
  createUser,
  get_or_create_token,
  updateGroupChat,
  login,
  verifyToken,
  uploadPhoto,
  validateToken,
};
