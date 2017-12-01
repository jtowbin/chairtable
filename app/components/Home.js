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

import Globals from '../Globals';

export default class Discover extends Component<{}> {
  constructor() {
    super();
    this.state = {
      tutorialViewed: false,
      loggedIn: false,
    };
  }

  componentWillMount() {
    // check if tutorial was viewed
    AsyncStorage.getItem(Globals.STORAGE_KEY_TUTORIAL_IS_VIEWED).then(value => {
      if (value == null) {
        // tutorial not viewed
        this.setState({
          tutorialViewed: false,
          loggedIn: false,
        });

        Actions.tutorial({type: 'reset'});
      } else {
        // check if user is logged in
        AsyncStorage.getItem(Globals.STORAGE_KEY_LOGGED_IN).then(value => {
          if (value == null) {
            // not logged in
            this.setState({
              tutorialViewed: true,
              loggedIn: false,
            });

            Actions.login({type: 'reset'});
          } else {
            // logged in
            this.setState({
              tutorialViewed: true,
              loggedIn: true,
            });

            Actions.discover();
          }
        });
      }
    });
  }

  render() {
    return null;
  }
}
