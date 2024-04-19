const logger = require("../config/logger.config");
const { getUser } = require("./userSql");
const { calculateNextPageUrl } = require("./extraSql");
const { getMessage } = require("./conversationSql");
const getConnection = require("./sqlConnection");

const con = getConnection();

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

const getGroup = async (id) => {
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
        nextPageUrl
      };
    });

    return await Promise.all(groupChatPromises);
  } catch (err) {
    logger.error(err.message);
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
      logger.error(err.message);
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
        time: res.time
      };
    });

    return await Promise.all(messagePromises);
  } catch (err) {
    logger.error(err.message);
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
          username: member.username
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
    logger.error(err.message);
    throw err;
  }
};

module.exports = {
  createGroupChat,
  addMemberToGroup,
  getGroupChat,
  getGroupMessages,
  getGroupMembers,
  getGroupChatById,
  updateGroupChat
};
