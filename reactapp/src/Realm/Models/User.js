import { booleanLiteral } from "@babel/types";

export default (UserSchema = {
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
    firstDate: { type: "string", default: "" }
  }
});
