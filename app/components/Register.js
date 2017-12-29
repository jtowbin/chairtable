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
  StatusBar,
  ImageBackground
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import Globals from '../Globals.js';
import {fbAuth} from '../Helpers.js';

export default class Register extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
           backgroundColor="blue"
           barStyle="light-content"
         />

        <TouchableOpacity style={{position: 'absolute', top: 30, right: 30}} onPress={() => Actions.emailLogin()}>
          <Text style={{fontFamily: 'Avenir-Medium', fontSize: 15, backgroundColor:'transparent', color: 'white'}}>Log In</Text>
        </TouchableOpacity>

        <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>

          <Image style={styles.logo} source={require('../img/deer.png')} />
          <Text style={styles.titleText}>
            <Text>Welcome to</Text>
            <Text style={{fontFamily: 'Avenir-Heavy'}}> Rudolf</Text>
          </Text>
          <Text style={styles.subtitleText}>
            <Text>Rudolf is a Christmas</Text>
            <Text style={{fontFamily: 'Avenir-Heavy'}}> enthusiast-only </Text>
            <Text>community of decorators and families from all over the world.</Text>
          </Text>

          <TouchableOpacity style={{marginTop: 30}} onPress={fbAuth}>
              <ImageBackground resizeMode={'contain'} style={styles.facebookButton} source={require('../img/btn_fb_blue.png')}>
                <Image style={{width: 20, height: 20, marginBottom: 5}} source={require('../img/facebook_icon.png')} />
                <Text style={{marginLeft: 15, fontFamily: 'Avenir-Heavy', fontSize: 15, backgroundColor:'transparent', color: 'white'}}>Continue with Facebook</Text>
              </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={{marginTop: 30}} onPress={() => Actions.register()}>
              <ImageBackground resizeMode={'contain'} style={styles.facebookButton} source={require('../img/btn_round_transparent.png')}>
                <Text style={{marginLeft: 15, fontFamily: 'Avenir-Heavy', fontSize: 15, backgroundColor:'transparent', color: 'white'}}>Create Account</Text>
              </ImageBackground>
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
    fontFamily: 'Avenir-Medium',
    fontSize: 20,
    color: 'white'
  },
  subtitleText: {
    marginTop: 30,
    textAlign: 'center',
    width: 270,
    fontFamily: 'Avenir-Medium',
    fontSize: 15,
    color: 'white',
  },
  facebookButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 280,
    height: 48,
  }
});
