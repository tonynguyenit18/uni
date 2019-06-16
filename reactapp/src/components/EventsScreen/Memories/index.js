import React, { Component } from "react";
import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";

class Memories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memories: null,
      loadingImageIdexArr: []
    };
  }

  componentDidMount() {
    const loadingImageIdexArr = this.props.data.memories.map(memory => true);
    this.setState({ loadingImageIdexArr, memories: this.props.data.memories });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data.memories.length != this.props.data.memories.length) {
      const loadingImageIdexArr = this.props.data.memories.map(memory => true);
      this.setState({
        loadingImageIdexArr,
        memories: this.props.data.memories
      });
    }
  }

  handleLoadedImage = index => {
    this.state.loadingImageIdexArr[index] = false;
    this.setState({ loadingImageIdexArr: this.state.loadingImageIdexArr });
  };

  renderItem = ({ item, index }) => (
    <View style={{ width: "100%", height: 180, marginTop: 10 }}>
      {this.state.loadingImageIdexArr[index] ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
            marginTop: 40,
            zIndex: 4
          }}
        >
          <ActivityIndicator animating={true} color="#ff00ac" size="small" />
        </View>
      ) : null}
      <Image
        style={{ width: null, height: null, flex: 1, opacity: 0.6 }}
        source={{ uri: item.imageUrls[0] }}
        onLoad={() => this.handleLoadedImage(index)}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={{
            maxWidth: "60%",
            textAlign: "center",
            color: "#ff00ac",
            fontSize: 25,
            fontFamily: "Cochin",
            fontWeight: "bold"
          }}
          onPress={() => this.props.eventImageClickCallback(index)}
        >
          {item.memoryName}
        </Text>
      </View>
    </View>
  );

  render() {
    return (
      <View style={{ height: "85%" }}>
        {this.state.memories && this.state.memories.length > 0 ? (
          <FlatList
            data={this.state.memories}
            extraData={this.state}
            keyExtractor={item => item._id}
            renderItem={this.renderItem}
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 25, fontWeight: "300", color: "#545454" }}>
              No memories
            </Text>
          </View>
        )}
      </View>
    );
  }
}

export default Memories;
