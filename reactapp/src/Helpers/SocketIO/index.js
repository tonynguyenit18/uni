import io from "socket.io-client";

export default (createSocket = (token, coupleID) =>
  io(`http://192.168.1.110:3000?token=${token}&&coupleID=${coupleID}`));
