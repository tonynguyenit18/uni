/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { Provider } from "react-redux";
import store from "./store";

//Components
import Login from "./src/components/LoginScreen/Login";
import Register from "./src/components/RegisterScreen/Register";
import Home from "./src/components/HomeScreen/Home";
import Setting from "./src/components/SettingScreen/Setting";
import Chat from "./src/components/ChatScreen/Chat";
import Events from "./src/components/EventsScreen/Events";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

const AppNavigator = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header: null,
      headerBackTitle: null
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  },
  Register: {
    screen: Register,
    navigationOptions: {
      header: null
    }
  },
  Setting: {
    screen: Setting,
    navigationOptions: {
      title: "Setting",
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: "#ff00ac"
      },
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 25,
        fontFamily: "Cochin"
      }
    }
  },
  Chat: {
    screen: Chat
  },
  Events: {
    screen: Events,
    navigationOptions: {
      header: null
    }
  }
});

const AppNavContiner = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavContiner />
      </Provider>
    );
  }
}
