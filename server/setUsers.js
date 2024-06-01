module.exports = async function (users, pubClient) {
  await pubClient.set("users", JSON.stringify(users));
};
