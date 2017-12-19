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
            console.log(child.val().favorites && child.val().favorites[getCurrentUser().uid]);
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
      };

      callback(item);
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
      console.log(snap.val());
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

  // adding the rating to current display
  let displayReviewsRef = firebaseRef.ref()
    .child(Globals.FIREBASE_TBL_DISPLAYS)
    .child(displayKey)
    .child(Globals.FIREBASE_TBL_REVIEWS)
    .child(reviewKey);

  // userReviewsRef.set(true);
  displayReviewsRef.set(rating);

  callback();
}
