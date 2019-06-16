import React, { Component } from "react";
import { View, FlatList, Text } from "react-native";

class NextEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextEvents: null
    };
  }

  componentDidMount() {
    this.setState({ nextEvents: this.props.nextEvents });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nextEvents.length != this.props.nextEvents.length) {
      this.setState({ nextEvents: this.props.nextEvents });
    }
  }

  renderItem = ({ item }) => (
    <View
      style={{
        width: "90%",
        minHeight: 100,
        marginTop: 10,
        marginHorizontal: "5%",
        backgroundColor: "#f4f4f4",
        borderRadius: 20,
        paddingVertical: 10,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center"
      }}
    >
      <Text
        style={{
          maxWidth: "80%",
          textAlign: "center",
          color: "#ff00ac",
          fontSize: 20,
          fontFamily: "Cochin",
          fontWeight: "bold",
          paddingVertical: 5
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{
          maxWidth: "80%",
          textAlign: "center",
          color: "#545454",
          fontSize: 15,
          fontFamily: "Cochin",
          paddingVertical: 5
        }}
      >
        {item.dateAndTime}
      </Text>
    </View>
  );

  render() {
    console.log("next event", this.state);
    return (
      <View style={{ height: "85%" }}>
        {this.state.nextEvents && this.state.nextEvents.length > 0 ? (
          <FlatList
            data={this.state.nextEvents}
            extraData={this.state}
            keyExtractor={item => item._id}
            renderItem={this.renderItem}
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 25, fontWeight: "300", color: "#545454" }}>
              No events
            </Text>
          </View>
        )}
      </View>
    );
  }
}

export default NextEvent;
