const config = require("config");
const jwt = require("jsonwebtoken");

const CoupleDetails = require("../../models/CoupleDetails");

const decodedToken = token => jwt.verify(token, config.get("jwtSecret"));

var clients = [];

const connect = io => {
  io.on("connection", function(socket) {
    // get data from the connection that client added to
    const token = socket.handshake.query.token;
    const userID = decodedToken(token).id;
    const coupleID = socket.handshake.query.coupleID;
    let isClietExist = false;
    clients = clients.map(client => {
      if (client.userID === userID) {
        isClietExist = true;
        return (client = {
          userID,
          coupleID,
          userID,
          coupleID,
          socketID: socket.id
        });
      }
      return client;
    });
    if (!isClietExist) {
      clients.push({ userID, coupleID, socketID: socket.id });
    }

    socket.on("connect", () => {
      console.log("connected", socket.connected);
    });

    socket.on("sendMessage", function(data) {
      const { coupleID, userID, createAt, content } = data;
      const newMsg = { userID, content, createAt };
      CoupleDetails.findOne({ coupleID }).then(couple => {
        if (couple) {
          couple.messages.push(newMsg);
          CoupleDetails.findOneAndUpdate(
            { coupleID },
            { messages: couple.messages },
            { new: true }
          ).then(updatedCouple => {
            if (updatedCouple) {
              const newAddedMesg = updatedCouple.messages.pop();
              clients.map(client => {
                if (client.coupleID === coupleID && client.userID !== userID) {
                  io.to(client.socketID).emit("newMessage", newAddedMesg);
                }
                if (client.coupleID === coupleID && client.userID === userID) {
                  io.to(client.socketID).emit("sendSucceed", newAddedMesg);
                }
              });
            }
          });
        } else {
          const newCoupleDetails = new CoupleDetails({
            coupleID,
            messages: [newMsg]
          });
          newCoupleDetails.save().then(updatedCouple => {
            if (updatedCouple) {
              clients.map(client => {
                if (client.coupleID === coupleID && client.userID !== userID) {
                  io.to(client.socketID).emit(
                    "newMessage",
                    updatedCouple.messages[0]
                  );
                }
                if (client.coupleID === coupleID && client.userID === userID) {
                  io.to(client.socketID).emit(
                    "sendSucceed",
                    updatedCouple.messages[0]
                  );
                }
              });
            }
          });
        }
      });
    });

    socket.on("disconnect", reason => {
      console.log("disconnected", socket.disconnected, reason);
      clients = clients.filter(client => client.socketID !== socket.id);
    });
  });
};

module.exports = connect;
