/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';

import firebase from 'react-native-firebase';
import {Actions} from 'react-native-router-flux';

export default class Profile extends Component<{}> {

  constructor() {
    super();
    this.state = {
      displayName: null,
      profileImage: "https://facebook.github.io/react-native/docs/assets/favicon.png",
    };
  }

  componentWillMount() {
    firebase.auth().getCurrentUser().then((user) => {
      this.setState({
        displayName: user.displayName,
        profileImage: user.photoURL
      });
    }).catch((error) => {
      console.log('Some error occured:' + error)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
          <Image
            style={{width: 100, height: 100, borderRadius: 50}}
            source={{uri: this.state.profileImage}}
          />

          <Text style={{fontFamily: 'Monaco', fontSize: 24, marginTop: 10}}>
            {this.state.displayName}
          </Text>

          <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 11, color: '#9A99A9'}}>
            Seattle, Washington
          </Text>

          {/* <View>
            <Text>FAVORITE DISPLAYS</Text>
            <Text>MY REVIEWS</Text>
          </View> */}
        </View>

        <TouchableOpacity style={styles.menuIcon} onPress={this.onMenuPressed}>
          <Image source={require('../img/menu_icon.png')} />
        </TouchableOpacity>
      </View>
    );
  }

  onMenuPressed() {
    Actions.drawerOpen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'fl',
    backgroundColor: 'white'
  },
  menuIcon: {
    position: 'absolute',
    top: 32,
    left: 22
  }
});
