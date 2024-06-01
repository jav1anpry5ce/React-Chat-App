module.exports = async function (pubClient) {
  const users = await pubClient.get("users");
  return JSON.parse(users);
};
