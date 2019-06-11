import React, { Component } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  DatePickerIOS,
  TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import { StackActions, NavigationActions } from "react-navigation";

import FormField from "../SharedComponents/FormField";
import CustomButton from "../SharedComponents/CustomButton";
import ClickableImage from "../SharedComponents/ClickableImage";
import { clearState, updateUserInfo } from "../../reduxActions/userActions";

import Realm from "realm";
import User from "../../Realm/Models/User";

class Setting extends Component {
  /*--- Lifecycle Methods Region ---*/
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      error: null,
      openDatePicker: false,
      choosenDate: "",
      user: {
        _id: "",
        username: "",
        token: "",
        isLoggedIn: "",
        coupleID: "",
        nickname: "",
        partnerNickname: "",
        phoneNo: "",
        firstDate: ""
      }
    };
  }

  componentWillMount() {
    Realm.open({ schema: [User] }).then(realm => {
      if (realm.objects("User")[0]) {
        const {
          _id,
          username,
          token,
          isLoggedIn,
          coupleID,
          nickname,
          partnerNickname,
          phoneNo,
          firstDate
        } = realm.objects("User")[0];
        this.state.user = {
          _id,
          username,
          token,
          isLoggedIn,
          coupleID,
          nickname,
          partnerNickname,
          phoneNo,
          firstDate
        };
      }
      this.setStateToReRender();
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.userInfo && prevProps.userInfo != this.props.userInfo) {
      if (
        this.props.userInfo &&
        prevProps.userInfo.isLoading != this.props.userInfo.isLoading
      ) {
        this.state.isLoading = this.props.userInfo.isLoading;
      }
      if (
        this.props.userInfo &&
        this.props.userInfo.error &&
        prevProps.userInfo.error != this.props.userInfo.error
      ) {
        this.state.error = this.props.userInfo.error.msg;
        this.showErrorAlert();
      }
      if (
        this.props.userInfo &&
        this.props.userInfo.user &&
        prevProps.userInfo.user != this.props.userInfo.user
      ) {
        this.showSuccesAlert();
      }
      this.setStateToReRender();
    }
  }
  /*--- End Lifecycle Methods Region ---*/

  /*--- Handle Event Methods Region ---*/
  handleImageBtnClick = iconName => {
    switch (iconName) {
      case "iconLogout":
        this.logout();
        break;
    }
  };

  handleFormFieldTextChange = (fieldKey, value) => {
    this.setState({
      user: {
        ...this.state.user,
        [fieldKey]: value
      }
    });
  };

  handleBtnClick = () => {
    const { nickname, partnerNickname, phoneNo, firstDate } = this.state.user;
    const body = { nickname, partnerNickname, phoneNo, firstDate };
    this.props.updateUserInfo(this.state.user.token, body);
  };

  handleDateChange = date => {
    const dateStr = moment(date).format("DD/MM/YYYY");
    this.state.choosenDate = dateStr;
  };

  handleDoneClick = () => {
    if (this.state.choosenDate) {
      this.setState({
        openDatePicker: false,
        choosenDate: null,
        user: { ...this.state.user, firstDate: this.state.choosenDate }
      });
    } else {
      this.setState({ openDatePicker: false });
    }
  };

  handleCancelClick = () => {
    this.setState({ openDatePicker: false, choosenDate: null });
  };

  /*--- Handle Event Methods Region ---*/

  /*--- Util Methods Region ---*/
  setStateToReRender = () => {
    this.setState({ ...this.state });
  };

  logout = () => {
    Realm.open({ schema: [User] })
      .then(realm => {
        realm.write(() => {
          const allUser = realm.objects("User");
          realm.delete(allUser);
          this.props.clearState();
          if (this.props.navigation) {
            this.props.navigation.dispatch(resetAction);
          }
        });
      })
      .catch(err => console.log("Realm Error in Setting: ", err));
  };

  showSuccesAlert = () => {
    Alert.alert("Updated", "Your information is updated!", [
      {
        text: "OK",
        onPress: () => this.props.navigation.goBack()
      }
    ]);
  };

  showErrorAlert = () => {
    Alert.alert("Update failed", this.state.error, [{ text: "OK" }]);
  };

  /*--- End Util Methods Region ---*/

  render() {
    const date = this.state.user.firstDate
      ? moment(this.state.user.firstDate, "dd/MM/yyyy").toDate()
      : new Date();
    return (
      <View
        style={{
          flex: 2,
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10%"
        }}
        pointerEvents={this.state.isLoading ? "none" : "auto"}
      >
        <View style={{ width: "60%", flexDirection: "row" }}>
          <Text
            style={{
              color: "#ff00ac",
              fontSize: 20,
              marginRight: 10,
              fontFamily: "Cochin"
            }}
          >
            Couple ID:
          </Text>
          <Text
            style={{ color: "#545454", fontSize: 20, fontFamily: "Cochin" }}
          >
            {this.state.user.coupleID}
          </Text>
        </View>
        <FormField
          label="Your Nickname"
          fieldKey="nickname"
          defaultValue={this.state.user.nickname}
          callback={this.handleFormFieldTextChange}
        />
        <FormField
          label="Partner Nickname"
          fieldKey="partnerNickname"
          defaultValue={this.state.user.partnerNickname}
          callback={this.handleFormFieldTextChange}
        />
        <FormField
          label="Phone No."
          fieldKey="phoneNo"
          defaultValue={this.state.user.phoneNo}
          callback={this.handleFormFieldTextChange}
        />
        <View>
          <Text
            style={{
              fontFamily: "Cochin",
              fontSize: 20,
              color: "#545454"
            }}
          >
            First Date
          </Text>
          <Text
            style={{
              height: 45,
              marginVertical: 5,
              fontSize: 20,
              color: "#545454",
              borderWidth: 0.5,
              borderColor: "#545454",
              padding: 10,
              borderRadius: 10,
              width: 260
            }}
            onPress={() => this.setState({ openDatePicker: true })}
          >
            {this.state.user.firstDate}
          </Text>
        </View>
        <CustomButton
          style={styles.button}
          titleStyle={styles.title}
          title="Save"
          btnClickCalback={this.handleBtnClick}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "90%",
            position: "absolute",
            bottom: 20
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ClickableImage
              style={styles.imageButton}
              imageName="iconGalleryPink"
            />
            <Text style={styles.imageButtonTitle}>Set bacground</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              onPress={() => this.handleImageBtnClick("iconLogout")}
              style={styles.imageButtonTitle}
            >
              Logout
            </Text>
            <ClickableImage
              style={styles.imageButton}
              imageName="iconLogout"
              callback={this.handleImageBtnClick}
            />
          </View>
        </View>
        <ActivityIndicator
          size="large"
          color="#ff00ac"
          style={styles.indicator}
          animating={this.state.isLoading}
        />

        {this.state.openDatePicker ? (
          <View
            style={{
              backgroundColor: "#fff",
              position: "absolute",
              bottom: "-2%",
              left: 0,
              right: 0
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: "2%",
                zIndex: 2
              }}
            >
              <Text
                style={{
                  color: "#0595ff",
                  fontSize: 17,
                  marginBottom: "-6%",
                  fontFamily: "Cochin"
                }}
                onPress={this.handleCancelClick}
              >
                Cancel
              </Text>
              <Text
                style={{
                  color: "#0595ff",
                  fontSize: 17,
                  marginBottom: "-6%",
                  fontFamily: "Cochin"
                }}
                onPress={this.handleDoneClick}
              >
                Done
              </Text>
            </View>
            <DatePickerIOS
              mode="date"
              date={date}
              maximumDate={new Date()}
              initialDate={date}
              onDateChange={this.handleDateChange}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Login" })]
});

const styles = StyleSheet.create({
  button: {
    borderWidth: 0,
    borderRadius: 10,
    marginTop: 20,
    width: "60%",
    backgroundColor: "#B92DCC",
    height: 45,
    color: "#ffffff",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    marginTop: 5,
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },
  imageButton: {
    width: 35,
    height: 30
  },
  imageButtonTitle: {
    color: "#ff00ac",
    fontSize: 15,
    marginHorizontal: 10
  },
  indicator: {
    position: "absolute",
    top: "40%",
    right: "50%"
  }
});

const mapStateToProps = state => ({
  userInfo: state.userInfo
});

export default connect(
  mapStateToProps,
  { clearState, updateUserInfo }
)(Setting);
