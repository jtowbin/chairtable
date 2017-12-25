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
  ImageBackground,
  Image,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  Dimensions
} from 'react-native';

import firebase from 'react-native-firebase';
import GeoFire from 'geofire';
import StarRating from 'react-native-star-rating';
import {Actions} from 'react-native-router-flux';
import Globals from '../Globals';
import {getCurrentUser, calculateAverageRating} from '../Helpers';
import {fetchDisplays} from '../FirebaseHelpers';
import DisplayRatingView from './views/DisplayRatingView';
import DisplayView from './views/DisplayView';

type Display = {
  key: string,
  title: string,
  description: string,
  starCount: number,
  image: string,
};

type Props = {

};

type State = {
  displays: Array<Display>,
  refreshing: boolean,
  pageOfDisplays: number,
};

// the GeoFire table that stores displays locations (used for radius search)
const geofireDisplaysRef = firebase.database().ref(Globals.FIREBASE_TBL_DISPLAYS_LOCATIONS);
const geofireRef = new GeoFire(geofireDisplaysRef);

// number of displays to load in one request to firebase
const minimumDisplaysPerPage = 5;
const radiusIncrement = 3;

const {width, height} = Dimensions.get('window');
const equalWidth = (width / 2)
const equalHeight = (height / 2)

export default class Discover extends Component<Props, State> {
  constructor() {
    super();

    this.geoQuery = undefined;
    this.searchRadius = 5;
    this.foundDisplayKeys = [];
    this.numberOfRenderedDisplays = 0;
    this.position = undefined;
    this.pageOfDisplays = 1;

    this.state = {
      displays: [],
      refreshing: true,
      pageOfDisplays: 0,
    };
  }

  componentWillMount() {
    // get user's current location
    navigator.geolocation.getCurrentPosition(position => {
        console.log('INITIAL POSITION: ' + position.coords.latitude + ' ' + position.coords.longitude);

        this.position = position;

        this.searchDisplaysBasedOnRadius(position);
      },
      (error) => {
        fetchDisplays(this.state.pageOfDisplays, minimumDisplaysPerPage, items => {
          this.setState({displays: items, refreshing: false});
        });


        this.setState({error: error.message})
      }, {
        // enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        useSignificantChanges: true,
        distanceFilter: 10
      },
    );

    // add location watch
    // this.watchId = navigator.geolocation.watchPosition(position => {
    //     console.log('NEW POSITION: ' + position.coords.latitude + ' ' + position.coords.longitude);

    //     // this.searchDisplaysBasedOnRadius(position);
    //   },
    //   (error) => this.setState({ error: error.message }),
    //   {
    //     enableHighAccuracy: true,
    //     timeout: 20000,
    //     maximumAge: 1000,
    //     useSignificantChanges: true,
    //     distanceFilter: 10
    //   },
    // );
  }

  componentWillUnmount() {
    if (this.geoQuery) this.geoQuery.cancel();
    //  navigator.geolocation.clearWatch(this.watchId);
   }

  refreshDisplays() {
    this.searchDisplaysBasedOnRadius(this.position);
  }

  searchDisplaysBasedOnRadius(position) {
    if (this.geoQuery == null) {
      console.log('geoquery null');
      // if we have no geo query yet, create a new one
      this.geoQuery = geofireRef.query({
        center: [
          position.coords.latitude, position.coords.longitude
        ],
        radius: this.searchRadius
      });

      this.attachGeoQueryCallbacks(this.geoQuery);
    } else {
      // just update the existing geo query
      this.geoQuery.updateCriteria({
        center: [position.coords.latitude, position.coords.longitude]
      });
    }
  }

  searchDisplaysByChangingRadius(newRadius) {
    if (this.geoQuery) {
      this.searchRadius = newRadius;

      this.geoQuery.updateCriteria({
        radius: newRadius,
      });
    }
  }

  attachGeoQueryCallbacks() {
    var onKeyEnteredRegistration = this.geoQuery.on("key_entered", (key, location, distance) => {
      console.log(key + " entered the query at " + distance + " km distance!");

      var value = {};
      value[key] = distance;

      this.foundDisplayKeys.push(value);
    });

    var onKeyExitedRegistration = this.geoQuery.on("key_exited", (key, location, distance) => {
      console.log(key + " exited the query at " + distance + " km distance!");

      let index = this.foundDisplayKeys.findIndex(value => Object.keys(value)[0] == key);
      if (index > -1) {
        this.foundDisplayKeys.splice(index, 1);
      }
    });

    var onReadyRegistration = this.geoQuery.on("ready", () => {
      console.log("*** 'ready' event fired - radius: " + this.searchRadius + " ***");

      // sort found displays by distance
      this.foundDisplayKeys.sort((item1, item2) => {
        let distance1 = Object.values(item1)[0];
        let distance2 = Object.values(item2)[0];

        return parseFloat(distance1) - parseFloat(distance2);
      });

      if (this.foundDisplayKeys.length < minimumDisplaysPerPage * this.pageOfDisplays) {
        // we need more displays to show the next page, increase radius
        this.searchRadius += radiusIncrement;
        console.log('new radius: ' + this.searchRadius);
      
        this.geoQuery.updateCriteria({
          radius: this.searchRadius,
        });
      } else {
        console.log('showing for radius: ' + this.searchRadius);
        this.numberOfRenderedDisplays = this.foundDisplayKeys.length;

        // calculate the corresponding page
        this.pageOfDisplays = parseInt(this.foundDisplayKeys.length / minimumDisplaysPerPage);
        console.log('page of displays: ' + this.pageOfDisplays);

        // we have enough displays to show the next page, show displays
        // this.loadDisplayItems(this.foundDisplayKeys, (items) => {
        //   this.setState({displays: items, refreshing: false});
        // });
      
        // geoQuery.cancel();
      }

      this.loadDisplayItems(this.foundDisplayKeys, (items) => {
        this.setState({displays: items, refreshing: false});
      });

      console.log(this.foundDisplayKeys);
    });
  }

  loadDisplayItems(foundDisplayKeys, callback) {
    console.log('called loadDisplayItems');

    Promise.all(
      foundDisplayKeys.map(item => {
        let displayKey = Object.keys(item)[0];
        let distance = Object.values(item)[0];

        return firebase.database().ref(Globals.FIREBASE_TBL_DISPLAYS).child(displayKey).once('value')
                  .then(snapshot => {
                    return {snapshot: snapshot, distance: distance};
                  })
      })
    ).then(r => {
      var items = [];
      r.forEach(resultItem => {
        let snap = resultItem["snapshot"];
        let distance = resultItem["distance"];

        if (snap.val()) {
          var isFavorited = (snap.val().favorites && snap.val().favorites[getCurrentUser().uid] == true);

          let avgRating = 0;
          if (snap.val().user_reviews) {
            let reviews = Object.values(snap.val().user_reviews);
            avgRating = calculateAverageRating(reviews);
          }

          items.push({
            key: snap.key,
            title: snap.val().Title,
            starCount: avgRating,
            image: snap.val().Images[0],
            distance: distance.toFixed(1),
            isFavorited: isFavorited,
          });
        }
      });

      callback(items);
    })
    .catch((error) => console.log(error));
  }

  loadMoreMessages () {
    console.log('load more');

    this.searchDisplaysByChangingRadius(this.searchRadius + radiusIncrement);
  }

  render() {
    return (
      <ImageBackground
        resizeMode={'cover'}
        source={require('../img/blurr.png')}
        style={styles.container}>

        <View style={styles.navigation}>
          <TouchableOpacity style={styles.menuIcon} onPress={this.onMenuPressed}>
            <Image source={require('../img/menu_icon.png')} />
          </TouchableOpacity>

          <Text style={styles.navigationTitle}>Discover</Text>

          <View style={{width: 40}} />
          {/* <TouchableOpacity style={styles.filterIcon}>
            <Image source={require('../img/filter_icon.png')} />
          </TouchableOpacity> */}
        </View>

        <View style={styles.dataContainer}>

          <FlatList
            showsVerticalScrollIndicator={false}
            refreshing={this.state.refreshing}
            onRefresh={() => this.refreshDisplays()}
            data={this.state.displays}
            onEndReached={this.loadMoreMessages.bind(this)}
            // onEndReachedThreshold={50000}
            keyExtractor={item => item.key}
            renderItem={({item}) =>
              <TouchableWithoutFeedback onPress={() => this.onDisplayPressed(item.key)}>
                <View>
                  <DisplayView item={item} style={styles.cardView} />
                </View>
              </TouchableWithoutFeedback>}
            />

        </View>

        { /*this.state.refreshing && this.renderLoader()*/ }
        
      </ImageBackground>
    );
  }

  renderLoader() {
    return (<ActivityIndicator
      size="large"
      color="#0000ff"
      style={{
      zIndex: 1,
      position: 'absolute',
      top: equalHeight - 36 / 2,
      left: equalWidth - 36 / 2
    }}/>);
  }

  isFavorited(displayKey: string) {
    const favoriteRef = firebase.database().ref(
      Globals.FIREBASE_TBL_USERS + '/' +
      getCurrentUser().uid + '/' +
      Globals.FIREBASE_TBL_USERS_FAVORITES + '/' + displayKey);

    return (favoriteRef != null);
  }

  onMenuPressed() {
    Actions.drawerOpen();
  }

  onDisplayPressed = (key: string) => {
    Actions.displayDetail({
      displayKey: key
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: undefined,
    // height: undefined,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'transparent'
  },
  navigation: {
    marginTop: 20,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  menuIcon: {
    marginTop: 12,
    marginLeft: 22
  },
  navigationTitle: {
    marginTop: 10,
    fontFamily: 'Monaco',
    fontSize: 16,
    color: '#35343D',
  },
  filterIcon: {
    marginTop: 12,
    marginRight: 22,
  },
  dataContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardView: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    marginTop: 4,
    flexDirection: 'column',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3
  }
});
