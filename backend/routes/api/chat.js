const config = require("config");
const jwt = require("jsonwebtoken");

const CoupleDetails = require("../../models/CoupleDetails");

const decodedToken = token => jwt.verify(token, config.get("jwtSecret"));

var clients = [];

const connect = io => {
  io.sockets.on("connection", function(socket) {
    // get data from the connection that client added to
    const token = socket.manager.handshaken[socket.id].query.token;
    const userID = decodedToken(token).id;
    const coupleID = socket.manager.handshaken[socket.id].query.coupleID;

    clients.push({ userID, coupleID, socketID: socket.id });

    socket.on("sendMessage", function(data) {
      console.log(data);
      const { coupleID, userID, createAt } = data;
      const newMsg = { userID, content: data.msgContext, createAt };
      CoupleDetails.findOne({ coupleID }).then(couple => {
        if (couple) {
          couple.messages.push(newMsg);
          CoupleDetails.findOneAndUpdate(
            { coupleID },
            { messages: couple.messages },
            { new: true }
          ).then(updatedCouple => {
            console.log("updatedCouple1", updatedCouple);
            if (updatedCouple) {
              const newAddedMesg = updatedCouple.messages.pop();
              console.log("newAddedMesg", newAddedMesg);
              clients.map(client => {
                if (client.coupleID === coupleID && client.userID !== userID) {
                  io.sockets
                    .socket(client.socketID)
                    .emit("newMessage", newAddedMesg);
                }
                if (client.coupleID === coupleID && client.userID === userID) {
                  io.sockets
                    .socket(client.socketID)
                    .emit("sendSucceed", newAddedMesg);
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
            console.log("updatedCouple2", updatedCouple);
            if (updatedCouple) {
              clients.map(client => {
                if (client.coupleID === coupleID && client.userID !== userID) {
                  io.sockets
                    .socket(client.socketID)
                    .emit("newMessage", updatedCouple.messages[0]);
                }
                if (client.coupleID === coupleID && client.userID === userID) {
                  io.sockets
                    .socket(client.socketID)
                    .emit("sendSucceed", updatedCouple.messages[0]);
                }
              });
            }
          });
        }
      });
    });

    socket.on("closeSocket", () => {
      clients = clients.filter(client => client.socketID === socket.id);
    });
  });
};

module.exports = connect;
