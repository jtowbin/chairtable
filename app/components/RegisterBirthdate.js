/**
 * Birthday entry screen (part of the register steps)
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
import DatePicker from 'react-native-datepicker';

import Globals from '../Globals.js';
import {fbAuth, getCurrentUser, isEmpty} from '../Helpers.js';
import {userExists} from '../FirebaseHelpers';

const appStyles = require('../Styles');

export default class RegisterBirthdate extends Component<{}> {
  constructor() {
    super();

    this.state = {
      birthday: '',
    };
  }

  componentDidMount() {
    this.picker.onPressDate();
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

          <Text style={appStyles.registerLabelText}>When is your birthday?</Text>

          <View style={[appStyles.inputContainer, {marginBottom: 5}]}>
            <DatePicker
              ref={picker => this.picker = picker}
              style={{width: '100%'}}
              date={this.state.birthday}
              mode="date"
              placeholder="Birthday"
              format="MM/DD/YYYY"
              minDate="01/01/1900"
              maxDate="01/01/2016"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 22,
                  width: 15,
                  height: 15,
                },
                dateInput: {
                  marginLeft: 44+15,
                  borderColor: 'transparent',
                  alignItems: 'flex-start',
                },
                placeholderText : {
                  color: '#5F5D70',
                },
                datePicker: {
                  borderTopWidth: 0
                },
              }}
              onDateChange={date => {this.setState({birthday: date})}} />

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
    if (isEmpty(this.state.birthday)) {
      Alert.alert(Globals.TEXT_REGISTER_BIRTHDATE_REQUIRED);
      return false;
    }

    return true;
  }

  next() {
    if (!this.validate()) return;

    Actions.registerPassword({
      email: this.props.email,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      birthday: this.state.birthday
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
  submitText: {
    position: 'absolute',
    zIndex: 1,
    fontFamily: 'Avenir-Heavy',
    fontSize: 12,
    color: 'white',
    backgroundColor: 'transparent'
  },
});
