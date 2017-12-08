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
  AsyncStorage,
  StatusBar
} from 'react-native';

import Globals from '../Globals.js';
import {fbAuth} from '../Helpers.js';

export default class Login extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
           backgroundColor="blue"
           barStyle="light-content"
         />

        <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
          <Image style={styles.logo} source={require('../img/deer.png')} />
          <Text style={styles.titleText}>Welcome to Rudolf</Text>
          <Text style={styles.subtitleText}>Rudof is a Christmas enthusiast-only community of decorators and families from all over the world.</Text>
        </View>

        <View style={{height: 150}}>
          <TouchableOpacity onPress={fbAuth}>
              <Image style={styles.facebookButton} source={require('../img/facebook_login_btn.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#423747'
  },
  logo: {
    marginTop: 140,
  },
  titleText: {
    marginTop: 15,
    fontFamily: 'Avenir-Heavy',
    fontSize: 20,
    color: 'white'
  },
  subtitleText: {
    marginTop: 30,
    textAlign: 'center',
    width: 270,
    fontFamily: 'Avenir-Heavy',
    fontSize: 15,
    color: 'white',
  },
  facebookButton: {
    width: 200,
    height: 40
  }
});
