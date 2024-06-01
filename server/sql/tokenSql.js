const logger = require("../config/logger.config");
const getConnection = require("./sqlConnection");

const con = getConnection();

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
    logger.error(err.message);
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
    logger.error(err.message);
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
    logger.error(err.message);
    throw err;
  }
};

module.exports = {
  get_or_create_token,
  verifyToken,
  validateToken
};
