import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { connect } from "react-redux";

import Realm from "realm";
import Schema from "../../../Realm";

class NextEvent extends Component {
  render() {
    console.log("next event");
    return (
      <View style={styles.container}>
        <Text>Next Event</Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(NextEvent);
