import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { connect } from "react-redux";

import Realm from "realm";
import Schema from "../../../Realm";

class Memories extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Memories</Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(Memories);
