import { StyleSheet } from "react-native";

export default (styles = StyleSheet.create({
  screenContainer: {
    width: "100%",
    height: "100%"
  },
  userMessageContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 5
  },
  partnerMessageContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 5
  },
  userMessageBg: {
    borderRadius: 10,
    backgroundColor: "#ff00ac",
    marginRight: "10%",
    maxWidth: "70%",
    paddingHorizontal: 8,
    paddingVertical: 6,
    minHeight: 36
  },
  partnerMessageBg: {
    borderRadius: 10,
    backgroundColor: "#f4f4f4",
    maxWidth: "70%",
    marginLeft: "10%",
    paddingHorizontal: 8,
    paddingVertical: 5,
    minHeight: 36
  },
  userMessage: {
    color: "#fff",
    fontSize: 17
  },
  partnerMessage: {
    color: "#ff00ac",
    fontSize: 17
  },
  inputContainer: {
    minHeight: 50,
    paddingHorizontal: 5,
    borderColor: "#ff00ac",
    borderTopWidth: 2,
    flexDirection: "row",
    paddingVertical: 10,
    paddingLeft: 20
  },
  messageInput: {
    minHeight: 30,
    width: "90%"
  }
}));
