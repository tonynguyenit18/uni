import React, { Component } from "react";
import { TouchableOpacity, Image, View } from "react-native";
import {
  iconCalender,
  iconGallery,
  iconPhone,
  iconProfileImgDefault,
  iconSetting,
  iconChat,
  iconLogout,
  iconGalleryPink,
  iconPhonePink,
  iconSend
} from "../../images";

const sources = {
  iconCalender,
  iconGallery,
  iconPhone,
  iconProfileImgDefault,
  iconSetting,
  iconChat,
  iconLogout,
  iconGalleryPink,
  iconPhonePink,
  iconSend
};
class AsyncClickableImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  onLoad = () => {
    this.setState({ loaded: true });
  };

  handleImageClick = () => {
    if (this.props.callback) {
      this.props.callback(this.props.imageName);
    }
  };

  render() {
    const { imageName, style, source } = this.props;
    const isRemoteUrl =
      source && source.uri ? source.uri.includes("s3") : false;
    return (
      <TouchableOpacity onPress={this.handleImageClick}>
        <Image
          style={
            this.state.loaded
              ? { ...style, opacity: 1 }
              : { ...style, opacity: 0 }
          }
          source={source ? source : sources[imageName]}
          onLoad={isRemoteUrl ? this.onLoad : null}
        />
        {!this.state.loaded && (
          <Image
            style={{ ...style, position: "absolute" }}
            source={sources[imageName]}
          />
        )}
      </TouchableOpacity>
    );
  }
}

export default AsyncClickableImage;
