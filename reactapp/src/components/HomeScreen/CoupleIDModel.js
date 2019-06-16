import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";

import * as Animatable from "react-native-animatable";
import styles from "./styles";

class CoupleIDModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coupleID: "",
      error: null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.error && prevProps.error != this.props.error) {
      this.setState({ error: this.props.error.msg });
    }
  }

  handleTextChange = fieldName => value => {
    this.setState({ [fieldName]: value, error: null });
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
      <Animatable.View
        animation="slideInDown"
        iterationCount={1}
        duration={1300}
        style={styles.coupleIdModelWithID}
      >
        <Text style={{ fontSize: 15, color: "#333" }}>Your couple ID</Text>
        <Text style={styles.coupleIDShowText}>{coupleID}</Text>
        <View
          style={{ flexDirection: "row", position: "absolute", bottom: 10 }}
        >
          <TouchableOpacity onPress={() => this.props.closeCallback()}>
            <Text style={{ color: "#0595ff", marginLeft: 5, fontSize: 20 }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  };

  creatCoupleIDModel = (createClickedCallBack, isLoading) => {
    return (
      <Animatable.View
        animation="zoomIn"
        iterationCount={1}
        duration={500}
        style={styles.coupleIdModel}
      >
        <Text style={styles.messageText}>
          Enter your couple ID(6 digits) created by your partner or create a new
          one and share with her/him.
        </Text>
        {this.state.error ? (
          <Text
            style={{
              width: "80%",
              textAlign: "center",
              color: "#ff0000",
              marginBottom: 5
            }}
          >
            {this.state.error}
          </Text>
        ) : null}
        <TextInput
          style={styles.coupleIDInput}
          placeholder="Enter your couple ID"
          onChangeText={this.handleTextChange("coupleID")}
          autoCapitalize="characters"
          maxLength={8}
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
        <View
          style={{ flexDirection: "row", position: "absolute", bottom: 10 }}
        >
          <TouchableOpacity onPress={() => this.props.logout()}>
            <Text style={{ color: "#0595ff", marginLeft: 5, fontSize: 20 }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
        <ActivityIndicator
          size="large"
          color="#ff00ac"
          style={{ marginBottom: 30 }}
          animating={isLoading}
        />
      </Animatable.View>
    );
  };
}

const mapStateToProps = state => ({
  isLoading: state.userInfo.isLoading,
  error: state.userInfo.error
});

export default connect(
  mapStateToProps,
  {}
)(CoupleIDModel);
