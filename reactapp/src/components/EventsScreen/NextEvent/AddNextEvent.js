import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  Button,
  ActivityIndicator,
  DatePickerIOS
} from "react-native";
import moment from "moment";
import Toast, { DURATION } from "react-native-easy-toast";
import { postEvent } from "../../../Helpers/apiHelper";

import styles from "../styles";

const NUMBER_OF_COLUMN = 3;
class AddNextEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      eventTitle: "",
      choosenDate: ""
    };
  }

  handleCloseClick = () => {
    this.props.closeCallback();
  };

  handleSaveClick = () => {
    if (!this.state.eventTitle) {
      this.refs.toast.show(
        "You must enter event title to create a next event."
      );
    } else if (!this.state.choosenDate) {
      this.refs.toast.show("You must pick a date and time for the event.");
    } else {
      this.setState({ isLoading: true });
      this.addEventToDatabase(this.state.eventTitle, this.state.choosenDate);
    }
  };

  handleDateChange = date => {
    console.log("choosenDate", date);
    const choosenDate = moment(date).format("h:mm A, MMMM Do YYYY");
    this.setState({ choosenDate }, () => console.log("state", this.state));
  };

  addEventToDatabase = (title, dateAndTime) => {
    const token = this.props.token;
    const coupleID = this.props.coupleID;
    const newEvent = { title, dateAndTime };
    const body = { coupleID, newEvent };
    postEvent(token, body)
      .then(response => {
        if (response.data) {
          console.log("Upload Memory response data", response.data);
          this.setState({ isLoading: false });
          this.props.addEventCallback(response.data.nextEvents);
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

  render() {
    const date = this.state.choosenDate
      ? moment(this.state.choosenDate, "h:mm a, MMMM Do YYYY").toDate()
      : new Date();
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
        <View
          style={{ minHeight: "10%", maxHeight: "15%", flexDirection: "row" }}
        >
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
            placeholder="Enter event title"
            multiline={true}
            numberOfLines={3}
            onChangeText={text => this.setState({ eventTitle: text })}
          />
        </View>
        <Text
          style={{
            fontFamily: "Cochin",
            fontSize: 20,
            color: "#545454",
            marginHorizontal: "10%",
            width: "80%"
          }}
        >
          Event Date
        </Text>
        <Text
          style={{
            height: 45,
            marginHorizontal: "10%",
            fontSize: 20,
            color: "#545454",
            borderWidth: 0.5,
            borderColor: "#545454",
            padding: 5,
            borderRadius: 10,
            width: "80%",
            height: "5%"
          }}
        >
          {this.state.choosenDate}
        </Text>
        <DatePickerIOS
          mode="datetime"
          date={date}
          initialDate={date}
          onDateChange={this.handleDateChange}
        />
        <View
          style={{
            height: "5%",
            width: "100%",
            position: "absolute",
            bottom: "40%",
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

export default AddNextEvent;
