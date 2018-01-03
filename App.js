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

import {Actions, Scene, Router, Stack, Tabs, Drawer, Modal} from 'react-native-router-flux';

import Home from './app/components/Home';
import Login from './app/components/Login';
import EmailLogin from './app/components/EmailLogin';
import Register from './app/components/Register';
import RegisterName from './app/components/RegisterName';
import RegisterBirthdate from './app/components/RegisterBirthdate';
import RegisterPassword from './app/components/RegisterPassword';
import Tutorial from './app/components/Tutorial';
import Discover from './app/components/Discover';
import Profile from './app/components/Profile';
import Map from './app/components/Map';
import CreateDisplay from './app/components/CreateDisplay';
import DisplayDetail from './app/components/DisplayDetail';

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
          <Scene key="emailLogin" component={EmailLogin} hideNavBar />
          <Scene key="register" component={Register} hideNavBar />
          <Scene key="registerName" component={RegisterName} hideNavBar />
          <Scene key="registerBirthdate" component={RegisterBirthdate} hideNavBar />
          <Scene key="registerPassword" component={RegisterPassword} hideNavBar />

          <Scene key="createDisplay" component={CreateDisplay} hideNavBar modal />
          <Scene key="displayDetail" component={DisplayDetail} hideNavBar />

          <Drawer
            hideNavBar={true}
            key='main'
            contentComponent={Sidebar}
            drawerIcon={() => <Image source={require('./app/img/menu_icon.png')} />}>

            <Tabs
              key="tabs"
              tabs
              hideNavBar={true}
              gestureEnabled={false}
              showLabel={false}
              iconStyle={styles.calcTabBarIconStyle}
              tabBarPosition={'bottom'}
              tabBarStyle={styles.calcTabBarStyle}
              tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
              activeBackgroundColor='#fff'>

              <Stack key="tab1" title="discover" icon={TabIcon}>
                <Scene key="discover" component={Discover} title="Discover" hideNavBar={true} />
              </Stack>

              {
                <Stack key="tab2" title="map" icon={TabIcon}>
                  <Scene key="map" component={Map} title="Map" hideNavBar={true}/>
                </Stack>
              }

              {
                <Stack key="tab3" title="profile" icon={TabIcon}>
                  <Scene key="profile" component={Profile} title="Profile" hideNavBar={true} />
                </Stack>
              }

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
