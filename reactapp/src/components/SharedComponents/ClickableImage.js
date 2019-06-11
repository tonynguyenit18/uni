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
  iconGalleryPink
} from "../../images";

const source = {
  iconCalender,
  iconGallery,
  iconPhone,
  iconProfileImgDefault,
  iconSetting,
  iconChat,
  iconLogout,
  iconGalleryPink
};
class ClickableImage extends Component {
  handleImageClick = () => {
    if (this.props.callback) {
      this.props.callback(this.props.imageName);
    }
  };

  render() {
    const { imageName, style, callback } = this.props;
    return (
      <TouchableOpacity onPress={this.handleImageClick}>
        <Image style={style} source={source[imageName]} />
      </TouchableOpacity>
    );
  }
}

export default ClickableImage;
