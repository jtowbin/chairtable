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

import Globals from '../Globals.js';
import {Actions} from 'react-native-router-flux';
import FBSDK, { LoginButton, LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';

export default class Login extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
          <Image source={require('../img/deer_3x.png')} />

          <TouchableOpacity onPress={this.fbAuth}>
              <Image source={require('../img/facebook_login_btn.png')} />
          </TouchableOpacity>
      </View>
    );
  }

  fbAuth() {
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(function(result) {
         if (result.isCancelled) {
            console.log('Login was cancelled')
         } else {
            AccessToken.getCurrentAccessToken().then(function(accessTokenData) {

               const credential = firebase.auth.FacebookAuthProvider.credential(accessTokenData.accessToken)
               firebase.auth().signInWithCredential(credential).then(function(result) {
                  // Promise was successful

                  const responseDataCallback = (error, result) => {
                     if (error) {
                        console.log(error)
                     } else {
                        firebase.database().ref('users/' + result.id).set({
                          email:            result.email,
                          first_name:       result.first_name,
                          last_name:        result.last_name,
                          profile_picture:  result.picture.data.url
                        });

                        // mark user as logged in
                        AsyncStorage.setItem(Globals.STORAGE_KEY_LOGGED_IN, "1");

                        return Actions.home({type: 'reset'})
                     }
                  }

                  const dataRequest = new GraphRequest(
                     '/me',
                     {
                        accessToken: accessTokenData.accessToken.toString(),
                        parameters: {
                           fields: {
                              string: 'id, first_name, last_name, email, picture'
                           }
                        }
                     },
                     responseDataCallback
                  )

                  new GraphRequestManager().addRequest(dataRequest).start()
               }, function(error) {
                  // Promise was rejected
                  console.log(error)
               })
            })
         }
      }, function(error) {
         console.log('Some error occured:' + error)
      })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#423747'
  },
});
