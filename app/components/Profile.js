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
  FlatList,
  Dimensions
} from 'react-native';

import firebase from 'react-native-firebase';
import {Actions} from 'react-native-router-flux';
import StarRating from 'react-native-star-rating';
import GridView from 'react-native-super-grid';

import {getCurrentUser} from '../Helpers';
import Globals from '../Globals';

type Display = {
  key: string,
  title: string,
  starCount: number,
  image: string,
};

type Props = {

};

type State = {
  displays: Array<Display>,
  refreshing: boolean,
  pageOfDisplays: number,
  selectedTab: string,
};

const { width, height } = Dimensions.get('window');
const equalWidth =  (width / 2 )

const listSeparatorSize = 10;
const listMarginSize = 20;

const tabFavoriteDisplays = 'tab_favorite_displays';
const tabMyReviews = 'tab_my_reviews';

export default class Profile extends Component<Props, State> {

  constructor() {
    super();
    this.state = {
      displays: [],
      refreshing: true,
      pageOfDisplays: 0,
      selectedTab: tabFavoriteDisplays
    };
  }

  componentWillMount() {
    this.loadFavoriteDisplays((result) => {
      console.log(result);

      var items = [];
      result.forEach(snap => {
        items.push({
          key: snap.key,
          title: snap.val().Title,
          starCount: 4.6,
          image: snap.val().Images[0]
        });
      });

      this.setState({displays: items, refreshing: false});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {/* the top hamburger icon of the menu */}
        <TouchableOpacity style={styles.menuIcon} onPress={this.onMenuPressed}>
          <Image source={require('../img/menu_icon.png')} />
        </TouchableOpacity>

        {/* the entire screen */}
        <View style={{flex: 1}}>

          {/* the data of the logged in user */}
          <View style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', marginTop: 30}}>
            <Image
              style={{width: 100, height: 100, borderRadius: 50}}
              source={{uri: getCurrentUser().photoURL}}
            />

            <Text style={{fontFamily: 'Monaco', fontSize: 24, marginTop: 10}}>
              {getCurrentUser().displayName}
            </Text>

            {/* <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 11, color: '#9A99A9'}}>
              Seattle, Washington
            </Text> */}
          </View>

          {/* the tabs and list */}
          <View style={{flex: 1}}>

            {/* the tabs */}
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
              <TouchableOpacity style={styles.tabContainer} onPress={() => this.onTabPressed(tabFavoriteDisplays)}>
                  <Text style={[{
                    color: (this.state.selectedTab == tabFavoriteDisplays) ? '#00CA9D' : '#9B9B9B',
                  }, styles.tabText]}>FAVORITE DISPLAYS</Text>
                  <View style={[styles.tabBottomLine, {backgroundColor: (this.state.selectedTab == tabFavoriteDisplays) ? '#00CA9D' : 'transparent'}]} />
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.tabContainer} onPress={() => this.onTabPressed(tabMyReviews)}>
                  <Text style={[{
                    color: (this.state.selectedTab == tabMyReviews) ? '#00CA9D' : '#9B9B9B'
                  }, styles.tabText]}>MY REVIEWS</Text>
                  <View style={[styles.tabBottomLine, {backgroundColor: (this.state.selectedTab == tabMyReviews) ? '#00CA9D' : 'transparent'}]} />
              </TouchableOpacity> */}
            </View>

            {/* the list */}
            <FlatList
              style={{paddingLeft: listMarginSize, paddingRight: listMarginSize, paddingTop: listMarginSize, backgroundColor: '#f6f6f9'}}
              showsVerticalScrollIndicator={false}
              // refreshing={this.state.refreshing}
              data={this.state.displays}
              numColumns={2}
              // onEndReached={this.loadMoreMessages.bind(this)}
              // onEndReachedThreshold={0}
              keyExtractor={item => item.key}
              ItemSeparatorComponent={this.renderSeparator}
              renderItem={({item}) =>
                <TouchableWithoutFeedback onPress={() => this.onDisplayPressed(item.key)}>
                  {/* <DisplayView item={item} style={styles.cardView} /> */}
                  <View style={styles.cardView}>
                    <Image style={{width: '100%', height: 160, resizeMode: 'cover'}} source={{uri: item.image}} />
                    <View style={{margin: 14}}>
                      <Text numberOfLines={1} style={{marginBottom: 5, fontSize: 14, fontFamily: 'Monaco'}}>{item.title}</Text>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <StarRating
                          disabled={true}
                          starStyle={{marginRight: 5}}
                          starSize={10}
                          emptyStar={require('../img/star_empty.png')}
                          fullStar={item.starCount > 2.5 ? require('../img/star_full.png') : require('../img/star_full_orange.png')}
                          halfStar={item.starCount > 2.5 ? require('../img/star_half.png') : require('../img/star_half_orange.png')}
                          maxStars={5}
                          rating={item.starCount}
                        />
                        <Text style={{marginLeft: 3, fontSize: 11, color: '#B2B1C1', fontFamily: 'Monaco'}}>{item.starCount}/5.0</Text>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>}
              />
            </View>
        </View>
      </View>
    );
  }

  renderSeparator = () => {
    return (
      <View style={{height: listSeparatorSize}} />
    );
  }

  loadFavoriteDisplays(callback) {
    const favoriteDisplaysRef = firebase.database().ref(
      Globals.FIREBASE_TBL_USERS + '/' +
      getCurrentUser().uid + '/' +
      Globals.FIREBASE_TBL_USERS_FAVORITES);

      // get list of favorited display ids for logged in user
      favoriteDisplaysRef.on('value', snapshot => {
        if (snapshot.val() != null) {
          var displayIds = Object.keys(snapshot.val());

          // get details of all displays
          Promise.all(
            displayIds.map(id => {
              console.log('send request '+id);
              return firebase.database().ref(Globals.FIREBASE_TBL_DISPLAYS).child(id).once('value')
                        .then(snapshot => {
                          console.log('got response '+id);
                          return snapshot;
                        })
            })
          ).then(r => callback(r))
          .catch((error) => console.log(error));
        }
      });

  }

  onMenuPressed() {
    Actions.drawerOpen();
  }

  onTabPressed(selectedTab: string) {
    switch (selectedTab) {
      case tabFavoriteDisplays:

        break;
      case tabMyReviews:
        break;
    }

    this.setState({selectedTab: selectedTab});
  }

  onDisplayPressed = (key: string) => {
    Actions.displayDetail({displayKey : key});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'fl',
    backgroundColor: 'white'
  },
  menuIcon: {
    zIndex: 1,
    position: 'absolute',
    top: 32,
    left: 22
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Monaco'
  },
  tabContainer: {
    width: '50%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBottomLine: {
    marginTop: 10,
    height: 3,
    width: 28
  },
  cardView: {
    width: equalWidth - listSeparatorSize - listMarginSize,
    marginLeft: listSeparatorSize/2,
    marginRight: listSeparatorSize/2,
    marginTop: 4,
    flexDirection: 'column',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3
  }
});
