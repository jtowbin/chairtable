/**
 * The DisplayView component
 * 
 * A wrapper of the DisplayRatingView component
 * 
 * DisplayView -> DisplayRatingView -> RatingView
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
import DisplayRatingView from './DisplayRatingView';
import {getCurrentUser} from '../../Helpers';
import {toggleFavorite, fetchDisplay} from '../../FirebaseHelpers';

type Display = {
  title: string,
  description: string,
  starCount: number,
  image: string,
  isFavorited: boolean,
};

type Props = {
  item: Display,
  ratingComponentMargin?: number,
};

type State = {
  isFavorited: boolean,
};

export default class DisplayView extends React.PureComponent<Props, State> {
  static defaultProps = {
    item: null,
    ratingComponentMargin: 20,
  };

  /**
   * Default state
   * 
   * @param {array} props 
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      isFavorited: props.item.isFavorited,
    };
  }

  render() {
    return (
      <View style={[styles.cardView, this.props.displayStyle]}>
        {<Image
          style={{width: '100%', height: 200, resizeMode: 'cover'}}
          source={{
            uri: this.props.item.image,
            cache: 'force-cache',
          }} />}
        <TouchableOpacity style={{zIndex: 1, position: 'absolute', top: 0, right: 0}} onPress={() => this.toggleFavoritePressed(this.props.item.key)}>
          <Image source={this.state.isFavorited ? require('../../img/icon_favorite_filled.png') : require('../../img/icon_favorite_unfilled.png')} />
        </TouchableOpacity>

        <DisplayRatingView
          margin={this.props.ratingComponentMargin}
          item={this.props.item} />
      </View>
    );
  }

  /**
   * Toggle display as favorited
   * 
   * @param {string} displayKey 
   */
  toggleFavoritePressed(displayKey: string) {
    let userId = getCurrentUser().uid;

    toggleFavorite(userId, displayKey, isFavorited => {
      this.setState({
        isFavorited: isFavorited,
      });
    });
  }

  /**
   * When menu button is pressed
   */
  onMenuPressed() {
    Actions.drawerOpen();
  }
}

const styles = StyleSheet.create({
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
