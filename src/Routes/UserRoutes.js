import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Avatar} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import Home from '../Screens/User/HomeUser';
import History from '../Screens/User/History';
import EditPostJob from '../Screens/User/EditPostJob';
import Notification from '../Screens/User/Notification';
import Profile from '../Screens/User/Profile';
import Settings from '../Screens/User/Settings';
import Review from '../Screens/User/Review';
import UpdateCreditCard from '../Screens/User/UpdateCreditCard';
import styles from './Style';
import HomeUser from '../Screens/User/HomeUser';
import Constants from '../Helpers/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobDetail from '../Screens/User/JobDetail';
import Privacy from '../Screens/Auth/Privacy';

// const profilePic = require('../Assets/Images/images.png');

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const UserRoutes = props => {
  const navigation = useNavigation();
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
  };

  const Option = title => {
    const opt = {
      animation: 'none',
      title,
      safeAreaInset: {
        bottom: 'always',
      },
      headerTintColor: Constants.white,
      headerStyle: {backgroundColor: '#000000', height: 60, color: 'white'},
      headerRight: () => (
        <View>
          <View style={styles.headerRightView}>
            <TouchableOpacity
              onPress={() => {
                console.log('clickes==>');
                // navigation.navigate('user', {
                //   screen: 'Account',
                //   params: {screen: 'Profile'},
                // });
                navigation.navigate('Profile');
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
      animation: 'none',
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
      headerShown: false,
      safeAreaInset: {
        bottom: 'always',
      },
      headerTintColor: Constants.white,
      headerStyle: {backgroundColor: '#000000', height: 60},
      headerRight: () => (
        <View>
          <View
            style={[
              styles.headerRightView,
              {
                paddingRight: 20,
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                console.log('clicked=>');
                // navigation.navigate('user', {
                //   screen: 'Account',
                //   params: {screen: 'Profile'},
                // });
                navigation.navigate('Profile');
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
          <Stack.Navigator initialRouteName="HomeUser">
            <Stack.Screen
              options={Option('Job Provider')}
              name="HomeUser"
              component={HomeUser}
            />
            <Stack.Screen
              options={Option('Job Detail')}
              name="JobDetail"
              component={JobDetail}
            />
            <Stack.Screen
              options={Option('')}
              name="EditJob"
              component={EditPostJob}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="History"
        options={taboption(
          'Inbox',
          require('../Assets/Images/History1.png'),
          require('../Assets/Images/History.png'),
        )}>
        {() => (
          <Stack.Navigator initialRouteName="HistoryList">
            <Stack.Screen
              options={Option('History')}
              name="HistoryList"
              component={History}
            />
            <Stack.Screen
              options={Option('Job Detail')}
              name="JobDetail"
              component={JobDetail}
            />
            <Stack.Screen
              options={Option('Review')}
              name="Review"
              component={Review}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Notification"
        options={taboption(
          'Notification',
          require('../Assets/Images/Notification.png'),
          require('../Assets/Images/Notification1.png'),
        )}>
        {() => (
          <Stack.Navigator initialRouteName="Notify">
            <Stack.Screen
              options={Option('Notification')}
              name="Notify"
              component={Notification}
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
          <Stack.Navigator initialRouteName="Settings">
            <Stack.Screen
              options={Option('Settings')}
              name="Settings"
              component={Settings}
            />
            <Stack.Screen
              options={Option('Settings')}
              name="UpdateCreditCard"
              component={UpdateCreditCard}
            />
            <Stack.Screen
              options={Option('Privacy Policy')}
              name="Privacy"
              component={Privacy}
            />
            <Stack.Screen
              options={Option('')}
              name="Profile"
              component={Profile}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default UserRoutes;
