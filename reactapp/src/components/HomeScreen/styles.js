import { StyleSheet, Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
export default (styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative"
  },
  fadedColorLayout: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    opacity: 0.3
  },
  coupleIdModel: {
    backgroundColor: "#fff",
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    position: "absolute",
    top: screenHeight * 0.3,
    left: screenWidth * 0.1,
    borderRadius: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  coupleIdModelWithID: {
    backgroundColor: "#fff",
    width: screenWidth * 0.8,
    height: screenHeight * 0.3,
    position: "absolute",
    top: screenHeight * 0.3,
    left: screenWidth * 0.1,
    borderRadius: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  messageText: {
    width: "80%",
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center"
  },
  coupleIDInput: {
    width: "80%",
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderRadius: 10
  },
  syncButton: {
    width: "50%",
    backgroundColor: "#0595ff",
    borderRadius: 10,
    paddingVertical: 5,
    marginTop: 10
  },
  coupleIDShowText: {
    width: "60%",
    backgroundColor: "#FF00AC",
    fontSize: 20,
    borderRadius: 10,
    padding: 10,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
    overflow: "hidden",
    fontWeight: "500"
  },
  name: {
    color: "#ff00ac",
    fontSize: 17,
    height: 30
  },
  textInViewBackground: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "rgba(252, 222, 251, 0.7)",
    height: 30,
    borderRadius: 10
  },
  actionIconContainer: {
    position: "absolute",
    bottom: "5%",
    right: "10%",
    left: "5%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  leftActionIconContainer: {
    flex: 0,
    width: "20%",
    flexDirection: "row",
    marginHorizontal: screenWidth * 0.05
  },
  optionsPopup: {
    position: "absolute",
    top: "30%",
    left: "20%",
    width: "60%",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10,
    zIndex: 2
  }
}));
