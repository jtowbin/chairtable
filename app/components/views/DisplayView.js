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
} from 'react-native';

import StarRating from 'react-native-star-rating';

type Display = {
  title: string,
  description: string,
  starCount: number,
  image: string,
};

type Props = {
  item: Display,
};

type State = {};

export default class DisplayView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
        <View style={styles.cardView}>
          <Image style={{width: '100%', height: 200, resizeMode: 'cover', marginBottom: 20}} source={{uri: this.props.item.image}} />
          <Text style={{marginLeft: 20, marginBottom: 5, fontSize: 17, fontFamily: 'Monaco'}}>{this.props.item.title}</Text>
          <View style={{marginLeft: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center'}}>
            <StarRating
              disabled={true}
              starStyle={{marginRight: 5}}
              starSize={10}
              emptyStar={require('../../img/star_empty.png')}
              fullStar={this.props.item.starCount > 2.5 ? require('../../img/star_full.png') : require('../../img/star_full_orange.png')}
              halfStar={this.props.item.starCount > 2.5 ? require('../../img/star_half.png') : require('../../img/star_half_orange.png')}
              maxStars={5}
              rating={this.props.item.starCount}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
            />
            <Text style={{marginLeft: 5, fontSize: 11, color: '#B2B1C1', fontFamily: 'Monaco'}}>{this.props.item.starCount} / 5.0 * 1.3 MI NEARBY</Text>
          </View>
        </View>
    );
  }

  onMenuPressed() {
    Actions.drawerOpen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
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
