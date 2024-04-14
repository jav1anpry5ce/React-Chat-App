const express = require("express");
const sql = require("./sql");
const bcrypt = require("bcrypt");
const router = express.Router();
const shortid = require("shortid");
const IP = process.env.IP;
const logger = require("./config/logger.config");

router.post("/signup", (req, res) => {
  const saltRounds = 10;
  const { username, name, password } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) return res.send({ password: err.message });
    sql
      .createUser({ username, name, password: hash })
      .then(() => {
        res.status(201).send({ message: "User created" });
      })
      .catch((err) => {
        logger.error(err);
        res.status(500).send({ username: "username is not available" });
      });
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  sql
    .login(username)
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
              logger.error(err);
              res.status(500).send({ message: err.message });
            });
        } else {
          res.status(401).send({ message: "check username/password" });
        }
      });
    })
    .catch((err) => {
      logger.error(err);
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
      logger.error(err);
      res.status(404).send({ message: "user not found" });
    });
});

router.get("/user", (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: "unauthorized" });
  sql
    .validateToken(token)
    .then(() => {
      sql
        .getUserByToken(token)
        .then((user) => {
          res.status(200).send({
            name: user.name,
            image: user.image,
            username: user.username,
            token,
          });
        })
        .catch((err) => {
          logger.error(err);
          res.status(500).send({ message: "unauthorized" });
        });
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: "unauthorized" });
    });
});

router.post("/user/update", async (req, res) => {
  const { name } = req.body;
  const token = req.headers.authorization;

  sql
    .getUserByToken(token)
    .then((user) => {
      sql
        .updateUser(user.username, name)
        .then((user) => {
          res.status(200).send(user);
        })
        .catch(() => {
          res.status(500).send({ message: "Something went wrong!" });
        });
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: "Something went wrong!" });
    });
});

router.post("/upload", async (req, res) => {
  const { image } = req.files;
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: "unauthorized" });
  if (!image) {
    res.status(400).send({ message: "Something went wrong!" });
  }
  sql
    .validateToken(token)
    .then(() => {
      const filename = shortid.generate() + ".jpg";
      const image_url = `${IP}/${filename}`;
      image.mv("./files/" + filename, (err) => {
        if (err) return res.status(500).send({ message: err.message });
        sql
          .uploadPhoto(token, image_url)
          .then((user) => {
            res.status(200).send(user);
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      });
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: "unauthorized" });
    });
});

router.get("/messages", async (req, res) => {
  const { conversationId, limit, offset } = req.query;
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: "unauthorized" });

  const messages = await sql.getMoreMessages(
    conversationId,
    Number(limit),
    Number(offset)
  );

  return res.status(200).send({ messages });
});

module.exports = router;
