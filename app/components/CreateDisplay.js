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

export default class CreateDisplay extends Component<{}> {

  constructor() {
    super();
    this.state = {
      displayTitle: '',
      displayDescription: '',
    };
  }

  render() {
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

          <TouchableOpacity style={styles.saveButton} onPress={this.onSavePressed}>
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
                <View style={styles.categoryImageContainer}>
                  <Image source={require('../img/category_active.png')} />
                  <Image style={styles.categoryInnerImage} source={require('../img/category_icon_animation.png')} />
                </View>
                <Text style={styles.categoryText}>ANIMATION</Text>
              </View>

              <View style={styles.categoryContainer}>
                <View style={styles.categoryImageContainer}>
                  <Image source={require('../img/category_inactive.png')} />
                  <Image style={styles.categoryInnerImage} source={require('../img/category_icon_music.png')} />
                </View>
                <Text style={styles.categoryText}>MUSIC</Text>
              </View>

              <View style={styles.categoryContainer}>
                <View style={styles.categoryImageContainer}>
                  <Image source={require('../img/category_inactive.png')} />
                  <Image style={styles.categoryInnerImage} source={require('../img/category_icon_neighborhood.png')} />
                </View>
                <Text style={styles.categoryText}>NEIGHBORHOOD</Text>
              </View>

              <View style={styles.categoryContainer}>
                <View style={styles.categoryImageContainer}>
                  <Image source={require('../img/category_inactive.png')} />
                  <Image style={styles.categoryInnerImage} source={require('../img/category_icon_charitable.png')} />
                </View>
                <Text style={styles.categoryText}>CHARITABLE</Text>
              </View>
            </View>

            <View style={styles.cameraContainer}>
              <Image style={styles.cameraIcon} source={require('../img/icon_camera.png')} />
              <Text style={styles.cameraText}>ADD COVER PHOTO</Text>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={this.onSavePressed}>
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
    backgroundColor: '#F6F6F9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraIcon: {},
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
