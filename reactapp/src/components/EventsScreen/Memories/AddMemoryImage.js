import React, { Component } from "react";
import {
  View,
  TextInput,
  FlatList,
  Button,
  Image,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import styles from "../styles";

import { RNS3 } from "react-native-aws3";
import Toast from "react-native-easy-toast";

import Realm from "realm";
import Schema from "../../../Realm";

import CropImagePicker from "react-native-image-crop-picker";
import ClickableImage from "../../SharedComponents/ClickableImage";

import { postMemory } from "../../../Helpers/apiHelper";

import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "../../../config";

const NUMBER_OF_COLUMN = 3;
class AddMemoryImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      images: [],
      memoryName: ""
    };
  }

  handleCloseClick = () => {
    this.props.closeCallback();
  };

  handleSaveClick = () => {
    this.setState({ isLoading: true });
    this.uploadImages();
  };

  handleAddPhotoClick = () => {
    this.setState({ isLoading: true });
    CropImagePicker.openPicker({
      multiple: true,
      includeBase64: true
    })
      .then(images => {
        images = images.map(image => {
          return {
            data: image.data,
            uri: image.sourceURL,
            imageName: image.filename
          };
        });
        this.setState({ images: [...this.state.images, ...images] };
      })
      .catch(err => {
        console.log("Image picker err: ", err);
        this.setState({ isLoading: false });
      });
  };

  handleSucceedUpload = memories => {
    this.props.addMemorySuccedCallback(memories);
  };

  uploadImages = () => {
    if (
      !this.state.memoryName ||
      !this.state.images ||
      !this.state.images.length > 0
    ) {
      this.setState({ isLoading: false });
      this.refs.toast.show("Album name and image are both required", 2000);
      return;
    }

    if (!this.props.coupleInfo.coupleID) {
      this.setState({ isLoading: false });
      return this.refs.toast.show("CoupleID could not be found", 2000);
    }

    const uploadImagePromises = this.state.images.map((image, index) => {
      const file = {
        uri: image.uri,
        name: `${image.imageName}.png`,
        type: "image/png"
      };
      const configs = {
        keyPrefix: `memories-images/${this.props.coupleInfo.coupleID}/${
          this.state.memoryName
        }/`,
        bucket: "ios-uni-app",
        region: "us-east-2",
        accessKey: AWS_ACCESS_KEY_ID,
        secretKey: AWS_SECRET_ACCESS_KEY,
        successActionStatus: 201
      };

      return RNS3.put(file, configs);
    });

    Promise.all(uploadImagePromises)
      .then(response => {
        const checkNulLUrl = false;
        const imageUrls = response.map(item => item.body.postResponse.location);
        imageUrls.map(url => {
          if (!url) checkNulLUrl = true;
        });
        if (checkNulLUrl) {
          this.refs.toast.show(
            "Something wrong with the cloud storage. Please contact to the developer. Sorry about the inconvenient! "
          );
        }
        this.uploadMemoryToDataBase(imageUrls);
      })
      .catch(err => {
        console.log("Uploading err: ", err);
        this.setState({ isLoading: false });
      });
  };

  uploadMemoryToDataBase = imageUrls => {
    const token = this.props.token;
    const coupleID = this.props.coupleInfo.coupleID;
    const newMemory = { memoryName: this.state.memoryName, imageUrls };
    const body = { coupleID, newMemory };
    postMemory(token, body)
      .then(response => {
        if (response.data) {
          this.setState({ isLoading: false });
          this.handleSucceedUpload(response.data.memories);
        } else {
          console.log("Upload Memory response", response);
          this.setState({ isLoading: false });
        }
      })
      .catch(err => {
        console.log("Upload Memory err", err.message);
        this.setState({ isLoading: false });
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
        source={{ uri: "data:image/png;base64," + item.data }}
        onLoad={() => this.setState({ isLoading: false })}
      />
    </View>
  );

  render() {
    return (
      <View
        style={{
          ...styles.container,
          backgroundColor: "rgba(255,255,255,0.95)"
        }}
      >
        {this.state.isLoading ? (
          <View
            style={{
              position: "absolute",
              top: "10%",
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
        <View style={{ height: "10%", flexDirection: "row" }}>
          <View style={{ marginTop: "-2%" }}>
            <Button title="X" color="#ff00ac" onPress={this.handleCloseClick} />
          </View>
          <TextInput
            style={{
              width: "82%",
              backgroundColor: "#f4f4f4",
              borderRadius: 10,
              height: "50%",
              paddingHorizontal: 10,
              marginRight: 10,
              marginTop: 10
            }}
            placeholder="Enter album name"
            onChangeText={text => this.setState({ memoryName: text })}
          />
          <View>
            <ClickableImage
              style={{
                marginTop: 10,
                width: 25,
                height: 20,
                marginTop: 15
              }}
              imageName="iconGalleryPink"
              callback={this.handleAddPhotoClick}
            />
          </View>
        </View>

        <View style={{ height: "95%" }}>
          <FlatList
            data={this.state.images}
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
          <Button title="Save" onPress={this.handleSaveClick} />
        </View>
        <Toast ref="toast" position="bottom" />
      </View>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(AddMemoryImage);
