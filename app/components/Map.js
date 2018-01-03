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
  Animated,
  Alert
} from 'react-native';

import firebase from 'react-native-firebase';
import GeoFire from 'geofire';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import Globals from '../Globals.js';
import {Actions} from 'react-native-router-flux';

import RatingView from './views/RatingView';

import {fetchDisplays, fetchDisplay, toggleFavorite} from '../FirebaseHelpers';
import {getCurrentUser, convertMapboxCoordinates} from '../Helpers';
// import { feature } from '@turf/helpers';

import turf from 'turf';
import debounce from 'debounce';
import GeoViewport from '@mapbox/geo-viewport';

// the firebase connection to the displays data set
const displaysRef = firebase.database().ref('/' + Globals.FIREBASE_TBL_DISPLAYS);

// the GeoFire table that stores displays locations (used for radius search)
const geofireDisplaysRef = firebase.database().ref(Globals.FIREBASE_TBL_DISPLAYS_LOCATIONS);
const geofireRef = new GeoFire(geofireDisplaysRef);

Mapbox.setAccessToken(Globals.MAPBOX_ACCESS_TOKEN);

const layerStyles = Mapbox
  .StyleSheet
  .create({
    singlePoint: {
      circleColor: 'green',
      circleOpacity: 0.84,
      circleStrokeWidth: 2,
      circleStrokeColor: 'white',
      circleRadius: 5,
      circlePitchAlignment: Mapbox.CirclePitchAlignment.Map
    },

    clusteredPoints: {
      circlePitchAlignment: Mapbox.CirclePitchAlignment.Map,
      circleColor: Mapbox
        .StyleSheet
        .source([
          [
            25, 'yellow'
          ],
          [
            50, 'red'
          ],
          [
            75, 'blue'
          ],
          [
            100, 'orange'
          ],
          [
            300, 'pink'
          ],
          [750, 'white']
        ], 'point_count', Mapbox.InterpolationMode.Exponential),

      circleRadius: Mapbox
        .StyleSheet
        .source([
          [
            0, 15
          ],
          [
            100, 20
          ],
          [750, 30]
        ], 'point_count', Mapbox.InterpolationMode.Exponential),

      circleOpacity: 0.84,
      circleStrokeWidth: 2,
      circleStrokeColor: 'white'
    },

    clusterCount: {
      textField: '{point_count}',
      textSize: 12,
      textPitchAlignment: Mapbox.TextPitchAlignment.Map
    }
  });

export default class Map extends Component<{}> {

  constructor(props) {
    super(props);

    this.searchRadius = 5;
    this.nearbyItems = [];

    this.state = {
      source: null,
      // nearbyItems: [],
      selectedDisplay: null,
      // activeAnnotationIndex: -1,
      // previousActiveAnnotationIndex: -1,
    };
  }

  createMapFeature(location, displayKey) {
    return {
      type : 'Feature',
      id : displayKey,
      properties : {
        displayKey: displayKey,
      },
      geometry : {
        type: 'Point',
        coordinates: convertMapboxCoordinates(location)
      }
    };
  }

  handleRegionDidChange(region) {
    let center = convertMapboxCoordinates(region.geometry.coordinates);
    let bounds = region.properties.visibleBounds;

    let radius = turf.distance(
        turf.point([bounds[1][1], bounds[1][0]]),
        turf.point([bounds[0][1], bounds[0][0]])
    );

    if (this.geoQuery == null) {
      // if we have no geo query yet, create a new one
      this.geoQuery = geofireRef.query({
        center: center,
        radius: radius
      });

      this.attachGeoQueryCallbacks();
    } else {
      // just update the existing geo query
      this.geoQuery.updateCriteria({
        center: center,
        radius: radius
      });
    }
  }

  componentWillMount() {
    // fetchDisplays(1, 50, (items) => {
    //   this.setState({displays: items});
    // });
  }

  attachGeoQueryCallbacks() {
    var onKeyEnteredRegistration = this.geoQuery.on("key_entered", (key, location, distance) => {
        let index = this.nearbyItems.findIndex(value => value['displayKey'] == key);

        // only add new key if it wasn't already added
        if (index == -1) {
          this.nearbyItems.push({
            displayKey: key,
            distance : distance,
            location : location,
          });
        }
      });

    // var onKeyExitedRegistration = this.geoQuery.on("key_exited", (key, location, distance) => {
    //     let index = this.nearbyItems.findIndex(value => value['displayKey'] == key);
    //     if (index > -1) {
    //       // this.nearbyItems.splice(index, 1);
    //     }
    //   });

    var onReadyRegistration = this.geoQuery.on("ready", () => {
        var features = [];

        this.nearbyItems.forEach(item => {
          features.push(this.createMapFeature(item.location, item.displayKey));
        });

        var source = {
          type: 'FeatureCollection',
          features: features,
        };

        this.setState({
          source: source,
        });

        // sort found displays by distance
        // this
        //   .foundDisplayKeys
        //   .sort((item1, item2) => {
        //     let distance1 = Object.values(item1)[0];
        //     let distance2 = Object.values(item2)[0];

        //     return parseFloat(distance1) - parseFloat(distance2);
        //   });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        { <Mapbox.MapView
            ref={(c) => {this.map = c}}
            styleURL={Mapbox.StyleURL.Dark}
            centerCoordinate={[-95.712900, 37.090200]}
            zoomLevel={Globals.MAP_DEFAULT_ZOOM_LEVEL}
            minZoomLevel={Globals.MAP_MIN_ZOOM_LEVEL}
            maxZoomLevel={Globals.MAP_MAX_ZOOM_LEVEL}
            zoomEnabled={true}
            style={styles.mapbox}
            showUserLocation={true}
            userTrackingMode={Mapbox.UserTrackingModes.Follow}
            onDidFinishLoadingMap={this.onCurrentLocationPressed}
            onRegionDidChange={debounce(this.handleRegionDidChange.bind(this), 200)}
            >

            { this.state.source &&
              <Mapbox.ShapeSource
                id = 'earthquakes'
                cluster
                clusterRadius = {50}
                clusterMaxZoom = {14}
                shape = {this.state.source}
                onPress = {(e) => this.onShapePressed(e)}>

                <Mapbox.SymbolLayer
                  id='pointCount'
                  style={layerStyles.clusterCount} />

                <Mapbox.CircleLayer
                  id = 'clusteredPoints'
                  belowLayerID = 'pointCount'
                  filter = {
                    ['has', 'point_count']
                  }
                  style = {layerStyles.clusteredPoints} />

                <Mapbox.CircleLayer
                  id='singlePoint'
                  filter={['!has', 'point_count']}
                  style={layerStyles.singlePoint} />

              </Mapbox.ShapeSource> }
        </Mapbox.MapView> }

        <TouchableOpacity style={styles.menuIcon} onPress={this.onMenuPressed}>
          <Image source={require('../img/menu_icon.png')} />
        </TouchableOpacity>

        {  <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: this.state.selectedDisplay ? 173+70 : 70,
              right: 0
            }}
            onPress={this.onCreateDisplayPressed}>
          <Image style={{width: 80, height: 80}} source={require('../img/icon_add_display.png')} />
                </TouchableOpacity> }

        { <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: this.state.selectedDisplay ? 173 : 0,
              right: 0
            }}
            onPress={this.onCurrentLocationPressed}>
          <Image style={{width: 80, height: 80}} source={require('../img/current_location_icon.png')} />
        </TouchableOpacity> }

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

  onShapePressed(e) {
    feature = e.nativeEvent.payload;

    let displayKey = feature.properties.displayKey;

    if (!displayKey) return;
    
    fetchDisplay(displayKey, display => {
        this.setState({
          selectedDisplay: display
        });
    });
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

  // center map on user's location
  onCurrentLocationPressed = () => {
this.map.showUserLocation = true;

    navigator
      .geolocation
      .getCurrentPosition(position => {
        this.map.setCamera({
          centerCoordinate: [position.coords.longitude, position.coords.latitude],
          zoom: Globals.MAP_DEFAULT_ZOOM_LEVEL
        });
      });
  }

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
