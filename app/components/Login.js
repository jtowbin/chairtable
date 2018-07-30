/**
 * The login screen
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
import {loginUsingFacebook, getCurrentUser} from '../Helpers.js';
import FireBase from 'react-native-firebase';

export default class Login extends Component<{}> {
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

          <TouchableOpacity style={{marginTop: 30}} onPress={() => loginUsingFacebook()}>
              <ImageBackground resizeMode={'stretch'} style={styles.facebookButton} source={require('../img/btn_fb_blue.png')}>
                <Image style={{width: 10, height: 17, marginBottom: 1}} source={require('../img/facebook_icon.png')} />
                <Text style={{marginLeft: 15, fontFamily: 'Avenir-Heavy', fontSize: 15, backgroundColor:'transparent', color: 'white'}}>Continue with Facebook</Text>
              </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={{marginTop: 30}} onPress={() => Actions.register()}>
              <ImageBackground resizeMode={'stretch'} style={styles.facebookButton} source={require('../img/btn_round_transparent.png')}>
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
