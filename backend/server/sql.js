const mysql = require("mysql2");
const logger = require("./config/logger.config");
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
    logger.error(err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") handleConnect();
    if (err.code === "ECONNRESET") handleConnect();
    if (err.code === "ETIMEDOUT") handleConnect();
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
      logger.error(err);
      return reject(err);
    }
  });
};

const createUser = (data) => {
  try {
    const sql = `INSERT INTO users (username, name, password) VALUES ('${data.username}', '${data.name}', '${data.password}')`;
    return new Promise((resolve, reject) => {
      con.query(sql, (err) => {
        if (err) return reject(err);
        return resolve("Success");
      });
    });
  } catch (err) {
    logger.error(err);
  }
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
      logger.error(err);
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
      logger.error(err);
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
      logger.error(err);
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
      logger.error(err);
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
      logger.error(err);
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
      logger.error(err);
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

const getChats = async (username) => {
  try {
    const sql = `SELECT * FROM conversations WHERE users LIKE ?`;
    const result = await new Promise((resolve, reject) => {
      con.query(sql, [`%${username}%`], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const chatPromises = result.map(async (res) => {
      const conversation = await getConversationById(res.id);
      if (!conversation) throw new Error("Conversation not found");
      const chatUser = JSON.parse(conversation.users).find(
        (user) => user !== username
      );
      const user = await getUser(chatUser);
      const messages = await getConversationMessages(res.id);
      const nextPageUrl = await calculateNextPageUrl(res.id);

      conversation.name = user.name;
      conversation.image = user.image;
      conversation.username = user.username;
      conversation.messages = messages;
      conversation.unread = 0;
      conversation.lastMessage = messages?.at(-1)?.message;
      conversation.nextPageUrl = nextPageUrl;

      return {
        chatType: "private",
        ...conversation,
        nextPageUrl,
      };
    });

    return await Promise.all(chatPromises);
  } catch (err) {
    logger.error(err);
    throw err; // Propagate error further up
  }
};

const getChat = async (chatId, username) => {
  try {
    const sql = `SELECT * FROM conversations WHERE id = ?`;
    const result = await new Promise((resolve, reject) => {
      con.query(sql, [chatId], async (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const conversation = result[0];
    if (conversation) {
      const chatUser = JSON.parse(conversation?.users).find(
        (user) => user !== username
      );
      const user = await getUser(chatUser);
      const messages = await getConversationMessages(chatId);
      const nextPageUrl = await calculateNextPageUrl(chatId);

      conversation.name = user.name;
      conversation.image = user.image;
      conversation.username = user.username;
      conversation.messages = messages;
      conversation.lastMessage = messages?.at(-1)?.message;
      conversation.nextPageUrl = nextPageUrl;

      return {
        chatType: "private",
        ...conversation,
        nextPageUrl,
      };
    } else {
      const groupChat = await getGroupChatById(chatId);
      if (groupChat) return groupChat;
    }
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

const createGroupChat = async (data) => {
  try {
    // Start transaction
    await new Promise((resolve, reject) => {
      con.beginTransaction((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    // Insert group data
    await new Promise((resolve, reject) => {
      const sql = "INSERT INTO `groups` (id, name, image) VALUES (?, ?, ?)";
      con.query(sql, [data.id, data.name, data.image], (err) => {
        if (err) {
          con.rollback(() => {
            reject(err);
          });
        } else {
          resolve();
        }
      });
    });

    // Insert members
    await Promise.all(
      data.members.map((member) => {
        return new Promise((resolve, reject) => {
          const sql =
            "INSERT INTO `members` (groupId, username, admin) VALUES (?,?,?)";
          con.query(
            sql,
            [data.id, member.username, member?.admin || 0],
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
      })
    );

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
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

// const addMemberToGroup = async (data) => {
//   return new Promise(async (resolve, reject) => {
//     const user = await getUser(data.username);
//     if (!user) return reject("NotFound");
//     const sql = "INSERT INTO members (groupId, username) VALUES (?,?)";
//     try {
//       con.query(sql, [data.groupId, data.username], (err) => {
//         if (err) return reject(err);
//         return resolve("Success");
//       });
//     } catch (err) {
//       logger.error(err);
//       return reject(err);
//     }
//   });
// };

const addMemberToGroup = async (data) => {
  try {
    // Check if the user exists
    const user = await getUser(data.username);
    if (!user) throw new Error("User not found");

    // Insert the member into the group
    const sql = "INSERT INTO members (groupId, username) VALUES (?,?)";
    await new Promise((resolve, reject) => {
      con.query(sql, [data.groupId, data.username], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return "Success";
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

const getGroupMembers = async (id) => {
  try {
    const sql = `SELECT username, admin FROM members WHERE groupId = ?`;
    const result = await new Promise((resolve, reject) => {
      con.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const memberPromises = result.map(async (res) => {
      const user = await getUser(res.username);
      user.admin = res.admin;
      return user;
    });

    return await Promise.all(memberPromises);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

getGroup = async (id) => {
  try {
    const sql = "SELECT * FROM `groups` WHERE id = ?";
    return new Promise((resolve, reject) => {
      con.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        return resolve(result[0]);
      });
    });
  } catch (err) {
    logger.error(err);
  }
};

const getGroupChat = async (username) => {
  try {
    const sql = `SELECT groupId FROM members WHERE username = ?`;
    const result = await new Promise((resolve, reject) => {
      con.query(sql, [username], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const groupChatPromises = result.map(async (res) => {
      const group = await getGroup(res.groupId);
      const members = await getGroupMembers(res.groupId);
      const messages = await getGroupMessages(res.groupId);
      const nextPageUrl = await calculateNextPageUrl(res.groupId);

      group.members = members;
      group.messages = messages;
      group.unread = 0;
      group.lastMessage = messages?.at(-1)?.message;

      return {
        chatType: "group",
        ...group,
        nextPageUrl,
      };
    });

    return await Promise.all(groupChatPromises);
  } catch (err) {
    logger.error(err);
    throw err;
  }
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

const getGroupMessages = async (id, limit = 30, offset = 0) => {
  try {
    const sql = `SELECT * FROM messages WHERE conversationId = ? ORDER BY time DESC LIMIT ? OFFSET ?`;
    const result = await new Promise((resolve, reject) => {
      con.query(sql, [id, limit, offset], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    result.sort((a, b) => new Date(a.time) - new Date(b.time));

    const messagePromises = result.map(async (res) => {
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

    return await Promise.all(messagePromises);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

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
    logger.error(err);
    throw err;
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

const calculateNextPageUrl = (id, limit = 30, offset = 0) => {
  return new Promise((resolve, reject) => {
    try {
      const countSql = `SELECT COUNT(*) as count FROM messages WHERE conversationId = '${id}'`;
      con.query(countSql, (err, countResult) => {
        if (err) {
          reject(err); // Handle query errors
        } else {
          const totalCount = countResult[0].count;
          const nextPage = offset + limit < totalCount ? offset + limit : null;
          const nextPageUrl = nextPage
            ? `${process.env.IP}/api/messages?conversationId=${id}&offset=${nextPage}&limit=${limit}`
            : null;
          resolve(nextPageUrl);
        }
      });
    } catch (err) {
      logger.error(err);
      reject(err);
    }
  });
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
        time: result.time,
      };
    });

    return await Promise.all(messagePromises);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

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
          data.message.id,
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
          data.message.data,
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
    logger.error(err);
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
    logger.error(err);
    throw err;
  }
};

const get_or_create_token = async ({ username, token }) => {
  try {
    const selectSql = `SELECT token FROM token WHERE username = ?`;
    const [existingToken] = await new Promise((resolve, reject) => {
      con.query(selectSql, [username], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (existingToken) {
      return existingToken; // Token exists, return it
    } else {
      // Token doesn't exist, create a new one
      const insertSql = `INSERT INTO token (username, token) VALUES (?, ?)`;
      await new Promise((resolve, reject) => {
        con.query(insertSql, [username, token], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      return { token }; // Return the newly created token
    }
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

const updateGroupChat = async (data) => {
  try {
    const updateSql = "UPDATE `groups` SET name = ?, image = ? WHERE id = ?";
    await new Promise((resolve, reject) => {
      con.query(updateSql, [data.name, data.image, data.id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const promises = data.members.map(async (member) => {
      try {
        await addMemberToGroup({
          groupId: data.id,
          username: member.username,
        });
      } catch (err) {
        throw err; // Propagate error up the call stack
      }
    });
    await Promise.all(promises);

    // Fetch updated group chat details
    const group = await getGroupChatById(data.id);
    return group;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

const login = async (username) => {
  try {
    const sql = `SELECT * FROM users WHERE username = ?`;
    const [user] = await new Promise((resolve, reject) => {
      con.query(sql, [username], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

const verifyToken = async (token) => {
  try {
    const sql = `SELECT username FROM token WHERE token = ?`;
    const [result] = await new Promise((resolve, reject) => {
      con.query(sql, [token], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!result) {
      throw new Error("Invalid token");
    }

    return result.username;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

const validateToken = async (token) => {
  try {
    const sql = `SELECT * FROM token WHERE token = ?`;
    const [result] = await new Promise((resolve, reject) => {
      con.query(sql, [token], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!result || result.length === 0) {
      return false; // Token is invalid
    }

    return true; // Token is valid
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

const uploadPhoto = async (token, image_url) => {
  try {
    // Get user details using token
    const user = await getUserByToken(token);

    // Update the user's profile image URL in the database
    const updateSql = `UPDATE users SET image = ? WHERE username = ?`;
    await new Promise((resolve, reject) => {
      con.query(updateSql, [image_url, user.username], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Fetch the updated user details after the image upload
    const updatedUser = await getUserByToken(token);
    return updatedUser;
  } catch (err) {
    logger.error(err);
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
    logger.error(err);
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
  getMoreMessages,
};
