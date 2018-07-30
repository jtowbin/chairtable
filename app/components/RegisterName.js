/**
 * First and last name entry screen (part of the register steps)
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  AsyncStorage,
  StatusBar,
  ImageBackground,
  Alert
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import firebase from 'react-native-firebase';

import Globals from '../Globals.js';
import {fbAuth, getCurrentUser, isEmpty, isValidEmail} from '../Helpers.js';
import {userExists} from '../FirebaseHelpers';

const appStyles = require('../Styles');

export default class RegisterName extends Component<{}> {
  constructor() {
    super();

    this.state = {
      firstName: '',
      lastName: ''
    };
  }

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

        <View style={styles.logo}>
          <Image style={{width: 45, height: 45, borderRadius: 10}} source={require('../img/app_icon.png')} />
        </View>

       <View style={appStyles.registerContainer}>

          <Text style={appStyles.registerLabelText}>What is your name?</Text>

          <View style={[appStyles.inputContainer, {marginBottom: 5}]}>
            <Image style={appStyles.inputIcon} source={require('../img/icon_input_email.png')} />
            <TextInput
              style={appStyles.inputText}
              autoFocus={true}
              placeholder='First name'
              placeholderTextColor = '#9A99A9'
              onChangeText={(text) => this.setState({firstName: text})}
              value={this.state.firstName}
            />
          </View>

          <View style={appStyles.inputContainer}>
            <Image style={appStyles.inputIcon} source={require('../img/icon_input_email.png')} />
            <TextInput
              style={appStyles.inputText}
              placeholder='Last name'
              placeholderTextColor = '#9A99A9'
              onChangeText={(text) => this.setState({lastName: text})}
              value={this.state.lastName}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={this.next.bind(this)}>
            <Image style={{width: 280, height: 48}} source={require('../img/round_button_login.png')} />
            <Text style={styles.submitText}>NEXT</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }

  validate() {
    if (isEmpty(this.state.firstName)) {
      Alert.alert(Globals.TEXT_REGISTER_FIRST_NAME_REQUIRED);
      return false;
    } else if (isEmpty(this.state.lastName)) {
      Alert.alert(Globals.TEXT_REGISTER_LAST_NAME_REQUIRED);
      return false;
    }

    return true;
  }

  next() {
    if (!this.validate()) return;

    Actions.registerBirthdate({
      email: this.props.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white'//'#423747'
  },
  backIcon: {
    position: 'absolute',
    zIndex: 1,
    top: 22,
    left: 12
  },
  logo: {
    position: 'absolute',
    zIndex: 1,
    top: 70
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 315,
    height: 64,
    backgroundColor: '#FBFAFF'
  },
  inputIcon: {
    marginLeft: 22,
    marginRight: 22,
    width: 13,
    height: 14
  },
  inputText: {
    flex: 1,
    marginRight: 22,
    color: '#5F5D70',
    fontFamily: 'Avenir-Heavy'
  },
  submitText: {
    position: 'absolute',
    zIndex: 1,
    fontFamily: 'Avenir-Heavy',
    fontSize: 12,
    color: 'white',
    backgroundColor: 'transparent'
  },
});
