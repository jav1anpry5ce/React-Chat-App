const express = require("express");
const {
  getUser,
  updateUser,
  createUser,
  getUserByToken,
  uploadPhoto,
  login
} = require("./sql/userSql");
const { get_or_create_token, validateToken } = require("./sql/tokenSql");
const { getMoreMessages } = require("./sql/messageSql");
const bcrypt = require("bcrypt");
const router = express.Router();
const shortid = require("shortid");
const IP = process.env.IP;
const logger = require("./config/logger.config");
const sharp = require("sharp");

router.post("/signup", (req, res) => {
  const saltRounds = 10;
  const { username, name, password } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) return res.send({ password: err.message });
    createUser({ username, name, password: hash })
      .then(() => {
        res.status(201).send({ message: "User created" });
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(500).send({ username: "username is not available" });
      });
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  login(username)
    .then((user) => {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) return res.send({ password: err.message });
        if (result) {
          const token = shortid.generate();
          get_or_create_token({ token, username })
            .then(({ token }) => {
              res.status(200).send({
                name: user.name,
                image: user.image,
                username: user.username,
                token
              });
            })
            .catch((err) => {
              logger.error(err.message);
              res.status(500).send({ message: err.message });
            });
        } else {
          res.status(401).send({ message: "check username/password" });
        }
      });
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(401).send({ message: "check username/password" });
    });
});

router.get("/users/:username", (req, res) => {
  const { username } = req.params;
  getUser(username)
    .then((user) => {
      res.status(200).send({
        name: user.name,
        image: user.image,
        username: user.username
      });
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(404).send({ message: "user not found" });
    });
});

router.get("/user", (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: "unauthorized" });
  validateToken(token)
    .then(() => {
      getUserByToken(token)
        .then((user) => {
          res.status(200).send({
            name: user.name,
            image: user.image,
            username: user.username,
            token
          });
        })
        .catch((err) => {
          logger.error(err.message);
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

  getUserByToken(token)
    .then((user) => {
      updateUser(user.username, name)
        .then((user) => {
          res.status(200).send(user);
        })
        .catch(() => {
          res.status(500).send({ message: "Something went wrong!" });
        });
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(500).send({ message: "Something went wrong!" });
    });
});

// router.post("/upload", async (req, res) => {
//   const { image } = req.files;
//   const token = req.headers.authorization;
//   if (!token) return res.status(401).send({ message: "unauthorized" });
//   if (!image) {
//     res.status(400).send({ message: "Something went wrong!" });
//   }
//   validateToken(token)
//     .then(() => {
//       const filename = shortid.generate() + ".jpg";
//       const image_url = `${IP}/${filename}`;
//       image.mv("./files/" + filename, (err) => {
//         if (err) return res.status(500).send({ message: err.message });
//         uploadPhoto(token, image_url)
//           .then((user) => {
//             res.status(200).send(user);
//           })
//           .catch((err) => {
//             res.status(500).send({ message: err.message });
//           });
//       });
//     })
//     .catch((err) => {
//       logger.error(err.message);
//       res.status(500).send({ message: "unauthorized" });
//     });
// });

router.post("/upload", async (req, res) => {
  const { image } = req.files;
  const token = req.headers.authorization;

  if (!token) return res.status(401).send({ message: "unauthorized" });
  if (!image) return res.status(400).send({ message: "Something went wrong!" });

  try {
    await validateToken(token);

    const filename = shortid.generate() + ".jpg";
    const filePath = "./files/" + filename;
    const image_url = `${IP}/${filename}`;

    // Use Sharp to reduce image quality before saving
    sharp(image.data)
      .jpeg({ quality: 30 })
      .toFile(filePath, async (err, info) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }

        try {
          await uploadPhoto(token, image_url);
          const user = await getUserByToken(token);
          res
            .status(200)
            .send({ message: 'Image uploaded successfully!', user });
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
      });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ message: "unauthorized" });
  }
});

router.get("/messages", async (req, res) => {
  const { conversationId, limit, offset } = req.query;
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: "unauthorized" });

  try {
    const messages = await getMoreMessages(
      conversationId,
      Number(limit),
      Number(offset)
    );
    return res.status(200).send({ messages });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).send({ message: "Something went wrong!" });
  }
});

module.exports = router;
