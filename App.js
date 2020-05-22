import React, { Component } from "react";
import { View, ActivityIndicator } from "react-native";
import Register from "./Components/Register";
import * as firebase from "firebase";
import Details from "./Components/Details";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default class App extends Component {
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      "Poppins-Medium": require("./assets/Fonts/Poppins-Medium.ttf"),
      "Poppins-Bold": require("./assets/Fonts/Poppins-Bold.ttf"),
    });

    this.setState({ fontLoaded: true });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.fontLoaded ? (
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName="Register"
            >
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="Details" component={Details} />
            </Stack.Navigator>
          </NavigationContainer>
        ) : (
          <ActivityIndicator size="large"></ActivityIndicator>
        )}
      </View>
    );
  }
}
