const getConnection = require("./sqlConnection");
const logger = require("../config/logger.config");

const con = getConnection();

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
      logger.error(err.message);
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
    logger.error(err.message);
  }
};

const getUser = (username) => {
  const sql = `SELECT username, name, image FROM users WHERE username = '${username}'`;
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, (err, result) => {
        if (err) return reject(err);
        if (result && result.length > 0) return resolve(result[0]);
        return reject("User Not Found!");
      });
    } catch (err) {
      logger.error(err.message);
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
        return reject("User Not Found!");
      });
    } catch (err) {
      logger.error(err.message);
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
        return reject("User Not Found!");
      });
    } catch (err) {
      logger.error(err.message);
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
      logger.error(err.message);
      return reject(err);
    }
  });
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
    logger.error(err.message);
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
    logger.error(err.message);
    throw err;
  }
};

module.exports = {
  get_or_create_user,
  createUser,
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  login,
  uploadPhoto
};
