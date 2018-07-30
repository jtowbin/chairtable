/**
 * The DisplayRatingView component
 * 
 * Wrapper of the RatingView component
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
  distance: number,
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

        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
{
  this.props.item.starCount > 0 && this.renderDisplayRating(this.props.item)
}

{
  this.props.item.starCount > 0 && this.props.item.distance && <Text> * </Text>
}

{
  this.props.item.distance && this.renderDistance(this.props.item.distance)
}
          
        </View>
      </View>
    );
  }

  renderDisplayRating = (item: Display) => {
    return (
      <RatingView rating={item.starCount} />
    );
  }

  renderDistance = (distance: number) => {
    return (
      <Text style={styles.distanceText}>{distance} MI NEARBY</Text>
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
  distanceText: {
    fontSize: 11,
    color: '#B2B1C1',
    fontFamily: 'Monaco',
    backgroundColor: 'transparent'
  }
});
