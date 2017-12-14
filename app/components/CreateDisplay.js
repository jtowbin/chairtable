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
  TextInput
} from 'react-native';

import firebase from 'react-native-firebase';
import {Actions} from 'react-native-router-flux';

var ImagePicker = require('react-native-image-picker');
var uuid = require('uuid-js');

// More info on all the options is below in the README...just some common use cases shown here
var options = {
  title: 'Select Avatar',
  customButtons: [
    {name: 'fb', title: 'Choose Photo from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

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
      displayCategory: 'Animation',
      avatarSource: null// { uri: 'https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/68dd54ca-60cf-4ef7-898b-26d7cbe48ec7/10-dithering-opt.jpg' }
    };
  }

  render() {
    var imageCapture = <View style={styles.emptyCameraContainer}>
      <Image source={require('../img/icon_camera.png')} /><Text style={styles.cameraText}>ADD COVER PHOTO</Text>
    </View>;

    if (this.state.avatarSource != null) {
      imageCapture = <Image style={styles.cameraIcon} source={this.state.avatarSource} />
    }

    return (
      // <View style={styles.container}>
      <ImageBackground
        resizeMode={'cover'}
        source={require('../img/map_add_display.png')}
        style={styles.container}>
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

            <View style={styles.categoriesContainer}>
              <View style={styles.categoryContainer}>
                <TouchableOpacity style={styles.categoryImageContainer} onPress={() => this.setState({'displayCategory' : CATEGORY_ANIMATION})}>
                  <Image source={this.state.displayCategory == CATEGORY_ANIMATION ? require('../img/category_active.png') : require('../img/category_inactive.png')} />
                  <Image style={styles.categoryInnerImage} source={this.state.displayCategory == CATEGORY_ANIMATION ? require('../img/category_icon_animation_inactive.png') : require('../img/category_icon_animation_active.png')} />
                </TouchableOpacity>
                <Text style={styles.categoryText}>ANIMATION</Text>
              </View>

              <View style={styles.categoryContainer}>
                <TouchableOpacity style={styles.categoryImageContainer} onPress={() => this.setState({'displayCategory' : CATEGORY_MUSIC})}>
                  <Image source={this.state.displayCategory == CATEGORY_MUSIC ? require('../img/category_active.png') : require('../img/category_inactive.png')} />
                  <Image style={styles.categoryInnerImage} source={this.state.displayCategory == CATEGORY_MUSIC ? require('../img/category_icon_music_inactive.png') : require('../img/category_icon_music_active.png')} />
                </TouchableOpacity>
                <Text style={styles.categoryText}>MUSIC</Text>
              </View>

              <View style={styles.categoryContainer}>
                <TouchableOpacity style={styles.categoryImageContainer} onPress={() => this.setState({'displayCategory' : CATEGORY_RESIDENTIAL})}>
                  <Image source={this.state.displayCategory == CATEGORY_RESIDENTIAL ? require('../img/category_active.png') : require('../img/category_inactive.png')} />
                  <Image style={styles.categoryInnerImage} source={this.state.displayCategory == CATEGORY_RESIDENTIAL ? require('../img/category_icon_neighborhood_inactive.png') : require('../img/category_icon_neighborhood_active.png')} />
                </TouchableOpacity>
                <Text style={styles.categoryText}>NEIGHBORHOOD</Text>
              </View>

              <View style={styles.categoryContainer}>
                <TouchableOpacity style={styles.categoryImageContainer} onPress={() => this.setState({'displayCategory' : CATEGORY_CHARITABLE})}>
                  <Image source={this.state.displayCategory == CATEGORY_CHARITABLE ? require('../img/category_active.png') : require('../img/category_inactive.png')} />
                  <Image style={styles.categoryInnerImage} source={this.state.displayCategory == CATEGORY_CHARITABLE ? require('../img/category_icon_charitable_inactive.png') : require('../img/category_icon_charitable_active.png')} />
                </TouchableOpacity>
                <Text style={styles.categoryText}>CHARITABLE</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.cameraContainer} onPress={this.onAddCoverPhoto.bind(this)}>
              {imageCapture}
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={this.onSavePressed.bind(this)}>
              <Image source={require('../img/round_button.png')} />
              <Text style={styles.submitText}>ADD NEW DISPLAY</Text>
            </TouchableOpacity>

          </View>

        </ImageBackground>

      </ImageBackground>
    );
  }

  onCancelPressed() {
    Actions.pop();
  }

  onSavePressed() {
    // upload image to firebase storage
    var storageRef = firebase.storage().ref();
    var imagesRef = storageRef.child('user_created/' + uuid.create() + '.jpg');
    imagesRef.put(this.state.avatarSource.uri).then(function(snapshot) {
      console.log('Uploaded a data_url string!');
      console.log(snapshot.downloadURL);

      firebase.database().ref('user_displays').set({
        // title: this.state.displayTitle,
        // description: this.state.displayDescription,
        // category: this.state.displayCategory,
        profile_picture: snapshot.downloadURL
      });
    }).catch(function(error) {
      console.log('Could not upload image');
    });
  }

  onCategoryPressed() {
    this.setState({displayCategory: 'Animation'});
  }

  onAddCoverPhoto() {
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

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyCameraContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F6F6F9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraIcon: {
    width: '100%',
    height: '100%'
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
