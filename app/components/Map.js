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
  TouchableWithoutFeedback,
  ImageBackground,
  Animated
} from 'react-native';

import firebase from 'react-native-firebase';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import Globals from '../Globals.js';
import {Actions} from 'react-native-router-flux';

import RatingView from './views/RatingView';

import {fetchDisplays, fetchDisplay, toggleFavorite} from '../FirebaseHelpers';
import {getCurrentUser} from '../Helpers';

// the firebase connection to the displays data set
const displaysRef = firebase.database().ref('/' + Globals.FIREBASE_TBL_DISPLAYS);

Mapbox.setAccessToken(Globals.MAPBOX_ACCESS_TOKEN);

export default class Map extends Component<{}> {

  constructor(props) {
    super(props);

    this.state = {
      displays: [],
      selectedDisplay: null,
      activeAnnotationIndex: -1,
      previousActiveAnnotationIndex: -1,
    };
  }

  componentWillMount() {
    fetchDisplays(1, 500, (items) => {
      this.setState({displays: items});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Mapbox.MapView
            ref={(c) => {this._map = c}}
            styleURL={Mapbox.StyleURL.Dark}
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

        {/* <TouchableOpacity style={styles.addDisplayIcon} onPress={this.onCurrentLocationPressed}>
          <Image source={require('../img/current_location_icon.png')} />
        </TouchableOpacity> */}

        {/* display of the selected pin */}
        { this.state.selectedDisplay &&
          <View style={{
            position: 'absolute',
            width: '100%',
            zIndex: 1,
            bottom: 0,
            backgroundColor: 'transparent',
            alignItems: 'center'
          }}>

            <View>
              <TouchableWithoutFeedback onPress={this.onCloseDisplayPressed.bind(this)}>
                <Image
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    top: -10,
                    left: -5,
                    width: 25,
                    height: 25
                  }}
                  source={require('../img/icon_close.png')} />
              </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
               onPress={() => this.onDisplayPressed(this.state.selectedDisplay.key)}>

              <View style={{marginLeft: 10, marginRight: 10, marginBottom: 10}}>
                <View style={styles.cardView}>
                  <ImageBackground
                    source={{
                      uri: this.state.selectedDisplay.image,
                      cache: 'force-cache',
                    }}
                    style={{height: 173, backgroundColor: 'black'}}>

                    <Text numberOfLines={1} style={{
                      fontSize: 21,
                      color: 'white',
                      backgroundColor: 'transparent',
                      fontWeight: 'bold',
                      marginTop: 10,
                      marginLeft: 10,
                      marginRight: 40,
                    }}>{this.state.selectedDisplay.title}</Text>

                    <TouchableOpacity style={{zIndex: 1, position: 'absolute', top: 0, right: 0}} onPress={() => this.toggleFavoritePressed(this.state.selectedDisplay.key)}>
                      <Image source={this.state.selectedDisplay.isFavorited ? require('../img/icon_favorite_filled.png') : require('../img/icon_favorite_unfilled.png')} />
                    </TouchableOpacity>

                    <View style={{position: 'absolute', zIndex: 1, bottom: 5, left: 10, right: 10}}>
                      { this.state.selectedDisplay.starCount > 0 &&
                        <RatingView
                        rating={this.state.selectedDisplay.starCount}
                        ratingTextStyle={{color: 'white', fontWeight: 'bold', fontFamily: 'Helvetica'}}
                      />
                      }
                      <Text style={{fontSize: 14, color: 'white', backgroundColor: 'transparent', fontWeight: 'bold'}} numberOfLines={1}>{this.state.selectedDisplay.address}</Text>
                    </View>

                  </ImageBackground>

                </View>
              </View>

            </TouchableWithoutFeedback>
            </View>
          </View>
        }
      </View>
    );
  }

  renderAnnotations () {
    return this.state.displays.map((item, i) => (
      <Mapbox.PointAnnotation
        key={i}
        id={'pointAnnotation'}
        onSelected={(feature) => this.onAnnotationSelected(i, feature)}
        onDeselected={() => this.onAnnotationDeselected(i)}
        coordinate={[item.longitude, item.latitude]}>
        <View style={styles.annotationContainer}>
          <View style={styles.annotationFill} />
        </View>
        <Mapbox.Callout title={item.title}>
          <View>
          <Text>TestingTesting</Text>
        </View>
        </Mapbox.Callout>
      </Mapbox.PointAnnotation>
    ));
  }

  onAnnotationSelected (activeIndex, feature) {
    // if (this.state.activeIndex === activeIndex) {
      // return;
    // }

    this._scaleIn = new Animated.Value(0.6);
    Animated.timing(this._scaleIn, { toValue: 1.0, duration: 200 }).start();
    this.setState({
      selectedDisplay: this.state.displays[activeIndex],
      activeAnnotationIndex: activeIndex
    });

    if (this.state.previousActiveAnnotationIndex !== -1) {
      this._map.moveTo(feature.geometry.coordinates, 500);
    }
  }

  onAnnotationDeselected (deselectedIndex) {
    let nextState = {};

    if (this.state.activeAnnotationIndex === deselectedIndex) {
      nextState.activeAnnotationIndex = -1;
    }

    this._scaleOut = new Animated.Value(1);
    Animated.timing(this._scaleOut, { toValue: 0.6, duration: 200 }).start();
    nextState.previousActiveAnnotationIndex = deselectedIndex;
    this.setState(nextState);
  }

  onMenuPressed() {
    Actions.drawerOpen();
  }

  onCloseDisplayPressed() {
    this.setState({
      selectedDisplay: null
    });
  }

  onCreateDisplayPressed() {
    Actions.createDisplay();
  }

  // onCurrentLocationPressed() {
  //   this._map.setCamera({
  //     centerCoordinate: [-118.243683, 34.052235],
  //   });
  // }

  onDisplayPressed = (key: string) => {
    Actions.displayDetail({displayKey : key});
  }

  toggleFavoritePressed(displayKey: string) {
    let userId = getCurrentUser().uid;

    toggleFavorite(userId, displayKey, isFavorited => {
      this.state.selectedDisplay.isFavorited = isFavorited;
      this.setState({selectedDisplay: this.state.selectedDisplay});
    });
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
    top: 10,
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
    backgroundColor: 'green',
    transform: [{ scale: 0.6 }],
  },
  cardView: {
    flexDirection: 'column',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3
  }
});
