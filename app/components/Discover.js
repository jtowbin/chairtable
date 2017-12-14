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
  FlatList
} from 'react-native';

import firebase from 'react-native-firebase';

import StarRating from 'react-native-star-rating';
import {Actions} from 'react-native-router-flux';

// number of displays to load in one request to firebase
const displaysPerPage = 10;

// the firebase connection to the displays data set
const displaysRef = firebase.database().ref('/Displays');

export default class Discover extends Component<{}> {

  constructor(props) {
      super(props);

      this.state = {
        displays: [],
        refreshing: true,
        pageOfDisplays: 0
      };
  }

  // retrieving displays from the firebase data set
  fetchDisplays() {
      displaysRef
        .limitToFirst((this.state.pageOfDisplays + 1) * displaysPerPage)
        .on('value', (snap) => {
          var items = [];
          snap.forEach((child) => {
            if (child.val().Images != null) {
            items.push({
              title: child.key,
              description: child.val().Description,
              starCount: 4.6,
              image: child.val().Images[0],
            });
          }
        });
        this.setState({displays: items, refreshing: false});
    });
  }

  componentWillMount() {
    this.setState(
      {
        pageOfDisplays: 0
      },
      () => {
        this.fetchDisplays();
      }
    );
  }

  loadMoreMessages () {
    this.setState(
      {
        pageOfDisplays: this.state.pageOfDisplays+1
      },
      () => {
        this.fetchDisplays();
      }
    );
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

          <TouchableOpacity style={styles.filterIcon}>
            <Image source={require('../img/filter_icon.png')} />
          </TouchableOpacity>
        </View>

        <View style={styles.dataContainer}>

          <FlatList
            showsVerticalScrollIndicator={false}
            refreshing={this.state.refreshing}
            data={this.state.displays}
            onEndReached={this.loadMoreMessages.bind(this)}
            // onEndReachedThreshold={0}
            keyExtractor={(item, index) => index}
            renderItem={({item}) =>
              <View style={styles.cardView}>
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
              </View>}
            />
          </View>
      </ImageBackground>
    );
  }

  onMenuPressed() {
    Actions.drawerOpen();
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
    marginRight: 22
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
