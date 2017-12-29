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

export default class EmailLogin extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
           backgroundColor="blue"
           barStyle="light-content"
         />

        <TouchableOpacity style={styles.backIcon} onPress={() => Actions.pop()}>
          <Image style={{width: 40, height: 40}} source={require('../img/back_icon.png')} />
        </TouchableOpacity>

        <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>

          <Text style={styles.titleText}></Text>

            <ImageBackground resizeMode={'contain'} source={require('../img/input_field_background.png')}>
              <Image style={{width: 20, height: 20, marginBottom: 5}} source={require('../img/icon_input_email.png')} />
              <Text style={{marginLeft: 15, fontFamily: 'Avenir-Heavy', fontSize: 15, backgroundColor:'transparent', color: 'white'}}>Continue with Facebook</Text>
            </ImageBackground>

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
  backIcon: {
    position: 'absolute',
    zIndex: 1,
    top: 22,
    left: 12
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
