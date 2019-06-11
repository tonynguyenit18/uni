import React, { Component } from "react";
import { View, Text } from "react-native";

class CustomText extends Component {
  render() {
    const { content, style, bgStyle } = this.props;
    return (
      <View style={bgStyle}>
        <Text style={style}>{content}</Text>
      </View>
    );
  }
}

export default CustomText;
