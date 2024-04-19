const mysql = require("mysql2");
const logger = require("../config/logger.config");
require("dotenv").config();

const DB_CONFIG = {
  host: process.env.HOST,
  user: process.env.USER,
  port: process.env.DBPORT,
  password: process.env.PASSWORD,
  database: process.env.DB
};

const getConnection = () => {
  const connection = mysql.createConnection(DB_CONFIG);
  connection.connect((err) => {
    if (err) {
      logger.error(err.message);
      setTimeout(getConnection, 5000);
    }
  });

  connection.on("error", (err) => {
    logger.error(err.message);
    if (err.code === "PROTOCOL_CONNECTION_LOST") getConnection();
    if (err.code === "ECONNRESET") getConnection();
    if (err.code === "ETIMEDOUT") getConnection();
    else throw new Error(err);
  });

  return connection;
};

module.exports = getConnection;
