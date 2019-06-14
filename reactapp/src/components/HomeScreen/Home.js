import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ImageBackground,
  View,
  Text,
  Image,
  TextInput,
  Linking,
  Button,
  TouchableOpacity
} from "react-native";
import ImagePicker from "react-native-image-picker";
import { RNS3 } from "react-native-aws3";
import Toast, { DURATION } from "react-native-easy-toast";
import { StackActions, NavigationActions } from "react-navigation";

import Realm from "realm";
import Schema from "../../Realm";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "../../config";

import styles from "./styles";
import CoupleIDModel from "./CoupleIDModel";
import TextWithBackground from "../SharedComponents/TextWithBackground";
import ClickableImage from "../SharedComponents/ClickableImage";
import AsyncClickableImage from "../SharedComponents/AsyncClickableImage";

import {
  createCoupleID,
  sycnCoupleID,
  getUserInfo
} from "../../reduxActions/userActions";
class Home extends Component {
  /* Life cycle methods region */
  constructor(props) {
    super(props);
    this.state = {
      uploadImageMessage: "",
      userImageSource: null,
      partnerImageSource: null,
      bgImageSource: null,
      showOptionsPopup: false,
      pickingUserFor: "",
      user: {
        _id: "",
        username: "",
        token: "",
        isLoggedIn: "",
        coupleID: "hasAValueForDefault",
        nickname: "",
        partnerNickname: "",
        phoneNo: "",
        firstDate: "",
        backgroundUrl: ""
      },
      partner: {
        _id: "",
        username: "",
        token: "",
        isLoggedIn: "",
        coupleID: "hasAValueForDefault",
        nickname: "",
        partnerNickname: "",
        phoneNo: "",
        firstDate: "",
        backgroundUrl: ""
      }
    };
  }

  componentWillMount() {
    this.checkLogInStatus();
  }

  componentDidMount() {
    this.getUserInfo();
  }

  componentDidUpdate(prevProp) {
    this.checkLogInStatus();

    if (
      this.props.userInfo &&
      this.props.userInfo.user &&
      prevProp.userInfo != this.props.userInfo
    ) {
      this.storeUserInfoToRealm(this.props.userInfo);
      Realm.open({ schema: Schema }).then(realm => {
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
            firstDate,
            profileImageUrl,
            backgroundUrl
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
            firstDate,
            profileImageUrl,
            backgroundUrl
          };
        }
        if (realm.objects("User")[1]) {
          const {
            _id,
            username,
            token,
            isLoggedIn,
            coupleID,
            nickname,
            partnerNickname,
            phoneNo,
            firstDate,
            profileImageUrl
          } = realm.objects("User")[1];
          this.state.partner = {
            _id,
            username,
            token,
            isLoggedIn,
            coupleID,
            nickname,
            partnerNickname,
            phoneNo,
            firstDate,
            profileImageUrl
          };
        }
        this.setStateToReRender();
      });
    }
    if (
      prevProp.navigation.getParam("iconName", "NO_ICON") !==
      this.props.navigation.getParam("iconName", "NO_ICON")
    ) {
      this.getAndCheckParamsFromOtherScreen(
        this.props.navigation.getParam("iconName", "NO_ICON")
      );
    }
  }

  /*End life cycle methods region */

  /* Handle events function */
  handleCreateClickedCallBack = () => {
    this.props.createCoupleID(this.props.user.token);
  };

  handleSyncClickedCallBack = body => {
    this.props.sycnCoupleID(this.props.user.token, body);
  };

  handlEventClick = iconName => {
    switch (iconName) {
      case "iconSetting":
        if (this.props.navigation) {
          this.props.navigation.navigate("Setting");
        }
        break;
      case "iconChat":
        this.goToChat();
        break;
      case "iconPhone":
        this.makeAPhoneCall();
        break;
      default:
        console.log("Icon Image Clicked: ", iconName);
        break;
    }
  };

  handleProfileImgClick = who => imageName => {
    this.setState({ showOptionsPopup: true, pickingUserFor: who });
  };

  handleGalleryClick = () => {
    this.setState({
      showOptionsPopup: false
    });
    ImagePicker.launchImageLibrary({}, response => {
      this.processImagePickerResponse(response);
    });
  };

  handleCameraClick = () => {
    this.setState({
      showOptionsPopup: false
    });
    ImagePicker.launchCamera({}, response => {
      this.processImagePickerResponse(response);
    });
  };

  handleCancelClick = () => {
    if (this.props.navigation.getParam("iconName", "NO_ICON") === "RESET") {
      this.props.navigation.navigate("Setting");
    }
    this.setState({ showOptionsPopup: false });
  };

  /* ENd eandle events function */

  /*---- Util functions ----*/

  makeAPhoneCall = () => {
    Linking.openURL("tel: 0431462373");
  };
  goToChat = () => {
    if (this.props.navigation) {
      this.props.navigation.navigate("Chat");
    }
  };

  getUserInfo = () => {
    Realm.open({ schema: Schema }).then(realm => {
      console.log("REALM PATH ", realm.path);
      const token = realm.objects("User")[0]
        ? realm.objects("User")[0].token
        : "";
      if (token) {
        this.props.getUserInfo(token);
      }
    });
  };

  checkLogInStatus = () => {
    Realm.open({ schema: Schema }).then(realm => {
      let isLoggedIn = false;
      let user = null;
      !realm.objects("User")
        ? (isLoggedIn = false)
        : (user = realm.objects("User")[0]);
      isLoggedIn = user ? user.isLoggedIn : false;
      if (!isLoggedIn && this.props.navigation) {
        this.props.navigation.dispatch(resetAction);
      }
    });
  };

  storeUserInfoToRealm = userInfo => {
    let { user, partner } = userInfo;

    //create user and partner profile image url of aws s3 based couple ID and ID created when upload images
    const userProfileImageUrl = user
      ? `https://ios-uni-app.s3.us-east-2.amazonaws.com/profile-images/${
          user.coupleID
        }-${user._id}.png`
      : "";
    const partnerProfileImageUrl =
      user && partner
        ? `https://ios-uni-app.s3.us-east-2.amazonaws.com/profile-images/${
            user.coupleID
          }-${partner._id}.png`
        : "";

    const userBgImageUrl = user
      ? `https://ios-uni-app.s3.us-east-2.amazonaws.com/profile-images/${
          user._id
        }-background.png`
      : "";
    user = {
      rowId: 0,
      ...user,
      isLoggedIn: true,
      profileImageUrl: userProfileImageUrl,
      backgroundUrl: userBgImageUrl
    };
    partner = { rowId: 1, ...partner, profileImageUrl: partnerProfileImageUrl };
    Realm.open({ schema: Schema }).then(realm => {
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
  };

  setStateToReRender = () => {
    this.setState({ ...this.state });
  };

  calCulateDaysFromADay = givenDate => {
    const ddMMyyyyStringFormatArr = givenDate.split("/");
    const date = ddMMyyyyStringFormatArr[0];
    const month = ddMMyyyyStringFormatArr[1];
    const monthIndex = month - 1;
    const year = ddMMyyyyStringFormatArr[2];
    const firstDate = new Date();
    firstDate.setDate(date);
    firstDate.setFullYear(year);
    firstDate.setMonth(monthIndex);

    const today = new Date();
    const days = this.getDaysFrom2Days(firstDate, today) + 1;
    return days;
  };

  getDaysFrom2Days = (firstDate, secondDate) => {
    //millisecond to sencond *1000
    //second to minute  *60
    //minute to hour to sencond *60
    //hour to day *24
    const MILLISECOND_OF_1_DAY = 1000 * 60 * 60 * 24;
    const daysInMiliseconds = secondDate.getTime() - firstDate.getTime();

    const days = parseInt(daysInMiliseconds / MILLISECOND_OF_1_DAY);
    return days;
  };

  getAndCheckParamsFromOtherScreen = iconName => {
    if (iconName === "iconGalleryPink") {
      this.props.navigation.setParams({ iconName: "RESET" });
      this.setState({ showOptionsPopup: true, pickingUserFor: "background" });
    }
  };

  processImagePickerResponse = response => {
    if (response.didCancel) {
      this.handleCancelClick();
    }
    const sourceWithData = { uri: "data:image/png;base64," + response.data };
    let file = null;
    const configs = {
      keyPrefix: "profile-images/",
      bucket: "ios-uni-app",
      region: "us-east-2",
      accessKey: AWS_ACCESS_KEY_ID,
      secretKey: AWS_SECRET_ACCESS_KEY,
      successActionStatus: 201
    };
    if (this.state.pickingUserFor === "user") {
      file = {
        uri: response.uri,
        name: `${this.state.user.coupleID}-${this.state.user._id}.png`,
        type: "image/png"
      };
      this.setState({ userImageSource: sourceWithData });
    }
    if (this.state.pickingUserFor === "partner") {
      file = {
        uri: response.uri,
        name: `${this.state.partner.coupleID}-${this.state.partner._id}.png`,
        type: "image/png"
      };
      this.setState({ partnerImageSource: sourceWithData });
    }
    if (this.state.pickingUserFor === "background") {
      file = {
        uri: response.uri,
        name: `${this.state.user._id}-background.png`,
        type: "image/png"
      };
      this.setState({ bgImageSource: sourceWithData });
    }

    RNS3.put(file, configs)
      .then(response => {
        response.status == 201
          ? this.setState(
              {
                uploadImageMessage: "Changing image successfully!"
              },
              () => this.refs.toast.show(this.state.uploadImageMessage, 1000)
            )
          : this.setState(
              {
                uploadImageMessage: "Changing image unsuccessfully!",
                userImageSource: null,
                partnerImageSource: null
              },
              () => this.refs.toast.show(this.state.uploadImageMessage, 1000)
            );
      })
      .catch(err => {
        this.setState(
          {
            uploadImageMessage: err.text,
            userImageSource: null,
            partnerImageSource: null
          },
          () => this.refs.toast.show(this.state.uploadImageMessage, 1000)
        );
      });
  };

  /*---- End Util functions ----*/

  render() {
    const coupleID = this.state.user;
    return (
      <ImageBackground
        source={
          this.state.bgImageSource
            ? this.state.bgImageSource
            : this.state.user.backgroundUrl
            ? { uri: this.state.user.backgroundUrl }
            : require("../../images/bg-home.png")
        }
        style={styles.imageBackground}
      >
        {!coupleID ? (
          <React.Fragment>
            <View style={styles.fadedColorLayout} />
            <CoupleIDModel
              createClickedCallBack={this.handleCreateClickedCallBack}
              syncClickedCallBack={this.handleSyncClickedCallBack}
            />
          </React.Fragment>
        ) : null}

        <View
          style={{
            width: "100%",
            height: "100%"
          }}
          pointerEvents={this.state.showOptionsPopup ? "none" : "auto"}
        >
          <View>
            {/*--- Header ---*/}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                margin: "10%",
                justifyContent: "center"
              }}
            >
              <TextWithBackground
                content={
                  this.state.user.partnerNickname
                    ? this.state.user.partnerNickname
                    : "You"
                }
                style={styles.name}
                bgStyle={styles.textInViewBackground}
              />
              <Image
                style={{
                  width: 60,
                  height: 50,
                  marginHorizontal: "10%"
                }}
                source={require("../../images/icon-heart.png")}
              />
              <TextWithBackground
                content={
                  this.state.user.nickname ? this.state.user.nickname : "Me"
                }
                style={styles.name}
                bgStyle={styles.textInViewBackground}
              />
            </View>
            {/*--- End Header ---*/}

            {/*--- Profile Image ---*/}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: "10%"
              }}
            >
              <AsyncClickableImage
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30
                }}
                imageName="iconProfileImgDefault"
                callback={this.handleProfileImgClick("partner")}
                source={
                  this.state.partnerImageSource
                    ? this.state.partnerImageSource
                    : this.state.partner.profileImageUrl
                    ? {
                        uri: this.state.partner.profileImageUrl
                      }
                    : null
                }
              />

              <View
                style={{
                  flex: 1,
                  alignContent: "center",
                  alignItems: "center",
                  marginTop: "8%"
                }}
              >
                <Text style={{ fontSize: 17, color: "#fff", height: 30 }}>
                  Together
                </Text>
                <TextWithBackground
                  content={
                    this.state.user.firstDate
                      ? this.calCulateDaysFromADay(this.state.user.firstDate) +
                        " days"
                      : "..."
                  }
                  style={styles.name}
                  bgStyle={styles.textInViewBackground}
                />
              </View>
              <AsyncClickableImage
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30
                }}
                imageName="iconProfileImgDefault"
                callback={this.handleProfileImgClick("user")}
                source={
                  this.state.userImageSource
                    ? this.state.userImageSource
                    : this.state.user.profileImageUrl
                    ? {
                        uri: this.state.user.profileImageUrl
                      }
                    : null
                }
              />
            </View>
            {/*--- End Profile Image ---*/}
          </View>
          {/*--- Action Icons ---*/}
          <View style={styles.actionIconContainer}>
            <View style={styles.leftActionIconContainer}>
              <ClickableImage
                style={{
                  width: 35,
                  height: 30,
                  marginHorizontal: "10%"
                }}
                imageName="iconGallery"
                callback={this.handlEventClick}
              />
              <ClickableImage
                style={{
                  width: 35,
                  height: 30,
                  marginHorizontal: "10%"
                }}
                imageName="iconCalender"
                callback={this.handlEventClick}
              />
              <ClickableImage
                style={{
                  width: 32,
                  height: 30,
                  marginHorizontal: "10%"
                }}
                imageName="iconPhone"
                callback={this.handlEventClick}
              />
              <ClickableImage
                style={{
                  width: 35,
                  height: 30,
                  marginHorizontal: "10%"
                }}
                imageName="iconChat"
                callback={this.handlEventClick}
              />
            </View>
            <View style={{ width: 30 }}>
              <ClickableImage
                style={{
                  width: 35,
                  height: 30,
                  marginHorizontal: "10%"
                }}
                imageName="iconSetting"
                callback={this.handlEventClick}
              />
            </View>
          </View>
          {/*---End Action Icons ---*/}

          <Toast ref="toast" position="bottom" />
        </View>

        {/*--- 3 Buttons Popup ---*/}
        {this.state.showOptionsPopup ? (
          <View style={styles.optionsPopup}>
            <Text
              style={{ fontSize: 20, fontWeight: "600", paddingBottom: 20 }}
            >
              Open photo
            </Text>
            <View
              style={{
                width: "100%",
                borderTopColor: "#ccc",
                borderTopWidth: 0.5
              }}
            >
              <Button title="Gallary" onPress={this.handleGalleryClick} />
            </View>
            <View
              style={{
                width: "100%",
                borderTopColor: "#ccc",
                borderTopWidth: 0.5
              }}
            >
              <Button title="Camera" onPress={this.handleCameraClick} />
            </View>
            <View
              style={{
                width: "100%",
                borderTopColor: "#ccc",
                borderTopWidth: 0.5
              }}
            >
              <Button title="Cancel" onPress={this.handleCancelClick} />
            </View>
          </View>
        ) : null}

        {/*--- End 3 Buttons Popup ---*/}
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  authUserInfo: state.auth.userInfo
});

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Login" })]
});

export default connect(
  mapStateToProps,
  { createCoupleID, sycnCoupleID, getUserInfo }
)(Home);
