import { StyleSheet } from "react-native";

export default (styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%"
  },
  header: {
    width: "100%",
    height: "10%",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    borderColor: "#ff00ac"
  },
  buttonTextContainer: {
    flexDirection: "row",
    marginTop: 15
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Cochin",
    fontWeight: "bold",
    color: "#ff00ac",
    paddingHorizontal: 5
  },
  buttonBackIcon: {
    marginTop: 15,
    width: 10,
    height: 20
  },
  buttonAddIcon: {
    marginTop: 10,
    width: 20,
    height: 20
  },
  deactivatedTextButton: {
    fontSize: 20,
    fontFamily: "Cochin",
    fontWeight: "bold",
    color: "#ff00ac",
    paddingHorizontal: 5,
    opacity: 0.7
  },
  addMemoryImage: {
    position: "absolute",
    width: "100%",
    height: "95%",
    bottom: 0,
    left: 0
  }
}));
