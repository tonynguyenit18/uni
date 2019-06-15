const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
var cors = require("cors");
const users = require("./routes/api/users");
const auth = require("./routes/api/auth");
const couple = require("./routes/api/couple");
const connect = require("./routes/api/chat");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
server.listen(3000, () => console.log("Server listening on port 3000..."));
connect(io);

app.use(express.json());
app.use(cors());

//DB config
const dbURI = config.get("mongoURI");

//Connect to MongoDb
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDb is connected..."), {
    useNewUrlParser: true,
    dbName: "test"
  })
  .catch(err => console.log(err));

//User routes
app.use("/api/user", users);
app.use("/api/auth", auth);
app.use("/api/couple", couple);
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`App started on port ${port}`));
