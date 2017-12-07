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
  AsyncStorage
} from 'react-native';

import {Actions, Scene, Router, Stack, Tabs, Drawer} from 'react-native-router-flux';

import Home from './app/components/Home';
import Login from './app/components/Login';
import Tutorial from './app/components/Tutorial';
import Discover from './app/components/Discover';
import Profile from './app/components/Profile';
import Map from './app/components/Map';

import Sidebar from './app/components/Sidebar';

const tabbarNormalIcons = {
  'discover': require('./app/img/tab_discover_normal.png'),
  'map': require('./app/img/tab_map_normal.png'),
  'profile': require('./app/img/tab_profile_normal.png'),
};

const tabbarSelectedIcons = {
  'discover': require('./app/img/tab_discover_selected.png'),
  'map': require('./app/img/tab_map_selected.png'),
  'profile': require('./app/img/tab_profile_selected.png'),
};

const TabIcon = (props) => {
  return (
    <Image
      source={props.focused ? tabbarSelectedIcons[props.title] : tabbarNormalIcons[props.title]}
      style={{width: 21, height: 22}} />
  );
}

export default class App extends Component<{}> {

  render() {
    return (
      <Router>

        <Stack key="root">

          <Scene key="home" component={Home} hideNavBar={false}/>
          <Scene key="tutorial" component={Tutorial} hideNavBar />
          <Scene key="login" component={Login} hideNavBar />

          <Drawer
            hideNavBar
            key='home'
            contentComponent={Sidebar}>

            <Tabs
              key="main"
              tabs
              hideNavBar
              gestureEnabled={false}
              showLabel={false}
              iconStyle={styles.calcTabBarIconStyle}
              tabBarPosition={'bottom'}
              tabBarStyle={styles.calcTabBarStyle}
              tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
              activeBackgroundColor='#fff'>

              <Stack key="calcTab1" title="discover" icon={TabIcon}>
                <Scene key="discover" component={Discover} title="Discover"/>
              </Stack>

              <Stack key="calcTab2" title="map" icon={TabIcon}>
                <Scene key="map" component={Map} title="Map"/>
              </Stack>

              <Stack key="calcTab3" title="profile" icon={TabIcon}>
                <Scene key="profile" component={Profile} title="Profile"/>
              </Stack>

            </Tabs>

          </Drawer>

        </Stack>

      </Router>
    );
  }
}

const styles = StyleSheet.create({
  calcTabBarStyle: {
    // backgroundColor: '#ddd',
    // height: 80
  },
  tabBarStyle: {
    // backgroundColor: '#ddd',
  },
  tabBarSelectedItemStyle: {
    // backgroundColor: '#fff',
  },
  calcTabBarIconStyle: {
    // height: 80
  }
});
