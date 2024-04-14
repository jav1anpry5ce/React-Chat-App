const path = require("path");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");
const fileUpload = require("express-fileupload");
const socketEvents = require("./socketEvents");
const { createServer } = require("http");
const { createClient } = require("redis");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const { createAdapter } = require("@socket.io/redis-adapter");
const { Emitter } = require("@socket.io/redis-emitter");
const logger = require("./config/logger.config");

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/files")));
app.use(fileUpload());
app.use("/api", router);
app.use("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/files"));
});

const server = createServer(app);

const io = new Server(server, {
  maxHttpBufferSize: 1e50,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  const emitter = new Emitter(pubClient);
  pubClient.set("users", JSON.stringify([]));

  socketEvents(io, pubClient, emitter);

  instrument(io, {
    auth: {
      type: "basic",
      username: "admin",
      password: "$2a$12$yFtj.4H4iyHym9hFkT1CFerilgz2Gyp9WgAMWz6h0mqo1UZS0XNt.", // "changeit" encrypted with bcrypt
    },
  });

  server.listen(process.env.PORT || 5000, () => {
    logger.info(
      `Server has started on ${process.env.IP} using port ${process.env.PORT}`
    );
  });
});
