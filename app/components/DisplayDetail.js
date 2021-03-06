/**
 * Detailed display screen
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
  TextInput,
  FlatList,
} from 'react-native';

import firebase from 'react-native-firebase';
import StarRating from 'react-native-star-rating';
import {Actions, ActionConst} from 'react-native-router-flux';
import ReadMore from 'react-native-read-more-text';
import PopupDialog, {DialogButton} from 'react-native-popup-dialog';
import TimeAgo from 'react-native-timeago';

import DisplayRatingView from './views/DisplayRatingView';
import RatingView from './views/RatingView';
import {getCurrentUser} from '../Helpers';
import {
  fetchDisplay,
  updateRating,
  fetchRating,
  fetchRatingsForDisplay
} from '../FirebaseHelpers';
import Globals from '../Globals';

type Display = {
  title: string,
  description: string,
  starCount: number,
  image: string,
  address: string,
};

type Props = {
  displayKey: string,
};

type State = {
  display: Display,
  refreshing: boolean,
  selectedRating: number,
  reviewText: string,
  displayReviews: array,
};

export default class DisplayDetail extends Component<Props, State> {
  /**
   * Default state
   * @param {array} props 
   */
  constructor(props: Props) {
      super(props);

      this.state = {
        display: null,
        refreshing: true,
        selectedRating: 0,
        reviewText: '',
        displayReviews: [],
      };
  }

  /**
   * Initial state, set by fetching the display and ratings
   */
  componentWillMount() {
    fetchDisplay(this.props.displayKey, (item) => {
      this.setState({
        display: item,
        refreshing: false
      });
    });

    fetchRating(getCurrentUser().uid, this.props.displayKey, (review) => {
      this.setState({
        selectedRating: review.rating,
      });
    });

    fetchRatingsForDisplay(this.props.displayKey, reviews => this.setState({displayReviews: reviews}));
  }

  render() {
    return (
      <View style={styles.container}>

        <TouchableOpacity style={styles.backIcon} onPress={this.onBackPressed}>
          <Image style={{width: 40, height: 40}} source={require('../img/back_icon.png')} />
        </TouchableOpacity>

        { this.state.display && this.getDisplayView() }
      </View>
    );
  }

  /**
   * The layout of the display
   */
  getDisplayView() {
    return (<View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.cardView}>
        <Image
          style={{width: '100%', height: 200, resizeMode: 'cover'}}
          source={{
            uri: this.state.display.image,
            cache: 'force-cache'
          }} />

        <DisplayRatingView
          item={this.state.display}
          margin={20} />

          <Text style={{marginLeft: 20, marginRight: 20, marginBottom: 20}}>{this.state.display.address}</Text>

      </View>

      {/* list display's reviews */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={this.state.displayReviews}
        keyExtractor={item => item.displayUserKey}
        ItemSeparatorComponent={this.renderSeparator}
        ListHeaderComponent={this.renderHeader}
        renderItem={({item}) =>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{margin: 20, width: 50, height: 50, borderRadius: 25}}
              source={{
                uri: item.userPhoto,
                cache: 'force-cache'
              }} />
            <View style={{flex: 1, marginTop: 25, marginBottom: 10, flexDirection: 'column'}}>
              <Text style={{marginBottom: 5, fontWeight: 'bold', fontSize: 16}}>{item.userName}</Text>

              <RatingView
                shouldHideText={true}
                rating={item.rating} />

              <Text style={{marginTop: 20, fontFamily: 'Monaco', fontSize: 14}}>{item.review}</Text>

              <View style={{alignItems: 'flex-end', marginTop: 10, marginRight: 10}}>
                <TimeAgo time={item.date} />
              </View>
            </View>
          </View>
        } />

      {/* the review popup */}
      <PopupDialog
        width={300}
        heigh={300}
        ref={(popupDialog) => { this.popupDialog = popupDialog; }}
        dismissOnTouchOutside={false}
        actions={[
          <View
            style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end'}}
            key="button-set-1">
            <DialogButton
              text="CANCEL"
              onPress={() => {
                this.popupDialog.dismiss();
                this.onReviewCancelPress();
              }}
               />
            <DialogButton
              text="RATE"
              onPress={() => {
                this.popupDialog.dismiss();
                this.onReviewSavePress();
              }}
               />
          </View>
        ]}
      >
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{margin: 10, fontSize: 16, fontFamily: 'Monaco'}}>Rate this display</Text>
          <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 10}}>
            <StarRating
              disabled={false}
              starStyle={{marginLeft: 5, marginRight: 5}}
              starSize={30}
              emptyStar={require('../img/star_large_empty.png')}
              fullStar={require('../img/star_large_full.png')}
              halfStar={require('../img/star_large_empty.png')}
              maxStars={5}
              rating={this.state.selectedRating}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
            />
          </View>

          <TextInput
            style={styles.reviewText}
            onChangeText={(text) => this.setState({reviewText: text})}
            value={this.state.reviewText}
            multiline={true}
            blurOnSubmit={true}
            autoGrow={true}
            maxHeight={200}
            maxLength={Globals.REVIEW_MAX_CHAR_LENGTH}
            placeholder='Example: An amazing display of Christmas lights. Very family oriented. Santa and Rudolph are there to have pictures taken with the children.'
          />
        </View>
      </PopupDialog>
    </View>);
  }

  /**
   * Button to show complete text 
   */
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={styles.readMoreFooterText} onPress={handlePress}>More</Text>
    );
  }

  /**
   * Button to show truncated text
   */
  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={styles.readMoreFooterText} onPress={handlePress}>Less</Text>
    );
  }

  /**
   * FlatList's separator
   */
  renderSeparator = () => {
    return (
      <View style={{flex: 1, height: 1, backgroundColor: '#bbbbbb'}} />
    );
  }

  /**
   * FlatList's header
   */
  renderHeader = () => {
    return (
      <View style={{backgroundColor: 'white'}}>
        <View style={{backgroundColor: '#f9f9f9', height: 60, justifyContent: 'center'}}>
          <Text style={{marginLeft: 20, color: 'black', fontWeight: 'bold'}}>OVERVIEW</Text>
        </View>
        <View style={{paddingTop: 10, paddingLeft: 20, paddingRight: 20}}>
          <ReadMore
              numberOfLines={3}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
              onReady={this._handleTextReady}>
              <Text style={{fontFamily: 'Monaco'}}>
                {this.state.display.description}
              </Text>
          </ReadMore>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10}}>
          <StarRating
            disabled={this.state.selectedRating > 0}
            starStyle={{marginRight: 5}}
            starSize={30}
            emptyStar={require('../img/star_large_empty.png')}
            fullStar={require('../img/star_large_full.png')}
            halfStar={require('../img/star_large_empty.png')}
            maxStars={5}
            selectedStar={() => {
              this.popupDialog.show();
            }}
            rating={this.state.selectedRating}
          />
        </View>

      </View>
    );
  }

  /**
   * When the cancel button is pressed on the review
   */
  onReviewCancelPress() {
    this.setState({
      selectedRating: 0,
      reviewText: '',
    });
  }

  /**
   * When the save button is pressed on the review
   */
  onReviewSavePress() {
    updateRating(this.props.displayKey, getCurrentUser().uid, this.state.selectedRating, this.state.reviewText, () => {});
  }

  /**
   * When the back button is pressed
   */
  onBackPressed() {
    Actions.pop({type: ActionConst.REFRESH});
  }

  /**
   * When a star is selected
   * @param {number} rating 
   */
  onStarRatingPress(rating: number) {
    this.setState({
      selectedRating: rating,
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
    top: 22,
    left: 12
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
  },
  reviewText: {
    marginTop: 10,
    width: 200,
    height: 200,
    textAlign: 'justify',
    fontFamily: 'Monaco',
    fontSize: 13,
    color: '#35343D'
  },
});
