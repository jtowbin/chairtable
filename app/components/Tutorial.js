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

import {Actions} from 'react-native-router-flux';

import Swiper from 'react-native-swiper';
import Globals from '../Globals.js';
import Helpers from '../Helpers.js';

export default class Tutorial extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onSkipButtonPress} style={{width: '100%', marginTop: 20}}>
              <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <Swiper style={styles.wrapper} showsButtons={false} loop={false}>
          <View style={styles.slide1}>
            <View>
              <Image source={require('../img/efwf.png')} />
              <Image style={{...StyleSheet.absoluteFillObject}} source={require('../img/button.png')} />
            </View>

            <Text style={styles.text}>Explore 1,000+ Displays</Text>
            <Text style={styles.subtitle}>Rudolf has the largest collection of Christmas displays anywhere, curated by 2 thousand enthusiasts like you.</Text>
          </View>
          <View style={styles.slide2}>
            <View>
              <Image source={require('../img/familyviewinghouse.png')} />
              <Image style={{...StyleSheet.absoluteFillObject}} source={require('../img/map_point.png')} />
            </View>

            <Text style={styles.text}>Start a new family tradition</Text>
            <Text style={styles.subtitle}>Never drive around aimlessly again - browse detialed reviews and photos. Filter by light shows and neighborhoods!</Text>
          </View>
          <View style={styles.slide3}>
            <View>
              <Image source={require('../img/santadriving.png')} />
              <Image style={{...StyleSheet.absoluteFillObject}} source={require('../img/directions_arrow.png')} />
            </View>

            <Text style={styles.text}>Get driving directions</Text>
            <Text style={styles.subtitle}>Rudolf will lead the way! One tap detailed driving dirctions so you get to the christmas display in no time.</Text>
          </View>
        </Swiper>

          <TouchableOpacity onPress={this.onSkipButtonPress} style={{width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#3B5998', height: 40}}>
                <Image source={require('../img/facebook_icon.png')} />
          </TouchableOpacity>
      </View>
    );
  }

  onSkipButtonPress() {
    AsyncStorage.setItem(Globals.STORAGE_KEY_TUTORIAL_IS_VIEWED, "1");

    Actions.login();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 24
  },
  wrapper: {
  },
  slide1: {
    flex: 1,
    alignItems: 'center',
  },
  slide2: {
    flex: 1,
    alignItems: 'center',
  },
  slide3: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    color: '#444',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 20
  },
  subtitle: {
    color: '#444',
    fontSize: 15,
    textAlign: 'center',
    marginLeft: 40,
    marginRight: 40
  }
});
