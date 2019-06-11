import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

class FormField extends Component {
  onChangeText = text => {};

  render() {
    const {
      label,
      fieldKey,
      labelStyle = styles.label,
      inputStyle = styles.input,
      defaultValue,
      callback
    } = this.props;
    return (
      <View style={{ marginTop: 10 }}>
        <Text style={labelStyle}>{label}</Text>
        <TextInput
          style={inputStyle}
          value={defaultValue}
          onChangeText={text => callback(fieldKey, text)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 45,
    marginVertical: 5,
    fontSize: 20,
    color: "#545454",
    borderWidth: 0.5,
    borderColor: "#545454",
    padding: 10,
    borderRadius: 10,
    width: 260
  },
  label: {
    fontFamily: "Cochin",
    fontSize: 20,
    color: "#545454"
  }
});

export default FormField;
