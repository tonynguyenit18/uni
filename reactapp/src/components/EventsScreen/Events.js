import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";

import Realm from "realm";
import Schema from "../../Realm";

import Memories from "./Memories";
import NextEvent from "./NextEvent";

import styles from "./styles";
import CustomButton from "../SharedComponents/CustomButton";
import ClickableImage from "../SharedComponents/ClickableImage";
import AddMemoryImage from "./Memories/AddMemoryImage";
import AddNextEvent from "./NextEvent/AddNextEvent";
import MemoryImages from "./Memories/MemoryImages";

import { getCoupleInfo } from "../../reduxActions/userActions";

class Events extends Component {
  /*--- Lifecycle methods region */
  constructor(props) {
    super(props);
    this.state = {
      currentComponentIndex: 1,
      openAddMemoryImage: false,
      openMemoryImages: false,
      memoryIndex: null,
      token: "",
      coupleInfo: {
        memories: [],
        coupleID: ""
      }
    };
  }

  componentDidMount() {
    this.getCoupleInfo();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.coupleInfo != this.props.coupleInfo &&
      this.props.coupleInfo
    ) {
      this.props.coupleInfo.memories.reverse();
      this.setState({ coupleInfo: this.props.coupleInfo }, () =>
        console.log("event state", this.state)
      );
    }
  }

  /*--- End Lifecycle methods region */

  /*--- Event Action methods region */
  handleIconClick = iconName => {
    switch (iconName) {
      case "iconAddPink":
        this.openAddMemoryImage();
        break;
      case "iconBackPink":
        this.props.navigation.goBack();
      default:
        console.log("Clicked Icon Image Name: ", iconName);
    }
  };

  handleSwitchComponent = title => {
    console.log(title);
    if (title == "Memories") {
      this.setState({ currentComponentIndex: 1 });
    } else {
      this.setState({ currentComponentIndex: 0 });
    }
  };

  handleEventImageClickCallback = memoryIndex => {
    this.setState({ openMemoryImages: true, memoryIndex });
  };
  /*--- End Event Action methods region */

  /*--- Util methods region */

  openAddMemoryImage = () => {
    this.setState({ openAddMemoryImage: true });
  };

  addMemoryThumbnailToList = memories => {
    memories.reverse();
    this.setState({
      coupleInfo: { ...this.state.coupleInfo, memories },
      openAddMemoryImage: false
    });
  };

  updateEventList = nextEvents => {
    this.setState({
      coupleInfo: { ...this.state.coupleInfo, nextEvents },
      openAddMemoryImage: false
    });
  };

  getCoupleInfo = () => {
    Realm.open({ schema: Schema }).then(realm => {
      if (realm.objects("User")[0]) {
        const token = realm.objects("User")[0].token;
        const coupleID = realm.objects("User")[0].coupleID;

        this.setState(
          {
            coupleInfo: { ...this.state.coupleInfo, coupleID },
            token
          },
          () => console.log("updated State", this.state)
        );
        this.props.getCoupleInfo(token, coupleID);
      }
    });
  };

  /*--- End Util methods region */
  render() {
    return (
      <View style={{ ...styles.container, flex: 1 }}>
        <View style={styles.header}>
          <View>
            <ClickableImage
              style={styles.buttonBackIcon}
              imageName="iconBackPink"
              callback={this.handleIconClick}
            />
          </View>
          <View style={styles.buttonTextContainer}>
            <CustomButton
              titleStyle={
                this.state.currentComponentIndex === 0
                  ? styles.buttonText
                  : styles.deactivatedTextButton
              }
              title="Next Events"
              btnClickCalback={this.handleSwitchComponent}
            />
            <CustomButton
              titleStyle={
                this.state.currentComponentIndex === 1
                  ? styles.buttonText
                  : styles.deactivatedTextButton
              }
              title="Memories"
              btnClickCalback={this.handleSwitchComponent}
            />
          </View>
          <View>
            <ClickableImage
              style={styles.buttonAddIcon}
              imageName="iconAddPink"
              callback={this.handleIconClick}
            />
          </View>
        </View>

        {this.state.currentComponentIndex == 1 ? (
          <Animatable.View
            animation="slideInRight"
            iterationCount={1}
            duration={400}
            style={styles.container}
          >
            <Memories
              data={this.state.coupleInfo}
              eventImageClickCallback={this.handleEventImageClickCallback}
            />
          </Animatable.View>
        ) : (
          <Animatable.View
            animation="slideInLeft"
            iterationCount={1}
            duration={400}
            style={styles.container}
          >
            <NextEvent nextEvents={this.state.coupleInfo.nextEvents} />
          </Animatable.View>
        )}
        {this.state.openAddMemoryImage ? (
          this.state.currentComponentIndex == 1 ? (
            <Animatable.View
              animation="slideInUp"
              iterationCount={1}
              duration={200}
              style={{ ...styles.addMemoryImage, flex: 1 }}
            >
              <AddMemoryImage
                closeCallback={() =>
                  this.setState({ openAddMemoryImage: false })
                }
                addMemorySuccedCallback={this.addMemoryThumbnailToList}
                coupleInfo={this.state.coupleInfo}
                token={this.state.token}
              />
            </Animatable.View>
          ) : (
            <Animatable.View
              animation="slideInUp"
              iterationCount={1}
              duration={200}
              style={{ ...styles.addMemoryImage, flex: 1 }}
            >
              <AddNextEvent
                closeCallback={() =>
                  this.setState({ openAddMemoryImage: false })
                }
                addEventCallback={this.updateEventList}
                coupleID={this.state.coupleInfo.coupleID}
                token={this.state.token}
              />
            </Animatable.View>
          )
        ) : null}
        {(this.state.openMemoryImages && this.state.memoryIndex) ||
        this.state.memoryIndex === 0 ? (
          <Animatable.View
            animation="slideInUp"
            iterationCount={1}
            duration={200}
            style={{ ...styles.addMemoryImage, flex: 1 }}
          >
            <MemoryImages
              closeCallback={() =>
                this.setState({ openMemoryImages: false, memoryIndex: null })
              }
              memory={this.state.coupleInfo.memories[this.state.memoryIndex]}
            />
          </Animatable.View>
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  coupleInfo: state.userInfo.coupleInfo
});

export default connect(
  mapStateToProps,
  { getCoupleInfo }
)(Events);
