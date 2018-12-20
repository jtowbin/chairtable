/**
 * App's general helper functions
 */

import {
  AsyncStorage,
  Alert,
  Linking
} from 'react-native';
import getDirections from 'react-native-google-maps-directions';

import Globals from './Globals.js';
import FBSDK, { LoginButton, LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import {Actions} from 'react-native-router-flux';

import {userExists} from './FirebaseHelpers';

/**
 * Saves a local variable on the device to mark tutorial as viewed
 */
export async function markTutorialAsViewed() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_TUTORIAL_IS_VIEWED, '1');
  } catch (error) {
    // Error saving data
  }
}

/**
 * Retrieving the state of a viewed tutorial
 */
export async function tutorialIsViewed() {
  let tutorialIsViewed = false;

  try {
    const value = await AsyncStorage.getItem(GLOBAL.STORAGE_KEY_TUTORIAL_IS_VIEWED);

    if (value !== null) {
      tutorialIsViewed = true;
    }
  } catch (error) {
    console.log('Could not retrieve tutorial_is_viewed value');
  }

  return tutorialIsViewed;
}

/**
 * The logged in Firebase account
 */
export function getCurrentUser() {
  return firebase.auth().currentUser;
}

/**
 * Formatting the value to one decimal
 * @param {number} value 
 */
export function formatToOneDecimal(value: number): string {
  var rounded = Math.round( value * 10 ) / 10;
  return rounded.toFixed(1);
}

/**
 * Calculate average rating from an array of given ratings
 * @param [number] ratings
 */
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

/**
 * Re-order the location coordinates for Mapbox usage
 * @param {array} coordinate 
 */
export function convertMapboxCoordinates(coordinate) {
  return [coordinate[1], coordinate[0]];
}

/**
 * Returns true if a string is empty
 * @param {string} value 
 */
export function isEmpty(value) {
  if (value && value.trim().length > 0) {
    return false;
  }

  return true;
}

/**
 * Returns true is an email is valid
 * @param {string} text 
 */
export function isValidEmail(text) {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return (reg.test(text) !== false);
}

/**
 * Authenticates using Facebook, creates a new user in the database and goes to main screen
 */
export function loginUsingFacebook() {
  fbAuth(result => {
    // check if user exists (so we won't create it again in firebase)
    userExists(getCurrentUser().uid, userExists => {
      if (!userExists) {
        // create user
        firebase.database().ref('users/' + getCurrentUser().uid).set({
          email:            result.email,
          first_name:       result.first_name,
          last_name:        result.last_name,
          birthday:         result.birthday,
          profile_picture:  result.picture.data.url
        });
      }

      // mark tutorial as viewed (if user goes to facebook login directly from tutorial)
      AsyncStorage.setItem(Globals.STORAGE_KEY_TUTORIAL_IS_VIEWED, "1");

      return Actions.main({type: 'reset'})
    });
  }, () => {});
}

/**
 * Login using Facebook with specific permissions
 * @param {callback} successCallback 
 * @param {callback} failureCallback 
 */
export function fbAuth(successCallback, failureCallback) {
  LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_birthday']).then(function(result) {
       if (result.isCancelled) {
          console.log('Login was cancelled')
       } else {
          AccessToken.getCurrentAccessToken().then(function(accessTokenData) {
console.log('accessToken', accessTokenData);
             const credential = firebase.auth.FacebookAuthProvider.credential(accessTokenData.accessToken)
             firebase.auth().signInWithCredential(credential).then(function(result) {
                // Promise was successful
                const responseDataCallback = (error, result) => {
                   if (error) {
                      console.log(error)
                      failureCallback(error);
                   } else {
                     console.log('success');
                      successCallback(result);
                   }
                }

                const dataRequest = new GraphRequest(
                   '/me',
                   {
                      accessToken: accessTokenData.accessToken.toString(),
                      parameters: {
                         fields: {
                            string: 'id, first_name, last_name, email, picture, birthday'
                         }
                      }
                   },
                   responseDataCallback
                )

                new GraphRequestManager().addRequest(dataRequest).start()
             }, function(error) {
                // Promise was rejected
                if (error.code == 'auth/account-exists-with-different-credential') {
                  Alert.alert(Globals.TEXT_REGISTER_EMAIL_ALREADY_USED_WITH_PASSWORD);
                }

                failureCallback(error);
             })
          })
       }
    }, function(error) {
       console.log('Some error occured:' + error)
    })
}

export function openDirectionInMap(map, source, destination) {
  if (map === Globals.MAPS) {
    openDirectionWithIOSMap(source, destination);
  } else if (map === Globals.GOOGLE_MAPS) {
    openDirectionWithGoogleMap(source, destination);
  }
}

function openDirectionWithGoogleMap(source, destination) {
  const data = {
    source,
    destination,
    params: [
      {
        key: "dir_action",
        value: "navigate"       // this instantly initializes navigation using the given travel mode 
      }
    ]
  }

  getDirections(data);
}

function openDirectionWithIOSMap(source, destination) {
  Linking.openURL(`http://maps.apple.com/maps?saddr=${source.latitude}+${source.longitude}&daddr=${destination.latitude}+${destination.longitude}`)
}