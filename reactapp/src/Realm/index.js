const MessageSchema = {
  name: "Message",
  properties: {
    _id: { type: "string", default: "" },
    userID: { type: "string", default: "" },
    content: { type: "string", default: "" },
    createAt: { type: "int" }
  }
};

const UserSchema = {
  name: "User",
  primaryKey: "rowId",
  properties: {
    rowId: "int",
    _id: { type: "string", default: "" },
    username: { type: "string", default: "" },
    token: { type: "string", default: "" },
    isLoggedIn: { type: "bool", default: false },
    coupleID: { type: "string", default: "" },
    nickname: { type: "string", default: "" },
    partnerNickname: { type: "string", default: "" },
    phoneNo: { type: "string", default: "" },
    firstDate: { type: "string", default: "" },
    profileImageUrl: { type: "string", default: "" },
    backgroundUrl: { type: "string", default: "" }
  }
};

export default (Schema = [UserSchema, MessageSchema]);
