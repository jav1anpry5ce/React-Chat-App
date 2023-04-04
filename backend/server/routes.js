const express = require("express");
const sql = require("./sql");
const bcrypt = require("bcrypt");
const router = express.Router();
const shortid = require("shortid");

router.post("/signup", (req, res) => {
  const saltRounds = 10;
  const { username, name, image_url, password } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) return res.send({ password: err.message });
    sql
      .createUser({ username, name, image_url, password: hash })
      .then(() => {
        res.send({ message: "User created" });
      })
      .catch((err) => {
        res.send({ message: err.message });
      });
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  sql
    .getUser(username)
    .then((user) => {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) return res.send({ password: err.message });
        if (result) {
          const token = shortid.generate();
          sql
            .get_or_create_token({ token, username })
            .then(({ token }) => {
              res.status(200).send({
                name: user.name,
                image: user.image,
                username: user.username,
                token,
              });
            })
            .catch((err) => {
              res.status(500).send({ message: err.message });
            });
        } else {
          res.status(401).send({ message: "check username/password" });
        }
      });
    })
    .catch((err) => {
      res.status(401).send({ message: "check username/password" });
    });
});

router.get("/users/:username", (req, res) => {
  const { username } = req.params;
  sql
    .getUser(username)
    .then((user) => {
      res.status(200).send({
        name: user.name,
        image: user.image,
        username: user.username,
      });
    })
    .catch((err) => {
      res.status(404).send({ message: "user not found" });
    });
});

module.exports = router;
