import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ImageBackground,
  View,
  Text,
  Image,
  TextInput,
  Button,
  TouchableOpacity
} from "react-native";

import Realm from "realm";
import User from "../../Realm/Models/User";

import styles from "./styles";
import CoupleIDModel from "./CoupleIDModel";
import TextWithBackground from "../SharedComponents/TextWithBackground";
import ClickableImage from "../SharedComponents/ClickableImage";

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
      user: {
        _id: "",
        username: "",
        token: "",
        isLoggedIn: "",
        coupleID: "hasAValueForDefault",
        nickname: "",
        partnerNickname: "",
        phoneNo: "",
        firstDate: ""
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
        firstDate: ""
      }
    };
  }

  componentDidMount() {
    Realm.open({ schema: [User] }).then(realm => {
      console.log("REALM PATH ", realm.path);
      const token = realm.objects("User")[0].token;
      this.props.getUserInfo(token);
    });
  }

  componentDidUpdate(prevProp) {
    if (prevProp.userInfo !== this.props.userInfo) {
      this.storeUserInfoToRealm(this.props.userInfo);
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
            firstDate
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
            firstDate
          };
        }
        this.setStateToReRender();
      });
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
    }
  };

  /* ENd eandle events function */

  /*---- Util functions ----*/
  storeUserInfoToRealm = userInfo => {
    let { user, partner } = userInfo;
    user = { rowId: 0, ...user, isLoggedIn: true };
    partner = { rowId: 1, ...partner };
    Realm.open({ schema: [User] }).then(realm => {
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
    const { user, partner } = this.state;
    this.setState({ ...user, ...partner });
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
    const days = this.getDaysFrom2Days(firstDate, today);
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

  /*---- End Util functions ----*/

  render() {
    const coupleID = this.state.user;
    return (
      <ImageBackground
        source={require("../../images/bg-home.png")}
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
              <ClickableImage
                style={{
                  width: 60,
                  height: 60
                }}
                imageName="iconProfileImgDefault"
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
              <ClickableImage
                style={{
                  width: 60,
                  height: 60
                }}
                imageName="iconProfileImgDefault"
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
              />
              <ClickableImage
                style={{
                  width: 35,
                  height: 30,
                  marginHorizontal: "10%"
                }}
                imageName="iconCalender"
              />
              <ClickableImage
                style={{
                  width: 32,
                  height: 30,
                  marginHorizontal: "10%"
                }}
                imageName="iconPhone"
              />
              <ClickableImage
                style={{
                  width: 35,
                  height: 30,
                  marginHorizontal: "10%"
                }}
                imageName="iconChat"
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
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo
});

export default connect(
  mapStateToProps,
  { createCoupleID, sycnCoupleID, getUserInfo }
)(Home);
