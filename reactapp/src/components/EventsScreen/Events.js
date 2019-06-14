import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { connect } from "react-redux";

import Realm from "realm";
import Schema from "../../Realm";

// import Memories from "./Memories";
// import NextEvent from "./NextEvent";

import styles from "./styles";
import CustomButton from "../SharedComponents/CustomButton";

class Events extends Component {
  render() {
    return (
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <View>
            <CustomButton titleStyle={styles.buttonIcon} title="<" />
          </View>
          <View style={styles.buttonTextContainer}>
            <CustomButton
              titleStyle={styles.deactivatedTextButton}
              title="Next Events"
            />
            <CustomButton titleStyle={styles.buttonText} title="Memories" />
          </View>
          <View>
            <CustomButton
              titleStyle={styles.buttonIcon}
              title="+"
              color="#ff00ac"
            />
          </View>
        </View>
        <View>
          <Text>asdsa</Text>
        </View> */}
      </View>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(Events);
