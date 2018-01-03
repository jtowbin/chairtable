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
  ImageBackground,
  View,
  TouchableOpacity,
  AsyncStorage,
  Dimensions
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import Swiper from 'react-native-swiper';
import Globals from '../Globals.js';
import {loginUsingFacebook} from '../Helpers.js';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;

export default class Tutorial extends Component<{}> {
  constructor() {
    super();
    this.state = {
      swipeIndex: 0,
    };
  }

  render() {
    let skipButton = <View />;

    if (this.state.swipeIndex != 2) {
      skipButton =
      <TouchableOpacity onPress={this.onSkipButtonPress} style={{marginLeft: 24}}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      pageSubtitle = 'Continue With:';
    }

    var doneButton = <View />;
    if (this.state.swipeIndex == 2) {
      doneButton = <TouchableOpacity onPress={this.onSkipButtonPress} style={{marginRight: 24}}>
        <Text style={styles.skipText}>Done</Text>
      </TouchableOpacity>
    }

    let pageSubtitle = '';
    
    if (this.state.swipeIndex == 0) {
      pageSubtitle = 'Continue With:';
    } else {
      pageSubtitle = 'Begin:';
    }

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          {skipButton}
          {doneButton}
        </View>

        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          paginationStyle={{height: 50}}
          onIndexChanged={this.onIndexChanged}
          loop={false}>
          <View style={styles.slide1}>
            <View>
              <ImageBackground style={styles.backgroundImage} source={require('../img/bg_tutorial_1.png')}>
                <Image source={require('../img/button.png')} />
              </ImageBackground>
            </View>

            <Text style={styles.text}>Explore 1,000+ Displays</Text>
            <Text style={styles.subtitle}>Rudolf has the largest collection of Christmas displays anywhere, curated by 2 thousand enthusiasts like you.</Text>
          </View>
          <View style={styles.slide2}>
            <View>
              <ImageBackground style={styles.backgroundImage} source={require('../img/bg_tutorial_2.png')}>
                <Image source={require('../img/map_point.png')} />
              </ImageBackground>
            </View>

            <Text style={styles.text}>Start a new family tradition</Text>
            <Text style={styles.subtitle}>Never drive around aimlessly again - browse detialed reviews and photos. Filter by light shows and neighborhoods!</Text>
          </View>
          <View style={styles.slide3}>
            <View>
              <ImageBackground style={styles.backgroundImage} source={require('../img/bg_tutorial_3.png')}>
                <Image source={require('../img/directions_arrow.png')} />
              </ImageBackground>
            </View>

            <Text style={styles.text}>Get driving directions</Text>
            <Text style={styles.subtitle}>Rudolf will lead the way! One tap detailed driving dirctions so you get to the christmas display in no time.</Text>
          </View>
        </Swiper>

        <View style={{position: 'absolute', bottom: 70, width: '100%'}}>
          <Text style={{fontSize: 14, fontFamily: 'Avenir-Heavy', textAlign: 'center', backgroundColor: 'transparent'}}>{pageSubtitle}</Text>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={{width: '100%', justifyContent: 'center', alignItems: 'center'}} onPress={() => loginUsingFacebook()}>
              <Image style={{width: 13, height: 23}} source={require('../img/facebook_icon.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  onIndexChanged = (index) => {
    this.setState({swipeIndex: index});
  }

  onSkipButtonPress() {
    AsyncStorage.setItem(Globals.STORAGE_KEY_TUTORIAL_IS_VIEWED, "1");

    Actions.login();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  skipText: {
    fontSize: 14,
    color: '#999999'
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
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH/2.15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topContainer: {
    marginTop: 20,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomContainer: {
    backgroundColor: '#3B5998',
    height: 50,
    flexDirection: 'row',
  }
});
