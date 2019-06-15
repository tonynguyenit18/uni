import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { connect } from "react-redux";

import Realm from "realm";
import Schema from "../../Realm";

import Memories from "./Memories";
import NextEvent from "./NextEvent";

import styles from "./styles";
import CustomButton from "../SharedComponents/CustomButton";
import ClickableImage from "../SharedComponents/ClickableImage";
import AddMemoryImage from "./Memories/AddMemoryImage";

class Events extends Component {
  /*--- Lifecycle methods region */
  constructor(props) {
    super(props);
    this.state = {
      currentComponentIndex: 1,
      openAddMemoryImage: false
    };
  }
  /*--- End Lifecycle methods region */

  /*--- Event Action methods region */
  handleIconClick = iconName => {
    switch (iconName) {
      case "iconAddPink":
        this.openAddMemoryImage();
        break;
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
  /*--- End Event Action methods region */

  /*--- Util methods region */

  openAddMemoryImage = () => {
    this.setState({ openAddMemoryImage: true });
  };

  /*--- End Util methods region */
  render() {
    return (
      <View style={styles.container}>
        {this.state.openAddMemoryImage ? (
          <View style={styles.addMemoryImage}>
            <AddMemoryImage
              closeCallback={() => this.setState({ openAddMemoryImage: false })}
            />
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.header}>
              <View>
                <ClickableImage
                  style={styles.buttonIcon}
                  imageName="iconBackPink"
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
                  style={styles.buttonIcon}
                  imageName="iconAddPink"
                  callback={this.handleIconClick}
                />
              </View>
            </View>
            <View>
              {this.state.currentComponentIndex == 1 ? (
                <Memories />
              ) : (
                <NextEvent />
              )}
            </View>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(Events);
