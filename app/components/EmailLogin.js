/**
 * Login using email and password
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

import Globals from '../Globals';
import {isEmpty, isValidEmail} from '../Helpers';

const appStyles = require('../Styles');

export default class EmailLogin extends Component<{}> {
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

          <View style={[appStyles.inputContainer, {marginBottom: 5}]}>
            <Image style={appStyles.inputIcon} source={require('../img/icon_input_email.png')} />
            <TextInput
              style={appStyles.inputText}
              autoFocus={true}
              autoCorrect={false}
              autoCapitalize='none'
              placeholder='Email address'
              placeholderTextColor = '#9A99A9'
              keyboardType = 'email-address'
              onChangeText={(text) => this.setState({email: text})}
              value={this.state.email}
            />
          </View>

          <View style={appStyles.inputContainer}>
            <Image style={appStyles.inputIcon} source={require('../img/icon_input_password.png')} />
            <TextInput
              style={appStyles.inputText}
              autoCorrect={false}
              autoCapitalize='none'
              placeholder='Password'
              placeholderTextColor='#9A99A9'
              secureTextEntry={true}
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={this.login.bind(this)}>
            <Image style={{width: 280, height: 48}} source={require('../img/round_button_login.png')} />
            <Text style={styles.submitText}>LOGIN</Text>
          </TouchableOpacity>

          <View style={{position: 'absolute', zIndex: 1, width: '100%', bottom: 40, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontFamily: 'Avenir-Heavy', color: '#9A99A9', fontSize: 14, marginBottom: 10}}>Not a member yet?</Text>

            <TouchableOpacity onPress={this.register.bind(this)}>
              <Text style={{fontFamily: 'Avenir-Heavy', color: '#00C99B', fontSize: 16}}>Register</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  }

  /**
   * Validate user's input
   */
  validate() {
    if (isEmpty(this.state.email)) {
      Alert.alert(Globals.TEXT_LOGIN_EMAIL_REQUIRED);
      return false;
    } else if (!isValidEmail(this.state.email)) {
      Alert.alert(Globals.TEXT_LOGIN_EMAIL_INVALID);
      return false;
    } else if (isEmpty(this.state.password)) {
      Alert.alert(Globals.TEXT_LOGIN_PASSWORD_REQUIRED);
      return false;
    }

    return true;
  }

  /**
   * Login using provided email and password
   */
  login() {
    if (this.validate()) {
      // sign in user
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        Actions.main({type: 'reset'});
      })
      .catch(function(error) {
        console.log(error);
        if (error.code == 'auth/user-disabled') {
          Alert.alert(Globals.TEXT_LOGIN_ACCOUNT_DISABLED);
        } else {
          Alert.alert(Globals.TEXT_LOGIN_ACCOUNT_NOT_FOUND);
        }
      });
    }
  }

  /**
   * Go to register screen
   */
  register() {
    Actions.register();
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
