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
  ImageBackground,
  TextInput,
  Alert,
  KeyboardAvoidingView
} from 'react-native';

import firebase from 'react-native-firebase';
import {Actions} from 'react-native-router-flux';
import {createDisplay} from '../FirebaseHelpers';
import Globals from '../Globals';

var ImagePicker = require('react-native-image-picker');
var uuid = require('uuid-js');

// More info on all the options is below in the README...just some common use cases shown here
var options = {
  title: null,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  },
  maxWidth: 600,
  maxHeight: 600
};

const CATEGORY_NONE = 'None';
const CATEGORY_ANIMATION = 'Animation';
const CATEGORY_RESIDENTIAL = 'Residential';
const CATEGORY_MUSIC = 'Music';
const CATEGORY_CHARITABLE = 'Charitable';

export default class CreateDisplay extends Component<{}> {

  constructor() {
    super();
    this.state = {
      displayTitle: '',
      displayDescription: '',
      displayCategory: CATEGORY_NONE,
      displayAddress: '',
      avatarSource: [],
    };
  }

  renderPhotoItem(index) {
    if (this.state.avatarSource.length > index) {
      console.log(this.state.avatarSource);
      return (
        /*<TouchableOpacity onPress={() => this.onAddCoverPhoto(index)}>*/
          <Image style={styles.cameraIcon} source={this.state.avatarSource[index]} />
        /*</TouchableOpacity>*/
      );
    } else {
      return (
        <TouchableOpacity onPress={() => this.onAddCoverPhoto(index)}>
          <View style={styles.emptyCameraItem}>
            <Image source={require('../img/icon_camera.png')}/>
            <Text style={styles.cameraText}>ADD COVER PHOTO</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  render() {
    var imageCapture = (
      <TouchableOpacity style={styles.emptyCameraContainer} onPress={() => this.onAddCoverPhoto(0)}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require('../img/icon_camera.png')} /><Text style={styles.cameraText}>ADD COVER PHOTO</Text>
        </View>
      </TouchableOpacity>
    );

    if (this.state.avatarSource.length > 0) {
      imageCapture = (
        <View style={[styles.emptyCameraContainer, {flexDirection: 'row'}]}>
          <View style={{width: '50%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              { this.renderPhotoItem(0) }
              <View style={{height: 1}} />
              { this.renderPhotoItem(2) }
          </View>
          <View style={{width: 1}} />
          <View style={{width: '50%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              { this.renderPhotoItem(1) }
              <View style={{height: 1}} />
              { this.renderPhotoItem(3) }
          </View>
        </View>
      );
    }

    return (
      // <View style={styles.container}>
      // <KeyboardAvoidingView style={styles.container} behavior="padding">
      // <View>
      <ImageBackground
        resizeMode={'cover'}
        source={require('../img/map_add_display.png')}
        // style={{width: '100%', height: '100%'}}
        style={styles.container}
        >
        <View style={styles.navigation}>
          <TouchableOpacity style={styles.cancelButton} onPress={this.onCancelPressed}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.titleText}>Add new display</Text>

          <TouchableOpacity style={styles.saveButton} onPress={this.onSavePressed.bind(this)}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ImageBackground style={styles.mainContainer} source={require('../img/add_display_background.png')}>

          <View style={styles.inputContainer}>
            <View style={styles.addDisplayIcon}>
              <Image source={require('../img/icon_add_display.png')} />
            </View>

            <TextInput
              style={styles.displayTitleText}
              onChangeText={(text) => this.setState({displayTitle: text})}
              value={this.state.displayTitle}
              placeholder='Give it a name...'
            />

            <TextInput
              style={styles.displayDescriptionText}
              onChangeText={(text) => this.setState({displayDescription: text})}
              value={this.state.displayDescription}
              placeholder='What you can find here?'
            />

            <TextInput
              style={styles.displayDescriptionText}
              onChangeText={(text) => this.setState({displayAddress: text})}
              value={this.state.displayAddress}
              placeholder='Which is the address?'
            />

            <View style={styles.categoriesContainer}>
              <View style={styles.categoryContainer}>
                <TouchableOpacity style={styles.categoryImageContainer} onPress={ () => this.onCategoryButtonPressed(CATEGORY_ANIMATION) }>
                  <Image source={this.state.displayCategory == CATEGORY_ANIMATION ? require('../img/category_active.png') : require('../img/category_inactive.png')} />
                  <Image style={styles.categoryInnerImage} source={this.state.displayCategory == CATEGORY_ANIMATION ? require('../img/category_icon_animation_inactive.png') : require('../img/category_icon_animation_active.png')} />
                </TouchableOpacity>
                <Text style={styles.categoryText}>ANIMATION</Text>
              </View>

              <View style={styles.categoryContainer}>
                <TouchableOpacity style={styles.categoryImageContainer} onPress={ () => this.onCategoryButtonPressed(CATEGORY_MUSIC) }>
                  <Image source={this.state.displayCategory == CATEGORY_MUSIC ? require('../img/category_active.png') : require('../img/category_inactive.png')} />
                  <Image style={styles.categoryInnerImage} source={this.state.displayCategory == CATEGORY_MUSIC ? require('../img/category_icon_music_inactive.png') : require('../img/category_icon_music_active.png')} />
                </TouchableOpacity>
                <Text style={styles.categoryText}>MUSIC</Text>
              </View>

              <View style={styles.categoryContainer}>
                <TouchableOpacity style={styles.categoryImageContainer} onPress={ () => this.onCategoryButtonPressed(CATEGORY_RESIDENTIAL) }>
                  <Image source={this.state.displayCategory == CATEGORY_RESIDENTIAL ? require('../img/category_active.png') : require('../img/category_inactive.png')} />
                  <Image style={styles.categoryInnerImage} source={this.state.displayCategory == CATEGORY_RESIDENTIAL ? require('../img/category_icon_neighborhood_inactive.png') : require('../img/category_icon_neighborhood_active.png')} />
                </TouchableOpacity>
                <Text style={styles.categoryText}>NEIGHBORHOOD</Text>
              </View>

              <View style={styles.categoryContainer}>
                <TouchableOpacity style={styles.categoryImageContainer} onPress={ () => this.onCategoryButtonPressed(CATEGORY_CHARITABLE) }>
                  <Image source={this.state.displayCategory == CATEGORY_CHARITABLE ? require('../img/category_active.png') : require('../img/category_inactive.png')} />
                  <Image style={styles.categoryInnerImage} source={this.state.displayCategory == CATEGORY_CHARITABLE ? require('../img/category_icon_charitable_inactive.png') : require('../img/category_icon_charitable_active.png')} />
                </TouchableOpacity>
                <Text style={styles.categoryText}>CHARITABLE</Text>
              </View>
            </View>

            <View style={styles.cameraContainer}>
              {imageCapture}
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={this.onSavePressed.bind(this)}>
              <Image source={require('../img/round_button.png')} />
              <Text style={styles.submitText}>ADD NEW DISPLAY</Text>
            </TouchableOpacity>

          </View>

        </ImageBackground>

      </ImageBackground>
      // </View>
      // </KeyboardAvoidingView>
    );
  }

  validateSubmit() {
    if (!this.state.displayTitle) {
      Alert.alert(Globals.TEXT_DISPLAY_ADD_TITLE_REQUIRED);
      return false;
    } else if (this.state.avatarSource.length == 0) {
      Alert.alert(Globals.TEXT_DISPLAY_ADD_IMAGES_REQUIRED);
      return false;
    }

    return true;
  }

  onCategoryButtonPressed = (categoryType: string) => {
    if (this.state.displayCategory == categoryType) {
      this.setState({'displayCategory': CATEGORY_NONE})
    } else {
      this.setState({'displayCategory': categoryType})
    }
  }

  onCancelPressed() {
    Actions.pop();
  }

  onSavePressed = () => {

    // validate input
    if (!this.validateSubmit()) return false;

    // get user's current location
    navigator.geolocation.getCurrentPosition(position => {

      // upload images to firebase storage
      firebase.storage().ref('user_created').constructor.prototype.putFiles = function(files) { 
        var ref = this;
        return Promise.all(files.map(function(source) {
          return ref.child(uuid.create() + '.jpg').put(source.uri);
        }));
      }

      firebase.storage().ref('user_created').putFiles(this.state.avatarSource).then(metadatas => {
        // Get an array of file metadata
        console.log(metadatas);

        var images = metadatas.map(metadata => {
          return metadata.downloadURL;
        })

        var item = {};
        item['Address'] = this.state.displayAddress;
        item['Category'] = this.state.displayCategory;
        item['CellImage'] = images[0];
        item['Description'] = this.state.displayDescription;
        item['DisplayName'] = this.state.displayTitle;
        item['Facebook'] = '';
        item['Images'] = images;
        item['Last Date On'] = '';
        item['Last Verified'] = '';
        item['Latitude'] = position.coords.latitude;
        item['Longitude'] = position.coords.longitude;
        item['ParkingViewing info'] = '';
        item['Title'] = this.state.displayTitle;
        item['Video Aerial Drone'] = '';
        item['Video links'] = '';
        item['Walking Neighborhood'] = '';
        item['Website'] = '';

        createDisplay(item, () => {});
      }).catch(function(error) {
        // If any task fails, handle this
        console.log(error);
      });


      // upload image to firebase storage
      // var storageRef = firebase.storage().ref();
      // var imagesRef = storageRef.child('user_created/' + uuid.create() + '.jpg');
      // imagesRef.put(this.state.avatarSource[0].uri).then(snapshot => {
      //   var item = {};
      //   item['Address'] = this.state.displayAddress;
      //   item['Category'] = this.state.displayCategory;
      //   item['CellImage'] = snapshot.downloadURL;
      //   item['Description'] = this.state.displayDescription;
      //   item['DisplayName'] = this.state.displayTitle;
      //   item['Facebook'] = '';
      //   item['Images'] = [snapshot.downloadURL];
      //   item['Last Date On'] = '';
      //   item['Last Verified'] = '';
      //   item['Latitude'] = position.coords.latitude;
      //   item['Longitude'] = position.coords.longitude;
      //   item['ParkingViewing info'] = '';
      //   item['Title'] = this.state.displayTitle;
      //   item['Video Aerial Drone'] = '';
      //   item['Video links'] = '';
      //   item['Walking Neighborhood'] = '';
      //   item['Website'] = '';

      //   createDisplay(item, () => {});
      // }).catch(function(error) {
      //   console.log(error);
      // });
    });

    Actions.pop();
  }

  onAddCoverPhoto(index) {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        // add new photo to the existing state
        var avatarSource = this.state.avatarSource;
        avatarSource.splice(index, 0, source);

        this.setState({
          avatarSource: avatarSource
        });
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'fl',
    backgroundColor: 'white'
  },
  navigation: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelButton: {
    marginTop: 12,
    marginLeft: 22
  },
  cancelText: {
    fontFamily: 'Monaco',
    fontSize: 16,
    color: '#5F5D70',
    backgroundColor: 'transparent'
  },
  titleText: {
    marginTop: 12,
    fontFamily: 'Monaco',
    fontSize: 16,
    color: '#35343D',
    backgroundColor: 'transparent'
  },
  saveButton: {
    marginTop: 12,
    marginRight: 22
  },
  saveText: {
    fontFamily: 'Monaco',
    fontSize: 16,
    color: '#00CA9D',
    backgroundColor: 'transparent'
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    // backgroundColor: 'blue'
  },
  inputContainer: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'flex-end',
    // backgroundColor: 'red'
  },
  addDisplayIcon: {
    alignItems: 'center'
  },
  displayTitleText: {
    fontFamily: 'Monaco',
    fontSize: 28,
    color: '#35343D'
  },
  displayDescriptionText: {
    marginTop: 10,
    fontFamily: 'Monaco',
    fontSize: 16,
    color: '#35343D'
  },
  categoriesContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  categoryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInnerImage: {
    zIndex: 1,
    position: 'absolute',
  },
  categoryText: {
    marginTop: 10,
    fontFamily: 'Monaco',
    fontSize: 11,
    color: '#9B9B9B',
    letterSpacing: 1.1,
    backgroundColor: 'transparent'
  },
  cameraContainer: {
    marginTop: 10,
    height: 160,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  emptyCameraContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F6F6F9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyCameraItem: {
    width: '100%',
    height: 80,
    backgroundColor: '#F6F6F9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraIcon: {
    width: '100%',
    height: 80
  },
  cameraText: {
    marginTop: 10,
    fontFamily: 'Monaco',
    fontSize: 10,
    color: '#5F5D70',
    backgroundColor: 'transparent'
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitText: {
    position: 'absolute',
    zIndex: 5,
    fontFamily: 'Monaco',
    fontSize: 13,
    color: 'white',
    backgroundColor: 'transparent'
  },
});
