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
  ImageBackground
} from 'react-native';

import firebase from 'react-native-firebase';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import Globals from '../Globals.js';
import {Actions} from 'react-native-router-flux';

// the firebase connection to the displays data set
const displaysRef = firebase.database().ref('/' + Globals.FIREBASE_TBL_DISPLAYS);

Mapbox.setAccessToken(Globals.MAPBOX_ACCESS_TOKEN);

export default class Map extends Component<{}> {

  constructor(props) {
    super(props);

    this.state = {
      displays: [],
      refreshing: true,
    };
  }

  componentWillMount() {
    this.fetchDisplays();
  }

  // retrieving displays from the firebase data set
  fetchDisplays() {
      displaysRef
        .limitToFirst(100)
        .on('value', (snap) => {
          var items = [];
          snap.forEach((child) => {
            if (child.val().Images != null) {
              items.push({
                title: child.key,
                description: child.val().Description,
                starCount: 4.6,
                image: child.val().Images[0],
                latitude: child.val().Latitude,
                longitude: child.val().Longitude
              });

              console.log('lat: ' + child.val().Latitude + ' long: ' + child.val().Longitude)
            }
          });

          this.setState({displays: items, refreshing: false});
        });
  }

  render() {
    return (
      <View style={styles.container}>
        <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Light}
            zoomLevel={10}
            zoomEnabled={true}
            centerCoordinate={[-118.243683, 34.052235]}
            style={styles.mapbox}
            showUserLocation={true}
            userTrackingMode={2}>
            {this.renderAnnotations()}
        </Mapbox.MapView>

        <TouchableOpacity style={styles.menuIcon} onPress={this.onMenuPressed}>
          <Image source={require('../img/menu_icon.png')} />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.addDisplayIcon} onPress={this.onCreateDisplayPressed}>
          <Image source={require('../img/icon_add_display.png')} />
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.addDisplayIcon} onPress={this.onCurrentLocationPressed}>
          <Image source={require('../img/current_location_icon.png')} />
        </TouchableOpacity>

        {/* <ImageBackground style={styles.cardView}>
          <Image style={{width: '100%', height: 200, resizeMode: 'cover', marginBottom: 20}} source={{uri: item.image}} />
          <Text style={{marginLeft: 20, marginBottom: 5, fontSize: 17, fontFamily: 'Monaco'}}>{item.title}</Text>
          <View style={{marginLeft: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center'}}>
            <StarRating
              disabled={true}
              starStyle={{marginRight: 5}}
              starSize={10}
              emptyStar={require('../img/star_empty.png')}
              fullStar={item.starCount > 2.5 ? require('../img/star_full.png') : require('../img/star_full_orange.png')}
              halfStar={item.starCount > 2.5 ? require('../img/star_half.png') : require('../img/star_half_orange.png')}
              maxStars={5}
              rating={item.starCount}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
            />
            <Text style={{marginLeft: 5, fontSize: 11, color: '#B2B1C1', fontFamily: 'Monaco'}}>{item.starCount} / 5.0 * 1.3 MI NEARBY</Text>
          </View>
        </ImageBackground> */}
      </View>
    );
  }

  renderAnnotations () {
    return this.state.displays.map((item, i) => (
// console.log('lat: ' + item.latitude + ' long: ' + item.longitude)
      <Mapbox.PointAnnotation
        key={i}
        id='pointAnnotation'
        coordinate={[item.longitude, item.latitude]}>
        <View style={styles.annotationContainer}>
          <View style={styles.annotationFill} />
        </View>
        <Mapbox.Callout title='{item.title}' />
      </Mapbox.PointAnnotation>
    ));
  }

  onMenuPressed() {
    Actions.drawerOpen();
  }

  onCreateDisplayPressed() {
    Actions.createDisplay();
  }

  onCurrentLocationPressed() {

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapbox: {
    flex: 1,
  },
  menuIcon: {
    position: 'absolute',
    top: 32,
    left: 22
  },
  addDisplayIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'orange',
    transform: [{ scale: 0.6 }],
  },
});
