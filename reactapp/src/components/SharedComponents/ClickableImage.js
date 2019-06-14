import React, { Component } from "react";
import { TouchableOpacity, Image } from "react-native";
import {
  iconCalender,
  iconGallery,
  iconPhone,
  iconProfileImgDefault,
  iconSetting,
  iconChat,
  iconLogout,
  iconGalleryPink,
  iconSend,
  iconPhonePink
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
  iconSend,
  iconPhonePink
};
class ClickableImage extends Component {
  handleImageClick = () => {
    if (this.props.callback) {
      this.props.callback(this.props.imageName);
    }
  };

  render() {
    const { imageName, style, source } = this.props;
    return (
      <TouchableOpacity onPress={this.handleImageClick}>
        <Image style={style} source={source ? source : sources[imageName]} />
      </TouchableOpacity>
    );
  }
}

export default ClickableImage;
