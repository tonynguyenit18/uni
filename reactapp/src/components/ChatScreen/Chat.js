import React, { Component } from "react";
import { View, Text, FlatList, TextInput } from "react-native";

import ClickableImage from "../SharedComponents/AsyncClickableImage";
import TextWithBackground from "../SharedComponents/TextWithBackground";

import styles from "./styles";

export default class Chat extends Component {
  static navigationOptions = {
    title: "UnI",
    headerTintColor: "#ff00ac",
    headerStyle: {
      backgroundColor: "#333"
    },
    headerStyle: {
      fontWeight: "bold",
      fontSize: 25,
      fontFamily: "Cochin"
    },
    headerRight: (
      <View>
        <ClickableImage
          style={{ width: 20, height: 20, marginTop: -5, marginRight: 15 }}
          imageName="iconPhonePink"
        />
      </View>
    )
  };

  /*--- Lifecycle Methods region ---*/
  constructor(props) {
    super(props);
    this.state = {
      arr: [
        {
          _id: "0",
          title:
            "this is a dummy text to test how the box presenting with a long text, this is a dummy text to test how the box presenting with a long text"
        },
        { _id: "1", title: "b" },
        { _id: "1", title: "c" },
        { _id: "0", title: "d" },
        { _id: "1", title: "e" },
        { _id: "0", title: "f" },
        { _id: "0", title: "a" },
        { _id: "1", title: "b" },
        { _id: "1", title: "c" },
        { _id: "0", title: "d" },
        { _id: "1", title: "e" },
        { _id: "0", title: "f" },
        { _id: "0", title: "a" },
        { _id: "1", title: "b" },
        { _id: "1", title: "c" },
        { _id: "0", title: "d" },
        { _id: "1", title: "e" },
        { _id: "0", title: "f" }
      ]
    };
  }

  /*--- End Lifecycle Methods region ---*/

  /*--- Util methos region ---*/
  renderMessageItem = ({ item }) => (
    <View
      style={
        item._id === "0"
          ? styles.userMessageContainer
          : styles.partnerMessageContainer
      }
    >
      <TextWithBackground
        style={item._id === "0" ? styles.userMessage : styles.partnerMessage}
        bgStyle={
          item._id === "0" ? styles.userMessageBg : styles.partnerMessageBg
        }
        content={item.title + " "}
      />
    </View>
  );

  /*--- End Util methos region ---*/

  render() {
    return (
      <View style={styles.screenContainer}>
        <FlatList data={this.state.arr} renderItem={this.renderMessageItem} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type here"
            multiline={true}
            autoCapitalize="sentences"
          />
          <ClickableImage
            style={{ width: 30, height: 30 }}
            imageName="iconSend"
          />
        </View>
      </View>
    );
  }
}
