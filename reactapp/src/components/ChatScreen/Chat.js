import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Animated,
  Keyboard,
  Linking
} from "react-native";
import { connect } from "react-redux";

import Realm from "realm";
import Schema from "../../Realm";

import createSocket from "../../Helpers/SocketIO";

import ClickableImage from "../SharedComponents/ClickableImage";
import TextWithBackground from "../SharedComponents/TextWithBackground";

import { getCoupleInfo } from "../../reduxActions/userActions";

import styles from "./styles";

class Chat extends Component {
  socket = null;
  chat = this;
  static navigationOptions = {
    title: "UnI",
    headerTintColor: "#ff00ac",
    headerStyle: {
      backgroundColor: "#fff"
    },
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 25,
      fontFamily: "Cochin"
    },
    headerRight: (
      <View>
        <ClickableImage
          style={{ width: 25, height: 25, marginTop: -5, marginRight: 15 }}
          imageName="iconPhonePink"
          callback={() => Linking.openURL("tel:0431462373")}
        />
      </View>
    )
  };

  /*--- Lifecycle Methods region ---*/
  constructor(props) {
    super(props);

    this.keyboardHeight = new Animated.Value(0);
    // this.imageHeight = new Animated.Value(IMAGE_HEIGHT);

    this.state = {
      currentMessage: "",
      messages: [],
      userID: "",
      partnerID: "",
      coupleID: "",
      token: ""
    };
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      "keyboardWillShow",
      this.handleKeyboardWillShow
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      "keyboardWillHide",
      this.handleKeyboardWillHide
    );
  }

  componentDidMount() {
    this.getCoupleInfo();
    this.getMessageFromRealDatabase();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.coupleInfo != this.props.coupleInfo &&
      this.props.coupleInfo
    ) {
      if (
        this.props.coupleInfo.messages &&
        this.props.coupleInfo.messages.length > 0
      ) {
        this.setState({
          messages: this.props.coupleInfo.messages.reverse()
        });
        Realm.open({ schema: Schema }).then(realm => {
          realm.write(() => {
            const realmMessages = realm.objects("Message");
            realm.delete(realmMessages);
            this.props.coupleInfo.messages.map(message => {
              realm.create("Message", message);
            });
          });
        });
      }
    }
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
    if (!this.socket) return;
    this.socket.disconnect();
  }

  /*--- End Lifecycle Methods region ---*/

  /*--- Event Action Methods region ---*/
  handleClickableImageClick = imageName => {
    switch (imageName) {
      case "iconSend":
        this.sentMessage();
        break;
      default:
        console.log("The clicked Icon Image");
    }
  };

  handleKeyboardWillShow = event => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height + 36
      })
    ]).start();
  };

  handleKeyboardWillHide = event => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0
      })
    ]).start();
  };

  /*--- End Event Action Methods region ---*/

  /*--- Util methos region ---*/
  getCoupleInfo = () => {
    Realm.open({ schema: Schema }).then(realm => {
      if (realm.objects("User")[0]) {
        const token = realm.objects("User")[0].token;
        const coupleID = realm.objects("User")[0].coupleID;
        const userID = realm.objects("User")[0]._id;
        const partnerID = realm.objects("User")[1]
          ? realm.objects("User")[1]._id
          : "";
        if (token && coupleID) {
          this.connectSocket(token, coupleID);
        }

        this.setState({ token, coupleID, userID, partnerID });

        this.props.getCoupleInfo(token, coupleID);
      }
    });
  };

  getMessageFromRealDatabase = () => {
    Realm.open({ schema: Schema }).then(realm => {
      const realmMessages = realm.objects("Message");
      const messages = this.getMessageArrFromRealResults(realmMessages);
      this.setState({ messages });
    });
  };

  connectSocket = (token, coupleID) => {
    this.socket = createSocket(token, coupleID);
    this.socket.on("connect", () => {
      if (this.socket.connected) {
        this.socket.on("sendSucceed", this.handleResponseFromEmitMsg);
        this.socket.on("newMessage", this.handleResponseFromEmitMsg);
      } else {
        this.socket = createSocket(token, coupleID);
      }
    });
    this.socket.on("disconnect", reason => {
      console.log("disconnected", this.socket.disconnected, reason);
      if (reason == "transport close") {
        this.socket = createSocket(token, coupleID);
      }
    });
  };

  handleResponseFromEmitMsg = data => {
    this.state.messages.unshift(data);
    this.setState({
      currentMessage: "",
      messages: this.state.messages
    });
  };

  sentMessage = () => {
    if (!this.socket || !this.state.currentMessage) return;
    const coupleID = this.state.coupleID;
    const userID = this.state.userID;
    const createAt = new Date().getTime();
    const content = this.state.currentMessage;
    const data = { coupleID, userID, createAt, content };
    this.socket.emit("sendMessage", data);
  };

  getMessageArrFromRealResults = realmMessages => {
    let messages = Array.prototype.map.call(realmMessages, realMessage => {
      return {
        _id: realMessage._id,
        userID: realMessage.userID,
        content: realMessage.content,
        createAt: realMessage.createAt
      };
    });
    return messages;
  };

  renderMessageItem = ({ item }) => (
    <View
      style={
        item.userID === this.state.userID
          ? styles.userMessageContainer
          : styles.partnerMessageContainer
      }
    >
      <TextWithBackground
        style={
          item.userID === this.state.userID
            ? styles.userMessage
            : styles.partnerMessage
        }
        bgStyle={
          item.userID === this.state.userID
            ? styles.userMessageBg
            : styles.partnerMessageBg
        }
        content={item.content + " "}
      />
    </View>
  );

  /*--- End Util methos region ---*/

  render() {
    return (
      <Animated.View
        style={[styles.screenContainer, { paddingBottom: this.keyboardHeight }]}
      >
        <View style={{ height: "90%", marginBottom: 10 }}>
          {this.state.messages && this.state.messages.length > 0 ? (
            <FlatList
              data={this.state.messages}
              extraData={this.state}
              renderItem={this.renderMessageItem}
              inverted
              keyExtractor={item => item.createAt + ""}
            />
          ) : null}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type here"
            multiline={true}
            autoCapitalize="sentences"
            onChangeText={text => this.setState({ currentMessage: text })}
            value={this.state.currentMessage}
          />
          <ClickableImage
            style={{ width: 30, height: 30 }}
            imageName="iconSend"
            callback={this.handleClickableImageClick}
          />
        </View>
      </Animated.View>
    );
  }
}

const mapStateToProps = state => ({
  coupleInfo: state.userInfo.coupleInfo
});

export default connect(
  mapStateToProps,
  { getCoupleInfo }
)(Chat);
