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

import {Actions, Scene, Router} from 'react-native-router-flux';

import Home from './app/components/Home';
import Login from './app/components/Login';
import Tutorial from './app/components/Tutorial';
import Discover from './app/components/Discover';

export default class App extends Component<{}> {

  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="home" component={Home} hideNavBar={false}/>
          <Scene key="tutorial" component={Tutorial} hideNavBar />
          <Scene key="login" component={Login} hideNavBar />
          <Scene key="discover" component={Discover} hideNavBar={false} title="Discover"/>
        </Scene>
      </Router>
    );
  }
}
