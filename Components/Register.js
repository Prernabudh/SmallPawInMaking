import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TextInput,
  CheckBox,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as firebase from "firebase";
import firebaseKeys from "../config";
import * as Google from "expo-google-app-auth";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const image = require("../assets/Images/background.png");
export default class Register extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    fontLoaded: false,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.props.navigation.navigate(user ? "Details" : "Register");
    });
  }

  handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCredentials) => {
        return userCredentials.user.updateProfile({
          displayName: this.state.name,
        });
      })
      .catch((error) => this.setState({ errorMessage: error.message }));
  };

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = (googleUser) => {
    console.log("Google Auth Response", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase
      .auth()
      .onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );
        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(function (result) {
            console.log("user signed in");
            firebase
              .database()
              .ref("/users/" + result.user.uid)
              .set({
                gmail: result.user.email,
                first_name: result.additionalUserInfo.profile.given_name,
                last_name: result.additionalUserInfo.profile.family_name,
              });
          })
          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      });
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        behavior: "web",
        androidClientId:
          "494857074681-7k32s9r4tlsvmic32pc012nlj987gcjj.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={image} style={styles.image}>
          <View style={{ flex: 1, flexDirection: "row", marginTop: 90 }}>
            <TouchableOpacity style={{ marginLeft: 21 }}>
              <AntDesign name="arrowleft" size={24} color="#2A2E43" />
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: 290,
                fontSize: 14,
                fontFamily: "Poppins-Medium",
              }}
            >
              Login
            </Text>
          </View>
          <View style={styles.form}>
            <Text style={styles.signup}>Signup</Text>
            <TextInput
              placeholder="Name"
              placeholderTextColor="#767676"
              style={styles.input}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
            ></TextInput>
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#767676"
              style={styles.input}
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            ></TextInput>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#767676"
              style={styles.input}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
            ></TextInput>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#767676"
              style={styles.input}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
            ></TextInput>
            <View style={{ flexDirection: "row" }}>
              <CheckBox></CheckBox>
              <Text
                style={{
                  marginTop: 5,
                  color: "#2A2E43",
                  fontFamily: "Poppins-Medium",
                }}
              >
                I read & agree with{" "}
                <Text style={{ color: "#3ACCE1" }}>terms & policy</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={styles.bt}
              onPress={() => this.handleSignUp()}
            >
              <Text
                style={{
                  textAlign: "center",
                  paddingVertical: 16,
                  color: "#FFFFFF",
                  fontFamily: "Poppins-Medium",
                }}
              >
                Proceed
              </Text>
            </TouchableOpacity>
            <Text style={{ marginTop: 24, fontFamily: "Poppins-Medium" }}>
              Or continue with
            </Text>
            <View style={{ flexDirection: "row", marginTop: 11 }}>
              <TouchableOpacity onPress={this.signInWithGoogleAsync}>
                <Image
                  source={require("../assets/Images/google.png")}
                  style={{ marginRight: 9, width: 63, height: 63 }}
                ></Image>
              </TouchableOpacity>
              <Image source={require("../assets/Images/facebook.png")}></Image>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Text: {
    fontFamily: "Poppins-Medium",
  },
  image: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT,
    marginTop: -40,
  },
  form: {
    position: "relative",
    backgroundColor: "white",
    width: WIDTH,
    flex: 4.5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: "#00000029",
    shadowOpacity: 1,
    elevation: 50,
    alignItems: "center",
  },
  signup: {
    marginTop: 32,
    marginBottom: 20,
    textAlign: "center",
    color: "black",
    fontSize: 25,
    color: "#2A2E43",
    fontFamily: "Poppins-Bold",
  },
  input: {
    paddingLeft: 18,
    paddingVertical: 13,
    borderRadius: 5,
    backgroundColor: "#EAEAEA",
    width: 267,
    height: 43,
    marginBottom: 5,
  },
  bt: {
    marginTop: 36,
    width: 262,
    height: 51,
    borderRadius: 28,
    backgroundColor: "#3ACCE1",
    shadowColor: "#00000029",
    shadowOffset: { width: 2, height: 10 },
    elevation: 7,
  },
});
