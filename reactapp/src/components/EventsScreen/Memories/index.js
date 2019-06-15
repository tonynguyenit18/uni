import React, { Component } from "react";
import { View, Text, Image, FlatList } from "react-native";
import { connect } from "react-redux";

import Realm from "realm";
import Schema from "../../../Realm";

class Memories extends Component {
  renderItem = ({ item }) => (
    <View style={{ width: "100%", height: 180, marginTop: 10 }}>
      <Image
        style={{ width: "100%", height: "100%", opacity: 0.6 }}
        source={item.firstImageSource}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={{
            maxWidth: "60%",
            textAlign: "center",
            color: "#ff00ac",
            fontSize: 25,
            fontFamily: "Cochin",
            fontWeight: "bold"
          }}
        >
          {item.memoryName}
        </Text>
      </View>
    </View>
  );

  render() {
    console.log("prop", this.props);
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.data}
          extraData={this.props}
          keyExtractor={item => item.memoryName}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(Memories);
