/**
 * Password entry screen (part of the register steps)
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
import {getCurrentUser, isEmpty} from '../Helpers.js';
import {userExists} from '../FirebaseHelpers';

const appStyles = require('../Styles');

export default class RegisterPassword extends Component<{}> {
  constructor() {
    super();

    this.state = {
      password: '',
      repeatPassword: ''
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

          <Text style={appStyles.registerLabelText}>Create a password</Text>

          <View style={[appStyles.inputContainer, {marginBottom: 5}]}>
            <Image style={appStyles.inputIcon} source={require('../img/icon_input_password.png')} />
            <TextInput
              style={appStyles.inputText}
              placeholder='Password'
              placeholderTextColor = '#9A99A9'
              secureTextEntry={true}
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password}
            />
          </View>

          <View style={appStyles.inputContainer}>
            <Image style={appStyles.inputIcon} source={require('../img/icon_input_password.png')} />
            <TextInput
              style={appStyles.inputText}
              placeholder='Confirm password'
              placeholderTextColor = '#9A99A9'
              secureTextEntry={true}
              onChangeText={(text) => this.setState({repeatPassword: text})}
              value={this.state.repeatPassword}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={this.register.bind(this)}>
            <Image style={{width: 280, height: 48}} source={require('../img/round_button_login.png')} />
            <Text style={styles.submitText}>REGISTER</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }

  validate() {
    if (isEmpty(this.state.password)) {
      Alert.alert(Globals.TEXT_LOGIN_PASSWORD_REQUIRED);
      return false;
    } else if (this.state.password.length < 6) {
      Alert.alert(Globals.TEXT_REGISTER_PASSWORD_TOO_SHORT);
      return false;
    } else if (this.state.password != this.state.repeatPassword) {
      Alert.alert(Globals.TEXT_REGISTER_PASSWORDS_DIFFERENT);
      return false;
    }

    return true;
  }

  register() {
    if (!this.validate()) return;

    // we are already logged in using another provider
    // link it with the email/password provided now
    if (getCurrentUser()) {
      var emailCredential = firebase.auth.EmailAuthProvider.credential(this.props.email, this.state.password);
      getCurrentUser().linkWithCredential(emailCredential)
        .then(user => {
          Actions.main({type: 'reset'});
        }, error => {
          console.log('Account linking error', error);
        });

    } else { // create new account
      firebase.auth()
        .createUserWithEmailAndPassword(this.props.email, this.state.password)
        .then(user => {
          // check if user exists (so we won't create it again in firebase)
          userExists(user.uid, userExists => {
            if (!userExists) {
              // set user's display name
              let displayName = this.props.firstName + ' ' + this.props.lastName;
              user.updateProfile({displayName: displayName})
                .then(() => {
                  // create user
                  firebase.database().ref('users/' + getCurrentUser().uid).set({
                    email:            user.email,
                    first_name:       this.props.firstName,
                    last_name:        this.props.lastName,
                    birthday:         this.props.birthday,
                    profile_picture:  null
                  });

                  Actions.main({type: 'reset'});
                })
                .catch(function(error) {
                  console.log('updateProfile error: ' + error);
                });
            } else {
              Alert.alert(Globals.TEXT_REGISTER_USER_ALREADY_EXISTS);
            }
          });

          
        }, function(error) {
          console.log('errormsg: ' + error);

          Alert.alert(error.message);
        });
    }
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
