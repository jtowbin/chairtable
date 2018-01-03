import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import Globals from '../Globals';
import {getCurrentUser} from '../Helpers';
import {Actions} from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import CookieManager from 'react-native-cookies';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#00ca9d'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
    marginLeft: 31
  },
  headerText: {
    color: 'white',
    fontSize: 21,
    marginLeft: 10,
  },
  userDataContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 50,
    marginLeft: 36
  },
  nameText: {
    color: 'white',
    fontSize: 20,
  },
  emailText: {
    color: 'white',
    fontSize: 13,
    marginTop: 5,
  },
  menuContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 60,
    marginLeft: 36
  },
  menuText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 25
  },
});

export default class Sidebar extends Component {
    constructor() {
      super();
      this.state = {
        email: null,
        displayName: null
      };
    }

    componentWillMount() {
      let user = getCurrentUser();

      if (user) {
        this.setState({
          email: user.email,
          displayName: user.displayName
        });
      }
    }

    render() {
        return (
            <View style={styles.container}>

              <View style={styles.headerContainer}>
                <Image source={require('../img/sidebar_app_icon.png')} />
                <Text style={styles.headerText}>
                  Rudolf
                </Text>
              </View>

              <View style={styles.userDataContainer}>
                <Text style={styles.nameText}>
                  {this.state.displayName}
                </Text>
                <Text style={styles.emailText}>
                  {this.state.email}
                </Text>
              </View>

              <View style={styles.menuContainer}>
                {/* <Text style={styles.menuText}>
                  Notifications
                </Text>
                <Text style={styles.menuText}>
                  Settings
                </Text> */}

                <TouchableOpacity onPress={this.onLogoutButtonPressed}>
                  <Text style={styles.menuText}>
                    Log out
                  </Text>
                </TouchableOpacity>

              </View>
            </View>
        );
    }

    onLogoutButtonPressed() {
      CookieManager.clearAll();
      firebase.auth().signOut();
      AsyncStorage.setItem(Globals.STORAGE_KEY_LOGGED_IN, "0");
      Actions.login({type: 'reset'});
    }
}
