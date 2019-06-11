import React, { Component } from "react";
import { TouchableOpacity, Text } from "react-native";

class CustomButton extends Component {
  render() {
    const { style, btnClickCalback, title, titleStyle } = this.props;
    return (
      <TouchableOpacity style={style} onPress={() => btnClickCalback(title)}>
        <Text style={titleStyle}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

export default CustomButton;
