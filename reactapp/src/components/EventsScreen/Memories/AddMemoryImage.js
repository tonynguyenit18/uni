import React, { Component } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  Button,
  Image,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import styles from "../styles";

import CropImagePicker from "react-native-image-crop-picker";

const NUMBER_OF_COLUMN = 3;
class AddMemoryImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: []
    };
  }

  handleCloseClick = () => {
    this.props.closeCallback();
  };

  handleAddPhotClick = () => {
    this.setState({ isLoading: true });
    CropImagePicker.openPicker({
      multiple: true,
      includeBase64: true
    }).then(images => {
      console.log(images);
      images = images.map(image => image.data);
      this.setState({ data: [...this.state.data, ...images] }, () =>
        console.log(this.state)
      );
    });
  };

  renderItem = ({ item }) => (
    <View
      style={{
        margin: 1,
        alignItems: "center",
        justifyContent: "center",
        width: Dimensions.get("window").width / NUMBER_OF_COLUMN,
        height: Dimensions.get("window").width / NUMBER_OF_COLUMN
      }}
    >
      <Image
        style={{ width: "100%", height: "100%" }}
        source={{ uri: "data:image/png;base64," + item }}
        onLoad={() => this.setState({ isLoading: false })}
      />
    </View>
  );

  render() {
    console.log(this.state);
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignContent: "center",
              zIndex: 3
            }}
          >
            <ActivityIndicator
              animating={this.state.isLoading}
              color="#ff00ac"
              size="large"
            />
          </View>
        ) : null}
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 5,
            marginTop: -10,
            zIndex: 2
          }}
        >
          <Button title="X" color="#ff00ac" onPress={this.handleCloseClick} />
        </View>
        <View style={{ height: "10%" }}>
          <TextInput style={{ width: "100%" }} placeholder="Enter album name" />
        </View>
        <View style={{ height: "95%" }}>
          <FlatList
            data={this.state.data}
            extraData={this.state}
            keyExtractor={item => item}
            renderItem={this.renderItem}
            numColumns={NUMBER_OF_COLUMN}
          />
        </View>
        <View
          style={{
            height: "5%",
            width: "100%",
            position: "absolute",
            bottom: 10,
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <Button title="Add photo" onPress={this.handleAddPhotClick} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(AddMemoryImage);
