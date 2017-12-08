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
} from 'react-native';

import Mapbox from '@mapbox/react-native-mapbox-gl';
import Globals from '../Globals.js';
import {Actions} from 'react-native-router-flux';

Mapbox.setAccessToken(Globals.MAPBOX_ACCESS_TOKEN);

export default class Map extends Component<{}> {

  render() {
    return (
      <View style={styles.container}>
        <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Light}
            zoomLevel={15}
            zoomEnabled={true}
            centerCoordinate={[11.256, 43.770]}
            style={styles.mapbox}
            showUserLocation={true}>
            {/* userTrackingMode={Mapbox.userTrackingMode.follow}> */}
            {this.renderAnnotations()}
        </Mapbox.MapView>

        <TouchableOpacity style={styles.menuIcon} onPress={this.onMenuPressed}>
          <Image source={require('../img/menu_icon.png')} />
        </TouchableOpacity>
      </View>
    );
  }

  renderAnnotations () {
    return (
      <Mapbox.PointAnnotation
        key='pointAnnotation'
        id='pointAnnotation'
        coordinate={[11.254, 43.772]}>

        <View style={styles.annotationContainer}>
          <View style={styles.annotationFill} />
        </View>
        <Mapbox.Callout title='Look! An annotation!' />
      </Mapbox.PointAnnotation>
    )
  }

  onMenuPressed() {
    Actions.drawerOpen();
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
  }
});
