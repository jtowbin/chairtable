/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import firebase from 'react-native-firebase';
import {Actions} from 'react-native-router-flux';
import Globals from './Globals';
import {getCurrentUser, calculateAverageRating} from './Helpers';

// the firebase connection to the data set
const firebaseRef = firebase.database().ref();

// const userDisplaysRef = firebase.database().ref('/user_displays');

// retrieving displays from the firebase data set
export function fetchDisplays(page: number, perPage: number, callback) {
  // userDisplaysRef.remove();
    firebaseRef.child(Globals.FIREBASE_TBL_DISPLAYS)
      .limitToFirst((page + 1) * perPage)
      .on('value', (snap) => {
        var items = [];
        snap.forEach((child) => {
          if (child.val().Images != null) {
            var isFavorited = (child.val().favorites && child.val().favorites[getCurrentUser().uid] == true);

            let avgRating = 0;
            if (child.val().user_reviews) {
              let reviews = Object.values(child.val().user_reviews);
              avgRating = calculateAverageRating(reviews);
            }

            items.push({
              key: child.key,
              title: child.val().Title,
              description: child.val().Description,
              starCount: avgRating,
              image: child.val().Images[0],
              latitude: child.val().Latitude,
              longitude: child.val().Longitude,
              address: child.val().Address,
              isFavorited: isFavorited
            });
          }

          // var values = child.val();
          // values['Title'] = child.key;
          //
          // var key = userDisplaysRef.push().key;
          // firebase.database().ref('/user_displays/' + key).set(values);
        });

        callback(items);
      });
}

// retrieving displays from the firebase data set
export function fetchDisplay(displayKey: string, callback) {
  firebaseRef.child(Globals.FIREBASE_TBL_DISPLAYS).child(displayKey)
    .on('value', (snap) => {
      var isFavorited = (snap.val().favorites && snap.val().favorites[getCurrentUser().uid] == true);

      let avgRating = 0;
      if (snap.val().user_reviews) {
        let reviews = Object.values(snap.val().user_reviews);
        avgRating = calculateAverageRating(reviews);
      }

      var item = {
        title: snap.val().Title,
        description: snap.val().Description,
        starCount: avgRating,
        image: snap.val().Images[0],
        latitude: snap.val().Latitude,
        longitude: snap.val().Longitude,
        address: snap.val().Address,
        isFavorited: isFavorited
      };

      callback(item);
    });
}

// load user's favorited displays
export function loadFavoriteDisplays(userKey: string, callback) {
  const favoriteDisplaysRef = firebaseRef
    .child(Globals.FIREBASE_TBL_USERS)
    .child(userKey)
    .child(Globals.FIREBASE_TBL_USERS_FAVORITES);

  // get list of favorited display ids for logged in user
  favoriteDisplaysRef.on('value', snapshot => {
    console.log(snapshot);
    if (snapshot.val() != null) {
      var displayIds = Object.keys(snapshot.val());

      // get details of all displays
      Promise.all(
        displayIds.map(id => {
          console.log('send request '+id);
          return firebase.database().ref(Globals.FIREBASE_TBL_DISPLAYS).child(id).once('value')
                    .then(snapshot => {
                      console.log('got response '+id);
                      return snapshot;
                    })
        })
      ).then(r => {
        var items = [];
        r.forEach(snap => {
          let avgRating = 0;
          if (snap.val().user_reviews) {
            let reviews = Object.values(snap.val().user_reviews);
            avgRating = calculateAverageRating(reviews);
          }

          items.push({
            key: snap.key,
            title: snap.val().Title,
            starCount: avgRating,
            image: snap.val().Images[0]
          });
        });

        callback(items);
      })
      .catch((error) => console.log(error));
    }
  });
}

export function toggleFavorite(userKey: string, displayKey: string, callback) {
  const userFavoritesRef = firebase.database().ref(
    Globals.FIREBASE_TBL_USERS + '/' +
    userKey + '/' +
    Globals.FIREBASE_TBL_USERS_FAVORITES + '/' + displayKey);
  const displayFavoritesRef = firebase.database().ref(
    Globals.FIREBASE_TBL_DISPLAYS + '/' +
    displayKey + '/' +
    Globals.FIREBASE_TBL_USERS_FAVORITES + '/' + userKey);

  // check if display is already favorited by current user
  displayFavoritesRef.once('value').then((snap) => {
    // value is null, so display wasn't yet favorited by this user
    if (!snap.val()) {
      // mark display as favorite
      userFavoritesRef.set(true);
      displayFavoritesRef.set(true);

      callback(true);
    } else {
      // remove display from user's favorite list
      userFavoritesRef.remove();
      displayFavoritesRef.remove();

      callback(false);
    }
  });
}

// retrieve user's feedback on a display
export function fetchRating(userKey: string, displayKey: string, callback) {
  firebaseRef.child(Globals.FIREBASE_TBL_REVIEWS)
    .orderByChild('displayUserKey')
    .equalTo(displayKey + '_' + userKey)
    .on('value', (snap) => {
      if (snap.val()) {
        let review = Object.values(snap.val())[0];
        callback(review);
      }
    });
}

// retrieve all reviews for one display
export function fetchRatingsForDisplay(displayKey: string, callback) {
  firebaseRef.child(Globals.FIREBASE_TBL_REVIEWS)
    .orderByChild('displayKey')
    .equalTo(displayKey)
    .on('value', (snap) => {
      if (snap.val()) {
        let reviews = Object.values(snap.val());

        // get details of all users
        Promise.all(
          reviews.map(review => {
            // console.log('send request '+id);
            let snapshot = firebase.database().ref(Globals.FIREBASE_TBL_USERS).child(review.userKey).once('value')
                      .then(snapshot => {
                        // let displayName = snapshot.val().first_name + ' ' + snapshot.val().last_name;
                        return snapshot;
                      })
// console.log(snapshot);
            return snapshot;
          })
        ).then(r => console.log(r) /*callback(r)*/)
        .catch((error) => console.log(error));

        callback(reviews);
      }
    });
}

// set rating for a display
export function updateRating(displayKey: string, userKey: number, rating: number, review: string, callback) {
  let reviewsRef = firebaseRef.child(Globals.FIREBASE_TBL_REVIEWS);

  var review = {
    rating: rating,
    review: review,
    date: new Date().getTime(),
    displayKey: displayKey,
    userKey: userKey,
    displayUserKey: displayKey + '_' + userKey,
    userName: getCurrentUser().displayName,
    userPhoto: getCurrentUser().photoURL
  };

  var reviewKey = reviewsRef.push().key;
  reviewsRef.child(reviewKey).set(review);

  // adding the rating to current user
  // let userReviewsRef = firebaseRef.ref()
  //   .child(Globals.FIREBASE_TBL_USERS)
  //   .child(userKey)
  //   .child(Globals.FIREBASE_TBL_REVIEWS)
  //   .child(reviewKey);
  // userReviewsRef.set(true);

  // adding the rating to current display
  let displayReviewsRef = firebaseRef
    .child(Globals.FIREBASE_TBL_DISPLAYS)
    .child(displayKey)
    .child(Globals.FIREBASE_TBL_REVIEWS)
    .child(reviewKey);

  displayReviewsRef.set(rating);

  callback();
}

export function userExists(userKey: string, callback) {
  firebaseRef
    .child(Globals.FIREBASE_TBL_USERS)
    .child(userKey)
    .on('value', (snap) => {
      let userExists = (snap.val() != null);
      callback(userExists);
    });
}
