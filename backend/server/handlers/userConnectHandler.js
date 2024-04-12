const getUsers = require("../getUsers");
const setUsers = require("../setUsers");
const sql = require("../sql");

module.exports = async function (emitter, data, pubClient) {
  try {
    let user = await sql.verifyToken(data.token);
    if (!user) return emitter.emit("error", { message: "Invalid token" });
    user = await sql.getUser(data.username);
    const joinedUser = {
      id: data.id,
      name: user.name,
      image: user.image,
      username: user.username,
    };
    const users = await getUsers(pubClient);
    const u = users.find((u) => u.id === data.id);
    if (!u) {
      users.push(joinedUser);
    }
    emitter.emit("userData", joinedUser);
    setUsers(users, pubClient);
  } catch (err) {
    console.log(err);
  }
};
