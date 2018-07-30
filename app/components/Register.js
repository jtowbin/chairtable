/**
 * Email and password - final registration step
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

export default class Register extends Component<{}> {
  /**
   * Default state
   */
  constructor() {
    super();

    this.state = {
      email: '',
      password: ''
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

          <Text style={appStyles.registerLabelText}>What is your email?</Text>

          <View style={[appStyles.inputContainer, {marginBottom: 5}]}>
            <Image style={appStyles.inputIcon} source={require('../img/icon_input_email.png')} />
            <TextInput
              style={appStyles.inputText}
              autoFocus={true}
              autoCorrect={false}
              autoCapitalize='none'
              placeholder='Email address'
              placeholderTextColor = '#9A99A9'
              keyboardType='email-address'
              onChangeText={(text) => this.setState({email: text})}
              value={this.state.email}
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

  /**
   * Validate email provided by user
   */
  validate() {
    if (isEmpty(this.state.email)) {
      Alert.alert(Globals.TEXT_LOGIN_EMAIL_REQUIRED);
      return false;
    } else if (!isValidEmail(this.state.email)) {
      Alert.alert(Globals.TEXT_LOGIN_EMAIL_INVALID);
      return false;
    }

    return true;
  }

  /**
   * Proceed with authenticating registered user
   */
  next() {
    if (!this.validate()) return;

    firebase.auth()
      .fetchProvidersForEmail(this.state.email)
      .then(providers => {
        if (providers.length > 0) {
          if (providers.includes('password')) {
            // a password is already set for this email
            Alert.alert(Globals.TEXT_REGISTER_EMAIL_ALREADY_USED_WITH_PASSWORD);
          } else if (providers.includes('facebook.com')) {
            // notify that Facebook login is needed as the email address is already registered with Facebook
            Alert.alert(Globals.TEXT_REGISTER_EMAIL_ALREADY_USED_FOR_FACEBOOK, null, [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Login using Facebook', onPress: () => this.temporaryFacebookLogin()}
            ]);
          }
        } else {
          // it's the first account created with the provided email
          Actions.registerName({email: this.state.email});
        }
      }, error => {
        console.log('errormsg: ' + error);
      });
  }

  /**
   * After registration, login only temporary using Facebook
   * if Facebook is the only available provider
   */
  temporaryFacebookLogin() {
    fbAuth(result => {
      Actions.registerPassword({email: this.state.email});
    }, error => console.log(error));
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
  submitText: {
    position: 'absolute',
    zIndex: 1,
    fontFamily: 'Avenir-Heavy',
    fontSize: 12,
    color: 'white',
    backgroundColor: 'transparent'
  },
});
