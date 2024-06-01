const logger = require("../config/logger.config");
const getConnection = require("./sqlConnection");
const {
  getConversationById,
  getConversationMessages
} = require("./conversationSql");
const { calculateNextPageUrl } = require("./extraSql");
const { getUser } = require("./userSql");
const { getGroupChatById } = require("./groupSql");

const con = getConnection();

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
        nextPageUrl
      };
    });

    return await Promise.all(chatPromises);
  } catch (err) {
    logger.error(err.message);
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
        nextPageUrl
      };
    } else {
      const groupChat = await getGroupChatById(chatId);
      if (groupChat) return groupChat;
    }
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
};

module.exports = { getChats, getChat };
