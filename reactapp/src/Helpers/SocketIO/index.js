import io from "socket.io-client";

export default (createSocket = (token, coupleID) =>
  io(`http://YOUR_ID_ADDRESS:3000?token=${token}&&coupleID=${coupleID}`));
