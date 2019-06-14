import React, { Component } from "react";
import {
  ImageBackground,
  View,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";

import Realm from "realm";
import Schema from "../../Realm";

import Form from "../SharedComponents/Form";
import { login } from "../../reduxActions/authActions";
const screenHeight = Dimensions.get("window").height;

class Login extends Component {
  /*--- Lifecycle Methods Region ---*/
  componentDidUpdate(prevProp) {
    if (prevProp.userInfo != this.props.userInfo && this.props.userInfo) {
      this.storeUserInfoToRealm(this.props.userInfo);
    }
  }
  /* End lifecycle methods region */

  goToRegister = () => {
    this.props.navigation.navigate("Register");
  };

  handleLogin = body => {
    this.props.login(body);
  };

  /*Util functions */
  storeUserInfoToRealm = userInfo => {
    let { user, partner } = userInfo;
    user = { rowId: 0, ...user, isLoggedIn: true };
    partner = { rowId: 1, ...partner };
    Realm.open({ schema: Schema }).then(realm => {
      console.log("REALM PATH ", realm.path);
      if (realm.objects("User").length == 0) {
        realm.write(() => {
          realm.create("User", user);
          if (partner) {
            realm.create("User", partner);
          }
        });
      } else {
        realm.write(() => {
          realm.create("User", { rowId: 0, ...user }, true);
          if (realm.objects("User")[1]) {
            realm.create("User", { rowId: 1, ...partner }, true);
          } else {
            realm.create("User", partner);
          }
        });
      }
    });
    this.props.navigation.navigate("Home");
  };

  /*End util functions */

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
              style={{ marginTop: screenHeight * 0.15 }}
            />
            <Form
              navigation={this.props.navigation}
              mainBtnTitle="Log in"
              accountMessage="Don't have an account yet?"
              subBtnTitle="Register"
              onMainBtnClicked={this.handleLogin}
              onSubBtnClicked={this.goToRegister}
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

const mapStateToProps = state => ({
  isLoading: state.auth.isLoading,
  userInfo: state.auth.userInfo
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
