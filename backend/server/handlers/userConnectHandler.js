const getUsers = require("../getUsers");
const setUsers = require("../setUsers");
const sql = require("../sql");
const logger = require("../config/logger.config");

module.exports = async function (emitter, data, pubClient) {
  try {
    const token = await sql.verifyToken(data.token);

    if (!token)
      return emitter.emit("tokenNotValid", { message: "Invalid token" });

    const user = await sql.getUser(data.username);
    const joinedUser = {
      id: data.id,
      name: user.name,
      image: user.image,
      username: user.username,
    };

    const users = await getUsers(pubClient);
    const onlineUser = users.find((user) => user.username === data.username);

    if (onlineUser) {
      onlineUser.id = data.id;
      emitter.to(onlineUser.id).emit("userData", onlineUser);
    } else {
      users.push(joinedUser);
      emitter.to(joinedUser.id).emit("userData", joinedUser);
    }

    await setUsers(users, pubClient);
  } catch (err) {
    logger.error(err);
  }
};
