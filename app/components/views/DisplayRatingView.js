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
import RatingView from './RatingView'

type Display = {
  title: string,
  description: string,
  starCount: number,
  image: string,
};

type Props = {
  item: Display,
  margin: number,
};

type State = {};

export default class DisplayRatingView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <View style={{margin: this.props.margin}}>
        <Text numberOfLines={1} style={{fontSize: 17, fontFamily: 'Monaco'}}>{this.props.item.title}</Text>

        { this.props.item.starCount > 0 && this.renderDisplayRating(this.props.item) }
      </View>
    );
  }

  renderDisplayRating = (item: Display) => {
    return (
      <RatingView rating={item.starCount} />
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
  }
});
