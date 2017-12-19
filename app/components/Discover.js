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
  FlatList
} from 'react-native';

import firebase from 'react-native-firebase';
import StarRating from 'react-native-star-rating';
import {Actions} from 'react-native-router-flux';
import Globals from '../Globals';
import {getCurrentUser} from '../Helpers';
import {fetchDisplays} from '../FirebaseHelpers';
import DisplayRatingView from './views/DisplayRatingView';

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
  isFavorited: boolean,
};

// number of displays to load in one request to firebase
const displaysPerPage = 10;

export default class Discover extends Component<Props, State> {
  constructor() {
      super();

      this.state = {
        displays: [],
        refreshing: true,
        pageOfDisplays: 0,
        isFavorited: false,
      };
  }

  componentWillMount() {
    this.setState(
      {
        pageOfDisplays: 0
      },
      () => {
        fetchDisplays(this.state.pageOfDisplays, displaysPerPage, items => {
          this.setState({displays: items, refreshing: false});
        });
      }
    );
  }

  loadMoreMessages () {
    this.setState(
      {
        pageOfDisplays: this.state.pageOfDisplays+1
      },
      () => {
        fetchDisplays(this.state.pageOfDisplays, displaysPerPage, items => {
          this.setState({displays: items, refreshing: false});
        });
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

          <View style={{width: 40}} />
          {/* <TouchableOpacity style={styles.filterIcon}>
            <Image source={require('../img/filter_icon.png')} />
          </TouchableOpacity> */}
        </View>

        <View style={styles.dataContainer}>

          <FlatList
            showsVerticalScrollIndicator={false}
            refreshing={this.state.refreshing}
            data={this.state.displays}
            onEndReached={this.loadMoreMessages.bind(this)}
            // onEndReachedThreshold={0}
            keyExtractor={item => item.key}
            renderItem={({item}) =>
              <TouchableWithoutFeedback onPress={() => this.onDisplayPressed(item.key)}>
                {/* <DisplayView item={item} style={styles.cardView} /> */}
                <View style={styles.cardView}>
                  <Image style={{width: '100%', height: 200, resizeMode: 'cover'}} source={{uri: item.image}} />
                  <TouchableOpacity style={{zIndex: 1, position: 'absolute', top: 0, right: 0}} onPress={() => this.toggleFavorite(item.key)}>
                    <Image source={item.isFavorited ? require('../img/icon_favorite_filled.png') : require('../img/icon_favorite_unfilled.png')} />
                  </TouchableOpacity>

                  <DisplayRatingView item={item} />
                </View>
              </TouchableWithoutFeedback>}
            />
          </View>
      </ImageBackground>
    );
  }

  isFavorited(displayKey: string) {
    const favoriteRef = firebase.database().ref(
      Globals.FIREBASE_TBL_USERS + '/' +
      getCurrentUser().uid + '/' +
      Globals.FIREBASE_TBL_USERS_FAVORITES + '/' + displayKey);

    return (favoriteRef != null);
  }

  toggleFavorite(displayKey: string) {
    let userId = getCurrentUser().uid;

    const userFavoritesRef = firebase.database().ref(
      Globals.FIREBASE_TBL_USERS + '/' +
      userId + '/' +
      Globals.FIREBASE_TBL_USERS_FAVORITES + '/' + displayKey);
    const displayFavoritesRef = firebase.database().ref(
      Globals.FIREBASE_TBL_DISPLAYS + '/' +
      displayKey + '/' +
      Globals.FIREBASE_TBL_USERS_FAVORITES + '/' + userId);

    // check if display is already favorited by current user
    displayFavoritesRef.once('value').then((snap) => {
      // value is null, so display wasn't yet favorited by this user
      if (!snap.val()) {
        // mark display as favorite
        userFavoritesRef.set(true);
        displayFavoritesRef.set(true);
      } else {
        // remove display from user's favorite list
        userFavoritesRef.remove();
        displayFavoritesRef.remove();
      }
    });
  }

  onMenuPressed() {
    Actions.drawerOpen();
  }

  onDisplayPressed = (key: string) => {
    Actions.displayDetail({displayKey : key});
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
