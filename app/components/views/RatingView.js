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
  ViewPropTypes
} from 'react-native';

import StarRating from 'react-native-star-rating';
import {formatToOneDecimal} from '../../Helpers';

type Props = {
  rating: number,
  shouldHideText?: boolean,
  ratingTextStyle?: ViewPropTypes.style
};

type State = {};

export default class RatingView extends Component<Props, State> {
  static defaultProps = {
    shouldHideText: false,
    ratingTextStyle: {}
  };

  constructor(props: Props) {
    super(props);
  }

  render() {
    let rating = this.props.rating;
    let formattedRating = formatToOneDecimal(rating);

    return (
      <View style={{marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
        <StarRating
          disabled={true}
          starStyle={{marginRight: 5}}
          starSize={10}
          emptyStar={require('../../img/star_empty.png')}
          fullStar={rating > 2.5 ? require('../../img/star_full.png') : require('../../img/star_full_orange.png')}
          halfStar={rating > 2.5 ? require('../../img/star_half.png') : require('../../img/star_half_orange.png')}
          maxStars={5}
          rating={rating}
        />

        {!this.props.shouldHideText && this.renderRatingText(formattedRating)}
        {/* <Text style={{marginLeft: 5, fontSize: 11, color: '#B2B1C1', fontFamily: 'Monaco'}}>{item.starCount} / 5.0 * 1.3 MI NEARBY</Text> */}
      </View>
    );
  }

  renderRatingText(formattedRating: string) {
    return (
      <Text style={[styles.ratingText, this.props.ratingTextStyle]}>{formattedRating}/5.0</Text>
    );
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
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 11,
    color: '#B2B1C1',
    fontFamily: 'Monaco',
    backgroundColor: 'transparent'
  }
});
