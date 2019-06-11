import React, { Component } from "react";
import {
  ImageBackground,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";

import Form from "../SharedComponents/Form";
import { register } from "../../reduxActions/authActions";

const screenHeight = Dimensions.get("window").width;

class Register extends Component {
  onSubBtnClicked = () => {
    this.props.navigation.navigate("Login");
  };

  handleRegister = body => {
    this.props.register(body);
  };

  render() {
    const { isLoading } = this.props;
    return (
      <ImageBackground
        source={require("../../images/bg-login.png")}
        style={{
          flex: 1,
          width: "100%",
          height: "100%"
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
          accessible={true}
        >
          <View
            style={isLoading ? styles.faded : styles.container}
            pointerEvents={isLoading ? "none" : "auto"}
          >
            <Image
              source={require("../../images/app-logo.png")}
              style={{ marginTop: screenHeight * 0.2 }}
            />
            <Form
              mainBtnTitle="Register"
              accountMessage="Already have an account?"
              subBtnTitle="Log in"
              onMainBtnClicked={this.handleRegister}
              onSubBtnClicked={this.onSubBtnClicked}
            />
            <ActivityIndicator
              size="large"
              color="#fff"
              style={styles.indicator}
              animating={isLoading}
            />
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.auth.isLoading
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    opacity: 1
  },
  faded: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    opacity: 0.5
  },
  indicator: {
    position: "absolute",
    bottom: "20%",
    right: "50%"
  }
});

export default connect(
  mapStateToProps,
  { register }
)(Register);
