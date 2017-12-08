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

import StarRating from 'react-native-star-rating';
import {Actions} from 'react-native-router-flux';

export default class Discover extends Component<{}> {

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
            data={[
              {
                title: 'Ivar\'s Clam Lights',
                image: require('../img/sample_spot_1_ns.png'),
                starCount: 4.6,
              },
              {
                title: 'Richmond Tacky Light House',
                image: require('../img/sample_spot_2_ns.png'),
                starCount: 2.5,
              },
              {
                title: 'Hans Holiday House',
                image: require('../img/sample_spot_3_ns.png'),
                starCount: 1.3,
              },
              {
                title: 'Callahan Christmas',
                image: require('../img/sample_spot_4_ns.png'),
                starCount: 3.8,
              }
            ]}
            renderItem={({item}) =>
              <View style={styles.cardView}>
                <Image style={{width: '100%', resizeMode: 'cover', marginBottom: 20}} source={item.image} />
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
