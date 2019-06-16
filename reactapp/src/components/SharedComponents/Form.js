import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  Button,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      error: null
    };

    this.passTextInput = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && this.state.error !== nextProps.error) {
      this.setState({ error: nextProps.error.msg });
    }
  }
  componentWillUpdate() {
    // console.log("componentWillUpdate");
  }
  componentDidUpdate(prevProps) {
    // console.log("componentDidUpdate", prevProps);
  }
  /*-- End lifecycle methods region */

  /*-- Handle event methods region */
  handleMainBtnClicked = () => {
    this.clearError();
    let error = !this.state.username ? "Username is required!" : null;
    error = !this.state.password ? "Password is required!" : error;
    error =
      !this.state.username && !this.state.password
        ? "Email and password are required!"
        : error;
    if (error) {
      this.setState({ error: error });
    } else {
      const body = {
        username: this.state.username,
        password: this.state.password
      };
      this.props.onMainBtnClicked(body);
    }
  };

  handleChangeText = fieldName => value => {
    this.setState({ [fieldName]: value });
  };

  handleEndEditing = editingField => event => {
    if (editingField === "username") {
      this.passTextInput.focus();
    }
    if (editingField === "password") {
      this.handleMainBtnClicked();
    }
  };
  /*--End handle event methods region--*/

  /*--Funtional methods region--*/
  clearError = () => {
    this.setState({ error: null });
  };
  /*--End Funtional methods region--*/

  render() {
    const {
      mainBtnTitle,
      accountMessage,
      subBtnTitle,
      onSubBtnClicked
    } = this.props;
    return (
      <View style={styles.formContainer}>
        <Text style={styles.error}>
          {this.state.error ? this.state.error : null}
        </Text>
        <View style={{ paddingBottom: 10 }}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            autoFocus={true}
            onChangeText={this.handleChangeText("username")}
            onSubmitEditing={event => this.passTextInput.focus()}
            returnKeyType="next"
          />
        </View>
        <View style={{ paddingBottom: 30 }}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            onChangeText={this.handleChangeText("password")}
            ref={input => {
              this.passTextInput = input;
            }}
            onSubmitEditing={this.handleMainBtnClicked}
            returnKeyType="go"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={this.handleMainBtnClicked}
        >
          <Text style={{ fontSize: 25, color: "#ffffff" }}>{mainBtnTitle}</Text>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10
          }}
        >
          <Text style={{ marginTop: 5, color: "#fff", fontSize: 20 }}>
            {accountMessage}
          </Text>
          <Button title={subBtnTitle} onPress={onSubBtnClicked} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formContainer: {
    marginTop: screenHeight * 0.1
  },
  input: {
    height: 45,
    marginVertical: 5,
    fontSize: 20,
    color: "#fff",
    borderWidth: 2,
    borderColor: "#fff",
    padding: 10,
    borderRadius: 5,
    width: screenWidth * 0.8
  },
  label: {
    fontFamily: "Cochin",
    fontSize: 25,
    color: "#ffffff"
  },
  error: {
    fontFamily: "Cochin",
    fontSize: 17,
    color: "#001EDE",
    textAlign: "center"
  },
  button: {
    borderWidth: 0,
    borderRadius: 5,
    width: screenWidth * 0.8,
    backgroundColor: "#B92DCC",
    height: 42,
    color: "#ffffff",
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = state => ({
  error: state.auth.error
});

export default connect(
  mapStateToProps,
  {}
)(Form);
