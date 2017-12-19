import {
  AsyncStorage
} from 'react-native';

import Globals from './Globals.js';
import FBSDK, { LoginButton, LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import {Actions} from 'react-native-router-flux';

import {userExists} from './FirebaseHelpers';

export async function markTutorialAsViewed() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_TUTORIAL_IS_VIEWED, '1');
  } catch (error) {
    // Error saving data
  }
}

export async function tutorialIsViewed() {
  let tutorialIsViewed = false;

  try {
    const value = await AsyncStorage.getItem(GLOBAL.STORAGE_KEY_TUTORIAL_IS_VIEWED);

    if (value !== null){
      tutorialIsViewed = true;
    }
  } catch (error) {
    console.log('Could not retrieve tutorial_is_viewed value');
  }

  return tutorialIsViewed;
}

export function getCurrentUser() {
  return firebase.auth().currentUser;
}

export function formatToOneDecimal(value: number): string {
  var rounded = Math.round( value * 10 ) / 10;
  return rounded.toFixed(1);
}

// calculate average rating
export function calculateAverageRating(ratings: [number]): number {
  let avgRating = 0;
  if (ratings.length) {
    let reviewsSum = ratings.reduce((total, num) => {
      return total + num;
    });
    avgRating = reviewsSum / ratings.length;
  }

  return avgRating;
}

export function fbAuth() {
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
                     // check if user exists (so we won't create it again in firebase)
                     userExists(getCurrentUser().uid, userExists => {
                       console.log('user exists: '+userExists);
                       if (!userExists) {
                         // create user
                         firebase.database().ref('users/' + getCurrentUser().uid).set({
                           email:            result.email,
                           first_name:       result.first_name,
                           last_name:        result.last_name,
                           profile_picture:  result.picture.data.url
                         });
                       }

                       // mark tutorial as viewed (if user goes to facebook login directly from tutorial)
                       AsyncStorage.setItem(Globals.STORAGE_KEY_TUTORIAL_IS_VIEWED, "1");

                       // mark user as logged in
                       AsyncStorage.setItem(Globals.STORAGE_KEY_LOGGED_IN, "1");

                       return Actions.main({type: 'reset'})
                     });
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
