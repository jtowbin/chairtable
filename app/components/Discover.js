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

export default class Discover extends Component<{}> {

  render() {
    return (
      <ImageBackground
        resizeMode={'cover'}
        source={require('../img/blurr.png')}
        style={styles.container}>
        <FlatList
          data={[
            {
              title: 'Ivar\'s Clam Lights',
              image: 'sample_spot_1.png'
            },
            {
              title: 'Richmond Tacky Light House',
              image: 'sample_spot_2.png'
            }
          ]}
          renderItem={({item}) =>
            <View style={{marginLeft: 0, marginRight: 0, marginBottom: 20, flexDirection: 'column', backgroundColor: 'white'}}>
              <Image resizeMode={'contain'} source={require('../img/sample_spot_1.png')} />
              <Text style={{marginLeft: 10, marginBottom: 5, fontSize: 17}}>{item.title}</Text>
              <View style={{marginLeft: 10, marginBottom: 20, flexDirection: 'row'}}>
                <Text style={{fontSize: 12}}>4.2 / 5.0 * 1.3 MI NEARBY</Text>
              </View>
            </View>}
          />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
});
