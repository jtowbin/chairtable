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
  ScrollView,
} from 'react-native';

import firebase from 'react-native-firebase';
import StarRating from 'react-native-star-rating';
import {Actions} from 'react-native-router-flux';
import ReadMore from 'react-native-read-more-text';
import Globals from '../Globals';

import DisplayView from './views/DisplayView';

type Display = {
  title: string,
  description: string,
  starCount: number,
  image: string,
};

type Props = {
  displayKey: string,
};

type State = {
  display: Display,
  refreshing: boolean,
  selectedStars: number
};

// number of displays to load in one request to firebase
const displaysPerPage = 10;

// the firebase connection to the displays data set
const firebaseRef = firebase.database();

export default class DisplayDetail extends Component<Props, State> {
  constructor(props: Props) {
      super(props);

      this.state = {
        display: null,
        refreshing: true,
        selectedStars: 0
      };
  }

  // retrieving displays from the firebase data set
  fetchDisplay() {
      firebaseRef.ref('/' + Globals.FIREBASE_TBL_DISPLAYS + '/' + this.props.displayKey)
        .on('value', (snap) => {
          var item = {
            title: this.props.displayKey, // should be snap.val().Title
            description: snap.val().Description,
            starCount: 4.6,
            image: snap.val().Images[0],
          };

          this.setState({
            display: item,
            refreshing: false
          });
        });
  }

  componentWillMount() {
    this.fetchDisplay();
  }

  render() {
    return (
      <View style={styles.container}>

        <TouchableOpacity style={styles.backIcon} onPress={this.onBackPressed}>
          <Image source={require('../img/back_icon.png')} />
        </TouchableOpacity>

        { this.state.display && this.getDisplayView() }
      </View>
    );
  }

  getDisplayView() {
    return (<View style={{flex: 1}}>
      <View style={styles.cardView}>
        <Image style={{width: '100%', height: 200, resizeMode: 'cover', marginBottom: 20}} source={{uri: this.state.display.image}} />
        <Text style={{marginLeft: 20, marginBottom: 5, fontSize: 17, fontFamily: 'Monaco'}}>{this.state.display.title}</Text>
        <View style={{marginLeft: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center'}}>
          <StarRating
            disabled={true}
            starStyle={{marginRight: 5}}
            starSize={10}
            emptyStar={require('../img/star_empty.png')}
            fullStar={this.state.display.starCount > 2.5 ? require('../img/star_full.png') : require('../img/star_full_orange.png')}
            halfStar={this.state.display.starCount > 2.5 ? require('../img/star_half.png') : require('../img/star_half_orange.png')}
            maxStars={5}
            rating={this.state.display.starCount}
            selectedStar={(rating) => this.onStarRatingPress(rating)}
          />
          <Text style={{marginLeft: 5, fontSize: 11, color: '#B2B1C1', fontFamily: 'Monaco'}}>{this.state.display.starCount} / 5.0 * 1.3 MI NEARBY</Text>
        </View>
      </View>
      <ScrollView style={{backgroundColor: 'white'}}>
        <View style={{backgroundColor: '#f9f9f9', height: 60, justifyContent: 'center'}}>
          <Text style={{marginLeft: 20, color: 'black', fontWeight: 'bold'}}>OVERVIEW</Text>
        </View>
        <View style={{paddingTop: 10, paddingLeft: 20, paddingRight: 20}}>
          <ReadMore
              numberOfLines={3}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
              onReady={this._handleTextReady}>
              <Text style={{}}>
                {this.state.display.description}
              </Text>
          </ReadMore>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10}}>
          <StarRating
            disabled={false}
            starStyle={{marginLeft: 5, marginRight: 5}}
            starSize={30}
            emptyStar={require('../img/star_large_empty.png')}
            fullStar={require('../img/star_large_full.png')}
            halfStar={require('../img/star_large_empty.png')}
            maxStars={5}
            rating={this.state.selectedStars}
            selectedStar={(rating) => this.onStarRatingPress(rating)}
          />
        </View>
      </ScrollView>
    </View>);
  }

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={styles.readMoreFooterText} onPress={handlePress}>More</Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={styles.readMoreFooterText} onPress={handlePress}>Less</Text>
    );
  }

  onBackPressed() {
    Actions.pop();
  }

  onStarRatingPress(rating: number) {
    this.setState({
      selectedStars: rating
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  backIcon: {
    position: 'absolute',
    zIndex: 1,
    top: 32,
    left: 22
  },
  cardView: {
    flexDirection: 'column',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3
  },
  readMoreFooterText: {
    marginBottom: 5,
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold'
  }
});
