import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";

import styles from "./styles";

class CoupleIDModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coupleID: "",
      error: null
    };
  }

  handleTextChange = fieldName => value => {
    this.setState({ [fieldName]: value });
  };

  handleSyncClicked = e => {
    if (this.state.coupleID.length < 6) {
      this.setState({ error: "ID must be 6 digits" });
    } else {
      const body = {
        coupleID: this.state.coupleID
      };
      this.setState({ error: null });
      this.props.syncClickedCallBack(body);
    }
  };

  render() {
    const { createClickedCallBack, isLoading, coupleID } = this.props;
    return coupleID
      ? this.showCoupleIDModel(coupleID)
      : this.creatCoupleIDModel(createClickedCallBack, isLoading);
  }

  showCoupleIDModel = coupleID => {
    return (
      <View style={styles.coupleIdModelWithID}>
        <Text style={{ fontSize: 15, color: "#333" }}>Your couple ID</Text>
        <Text style={styles.coupleIDShowText}>{coupleID}</Text>
      </View>
    );
  };

  creatCoupleIDModel = (createClickedCallBack, isLoading) => {
    return (
      <View style={styles.coupleIdModel}>
        <Text style={styles.messageText}>
          Enter your couple ID created by your partner or create a new one and
          share with her/him.
        </Text>
        <TextInput
          style={styles.coupleIDInput}
          placeholder="Enter your couple ID"
          onChangeText={this.handleTextChange("coupleID")}
        />
        <TouchableOpacity
          style={styles.syncButton}
          onPress={this.handleSyncClicked}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#ffffff",
              fontWeight: "600",
              textAlign: "center"
            }}
          >
            Sync
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Text>Don't have a coupleID?</Text>
          <TouchableOpacity onPress={createClickedCallBack}>
            <Text style={{ color: "#0595ff", marginLeft: 5 }}>Create</Text>
          </TouchableOpacity>
        </View>
        <ActivityIndicator
          size="large"
          color="#ccc"
          style={{ marginTop: 30 }}
          animating={isLoading}
        />
      </View>
    );
  };
}

const mapStateToProps = state => ({
  isLoading: state.userInfo.isLoading,
  coupleID: state.userInfo.coupleID
});

export default connect(
  mapStateToProps,
  {}
)(CoupleIDModel);
