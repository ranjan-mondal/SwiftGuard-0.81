/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Avatar} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from '../Screens/Provider/Home';
import Report from '../Screens/Provider/Report';
import NotificationPro from '../Screens/Provider/NotificationPro';
import ProfilePro from '../Screens/Provider/ProfilrPro';
import styles from './Style';
import HistoryPro from '../Screens/Provider/HistoryPro';
import SettingPro from '../Screens/Provider/SettingPro';
import MyUpcomingJob from '../Screens/Provider/MyUpcomingJob';
import AvailableJob from '../Screens/Provider/AvailableJob';
import Constants from '../Helpers/constant';
import Privacy from '../Screens/Auth/Privacy';

// const profilePic = require('../Assets/Images/images.png');

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ProviderRoutes = props => {
  const navigation = useNavigation();
  // console.log('navigation=///////////==>', navigation.getState().routes.state);
  const [profilePic, setProfilePic] = useState(
    require('../Assets/Images/images.png'),
  );

  useEffect(() => {
    userdetail();
    const willFocusSubscription = navigation.addListener('focus', () => {
      userdetail();
    });
    return () => {
      willFocusSubscription;
    };
  }, [navigation.getState()]);

  useEffect(() => {
    userdetail();
  }, []);

  const userdetail = async () => {
    const profile = await AsyncStorage.getItem('profilePic');
    if (profile !== undefined && profile !== null && profile !== '') {
      setProfilePic({uri: profile});
    }
    // console.log('profilePic========>', profilePic);
  };

  const Option = title => {
    const opt = {
      // title,
      // headerShown: title !== 'Security Guard',
      safeAreaInset: {
        bottom: 'always',
      },
      headerTintColor: Constants.white,
      headerStyle: {backgroundColor: '#000000', height: 60},

      headerRight: () => (
        <View>
          <View style={styles.headerRightView}>
            <TouchableOpacity
              onPress={() => {
                console.log('clicked=>');
                // navigation.navigate('provider', {
                //   screen: 'Account',
                //   params: {screen: 'ProfilePro'},
                // });
                navigation.navigate('ProfilePro');
              }}>
              <View style={styles.headerAvtarView}>
                <Avatar.Image size={40} source={profilePic} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ),

      headerTitle: () => {
        return <Text style={styles.headerTitle}>{title}</Text>;
      },
    };
    return opt;
  };
  const taboption = (title, icon, focusIcon) => {
    const opt = {
      tabBarIcon: ({focused}) => (
        <Image
          source={focused ? focusIcon : icon}
          style={{height: 25, width: 25, marginTop: 10}}
          resizeMode="contain"
        />
      ),

      tabBarLabelStyle: {
        ...styles.tabBarLabelStyle,
      },
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        ...styles.tabBarStyle,
      },
      headerTintColor: Constants.white,
      headerShown: false,
      safeAreaInset: {
        bottom: 'always',
      },

      headerStyle: {backgroundColor: '#000000', height: 60},

      headerRight: () => (
        <View>
          <View
            style={[
              styles.headerRightView,
              {
                paddingRight: 20,
                paddingLeft: 5,
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                console.log('clicked=>');
                // navigation.navigate('provider', {
                //   screen: 'Account',
                //   params: {screen: 'ProfilePro'},
                // });
                navigation.navigate('ProfilePro');
              }}>
              <View style={styles.headerAvtarView}>
                <Avatar.Image size={40} source={profilePic} />
              </View>
            </TouchableOpacity>
          </View>
          {/* )} */}
        </View>
      ),

      headerTitle: () => {
        return <Text style={styles.headerTitle}>{title}</Text>;
      },
    };
    return opt;
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#9AC96A',
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        options={taboption(
          'Home',
          require('../Assets/Images/home.png'),
          require('../Assets/Images/home1.png'),
        )}>
        {() => (
          <Stack.Navigator initialRouteName="ServiceProvider">
            <Stack.Screen
              options={Option('Security Guard')}
              name="ServiceProvider"
              component={Home}
            />
            <Stack.Screen
              options={Option('Report')}
              name="Report"
              component={Report}
            />
            <Stack.Screen
              options={Option('Confirmed Jobs')}
              name="MyUpcomingJob"
              component={MyUpcomingJob}
            />
            <Stack.Screen
              options={Option('Available Jobs')}
              name="AvailableJob"
              component={AvailableJob}
            />
            <Stack.Screen
              options={Option('Notification')}
              name="NotificationPro"
              component={NotificationPro}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="History"
        options={taboption(
          'History',
          require('../Assets/Images/History1.png'),
          require('../Assets/Images/History.png'),
        )}>
        {() => (
          <Stack.Navigator initialRouteName="HistoryPro">
            <Stack.Screen
              options={Option('History')}
              name="HistoryPro"
              component={HistoryPro}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Notification"
        // initialParams={{screen: 'NotificationPro', params: {status: 'All'}}}
        options={taboption(
          'Notification',
          require('../Assets/Images/Notification.png'),
          require('../Assets/Images/Notification1.png'),
        )}>
        {() => (
          <Stack.Navigator initialRouteName="NotificationPro">
            <Stack.Screen
              options={Option('Notification')}
              name="NotificationPro"
              component={NotificationPro}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Account"
        options={taboption(
          'Account',
          require('../Assets/Images/setting.png'),
          require('../Assets/Images/setting1.png'),
        )}>
        {() => (
          <Stack.Navigator initialRouteName="SettingPro">
            <Stack.Screen
              options={Option('Settings')}
              name="SettingPro"
              component={SettingPro}
            />
            <Stack.Screen
              options={Option('Privacy Policy')}
              name="Privacy"
              component={Privacy}
            />
            <Stack.Screen
              options={Option('')}
              name="ProfilePro"
              component={ProfilePro}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default ProviderRoutes;
