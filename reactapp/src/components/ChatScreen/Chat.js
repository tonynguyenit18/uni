import React, { Component } from "react";
import { View, Text, FlatList } from "react-native";
import ClickableImage from "../SharedComponents/AsyncClickableImage";
import { ListItem, List } from "react-native-elements";

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
          style={{
            width: 20,
            height: 20,
            marginTop: -5,
            marginRight: 15
          }}
          imageName="iconPhonePink"
        />
      </View>
    )
  };

  render() {
    const arr = [
      { title: "a" },
      { title: "b" },
      { title: "c" },
      { title: "d" },
      { title: "e" },
      { title: "f" }
    ];
    return (
      <View>
        <FlatList
          data={arr}
          title="chat"
          renderItem={({ item }) => (
            <Text style={{ color: "#ff00ac" }}>{item.title}</Text>
          )}
        />
      </View>
    );
  }
}
