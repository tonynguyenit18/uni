import React, { Component } from "react";
import {
  View,
  FlatList,
  Button,
  Image,
  Dimensions,
  ActivityIndicator
} from "react-native";
import styles from "../styles";

const NUMBER_OF_COLUMN = 3;
class MemoryImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memory: null,
      loadingImageIdexArr: []
    };
  }

  componentDidMount() {
    const loadingImageIdexArr = this.props.memory.imageUrls.map(imgae => true);
    this.setState({ loadingImageIdexArr, memory: this.props.memory }, () =>
      console.log(loadingImageIdexArr)
    );
  }

  handleCloseClick = () => {
    this.props.closeCallback();
  };

  handleImageLoaded = index => {
    this.state.loadingImageIdexArr[index] = false;
    this.setState({ loadingImageIdexArr: this.state.loadingImageIdexArr });
  };

  renderItem = ({ item, index }) => (
    <View
      style={{
        margin: 1,
        backgroundColor: "#f4f4f4",
        alignItems: "center",
        justifyContent: "center",
        width: Dimensions.get("window").width / NUMBER_OF_COLUMN,
        height: Dimensions.get("window").width / NUMBER_OF_COLUMN
      }}
    >
      <Image
        style={{ width: "100%", height: "100%" }}
        source={{ uri: item }}
        onLoad={() => this.handleImageLoaded(index)}
      />
      {this.state.loadingImageIdexArr[index] ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator animating={true} color="#ff00ac" size="small" />
        </View>
      ) : null}
    </View>
  );

  render() {
    return (
      <View
        style={{
          ...styles.container,
          backgroundColor: "#fff"
        }}
      >
        <View style={{ marginTop: "-2%" }}>
          <Button title="X" color="#ff00ac" onPress={this.handleCloseClick} />
        </View>
        {this.state.memory ? (
          <View style={{ height: "95%" }}>
            <FlatList
              data={this.state.memory.imageUrls}
              extraData={this.state}
              keyExtractor={(item, i) => i}
              renderItem={this.renderItem}
              numColumns={NUMBER_OF_COLUMN}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

export default MemoryImages;
