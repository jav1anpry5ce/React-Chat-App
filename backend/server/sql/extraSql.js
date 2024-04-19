const logger = require("../config/logger.config");
const getConnection = require("./sqlConnection");

const con = getConnection();

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
      logger.error(err.message);
      reject(err);
    }
  });
};

module.exports = {
  calculateNextPageUrl
};
