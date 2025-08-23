/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../Screens/Auth/SignIn';
import SignUp from '../Screens/Auth/SignUp';
import { Avatar } from 'react-native-paper';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ForgotPassword from '../Screens/Auth/ForgotPassword';
import ChangePassword from '../Screens/Auth/ChangePassword';
import OtpVerify from '../Screens/Auth/OtpVerify';
import ProviderRoute from './ProviderRoutes';
import styles from './Style';
import UserRoute from './UserRoutes';
import Profile from '../Screens/User/Profile';
import ProfilePro from '../Screens/Provider/ProfilrPro';
import Constants from '../Helpers/constant';
import Privacy from '../Screens/Auth/Privacy';
import NotificationPro from '../Screens/Provider/NotificationPro';
import Terms from '../Screens/Auth/Terms';
import { UserContext } from '../../App';
import { navigate, navigationRef } from '../../navigationRef';
const profilePic = require('../Assets/Images/images.png');
const Stack = createNativeStackNavigator();
// import {Context} from '../../App';
// import Service, {Delete, GetApi, Post, Put} from '../Helpers/Service';

const MainRoutes = props => {
  const [user, setUser] = useContext(UserContext)
  // console.log('userdetail============>', user);
  // const [initial, setInitial] = useContext(Context);
  // useEffect(() => {
  //   // setInitial(props.initial);
  //   console.log(
  //     'navigation.getState()===========>',
  //     navigation.canGoBack(false),
  //   );
  // }, [navigation]);

  const Option = title => {
    // let isSia = user?.identity?.find(f => f.type === 'SI_BATCH');
    // console.log(isSia)
    const opt = {
      safeAreaInset: {
        bottom: 'always',
      },
      headerTintColor: Constants.white,
      headerStyle: { backgroundColor: '#000000', height: 60 },

      headerRight: () => (
        <View>
          {title !== 'Terms And Condition' && (
            <View style={styles.headerRightView}>
              <TouchableOpacity
                onPress={() => {
                  console.log('clicked=>');
                  navigate('provider', {
                    screen: 'Account',
                    params: { screen: 'ProfilePro' },
                  });
                }}>
                <View style={styles.headerAvtarView}>
                  <Avatar.Image size={40} source={profilePic} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ),

      headerTitle: () => {
        return <Text style={styles.headerTitle}>{title}</Text>;
      },
      // headerBackImageSource: () => (
      //   // <Ionicons icon='arrow-back' color="#fff" size={24} />
      //   <Image source={require('../Assets/Images/back.png')} />
      // ),
      // headerTintColor: "white"

      // headerBackVisible: isSia ? true : false,
      headerBackVisible: false
      //  () => {
      //   let isValid;
      //   if (user.identity === undefined || user.identity === null && user.identity.length === 0) {
      //     isValid = false;
      //   } else {
      //     const isSia = user.identity.find(f => f.type === 'SI_BATCH');
      //     if (isSia === undefined) {
      //       isValid = false;
      //     } else {
      //       isValid = true;
      //     }
      //   }
      //   console.log('isValid==========>', isValid)
      //   return isValid
      // }
    };
    return opt;
  };
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={props.initial}>
        {/* {props.initial === 'Signin' && ( */}
        <Stack.Screen options={{ headerShown: false }} name="provider">
          {() => <ProviderRoute />}
        </Stack.Screen>
        <>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Signin"
            component={SignIn}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Signup"
            component={SignUp}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="ForgotPassword"
            component={ForgotPassword}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="OtpVerify"
            component={OtpVerify}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="ChangePassword"
            component={ChangePassword}
          />

          <Stack.Screen
            options={Option('Terms And Condition')}
            name="terms"
            component={Terms}
          />
        </>
        {/* )} */}

        <Stack.Screen options={Option('')} name="Profile" component={Profile} />
        <Stack.Screen
          options={Option('')}
          name="ProfilePro"
          component={ProfilePro}
        />


        <Stack.Screen
          options={Option('Notification')}
          name="NotificationPro"
          component={NotificationPro}
        />

        <Stack.Screen options={{ headerShown: false }} name="user">
          {() => <UserRoute />}
        </Stack.Screen>

        {/* <Stack.Screen
        options={{headerShown: false}}
        name="Service"
        component={Service}
      /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainRoutes;
