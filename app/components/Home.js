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
  AsyncStorage
} from 'react-native';

import {Actions, Scene, Router} from 'react-native-router-flux'
import firebase from 'react-native-firebase';

import Globals from '../Globals';
import {getCurrentUser} from '../Helpers';

export default class Discover extends Component<{}> {
  componentWillMount() {
    // check if tutorial was viewed
    AsyncStorage.getItem(Globals.STORAGE_KEY_TUTORIAL_IS_VIEWED).then(value => {
      if (value == null) {
        // tutorial not viewed
        Actions.tutorial({type: 'reset'});
      } else {
        // check if user is logged in

        let unsubscribe = firebase.auth().onAuthStateChanged(user => {
          if (user) {
            // User is signed in.
            Actions.main({type: 'reset'});
            unsubscribe();
          } else {
            // No user is signed in.
            Actions.login({type: 'reset'});
            unsubscribe();
          }
        });

        // console.log(getCurrentUser());
        // if (getCurrentUser()) {
        //   // logged in
        //   Actions.main({type: 'reset'});
        // } else {
        //   // not logged in
        //   Actions.login({type: 'reset'});
        // }
      }
    });
  }

  render() {
    return null;
  }
}
