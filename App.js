/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { View, Text, StatusBar, Platform } from 'react-native';
import React, { useState, useEffect, createContext } from 'react';
import MainRoutes from './src/Routes/MainRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OneSignal } from 'react-native-onesignal';
import { Notifications } from 'react-native-notifications';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import DeviceInfo from 'react-native-device-info';
import VersionInfo from 'react-native-version-info';
// import {
//   setJSExceptionHandler,
//   setNativeExceptionHandler,
// } from 'react-native-exception-handler';
import CustomToaster from './src/Component/CustomToaster';
import Constants from './src/Helpers/constant';
import { GetApi } from './src/Helpers/Service';
import ImageCropPicker from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    Alert.alert(
      'Unexpected error occurred',
      `
        Error: ${isFatal ? 'Fatal:' : ''} ${e.name} ${e.message}
        We have reported this to our team ! Please close the app and start again!
        `,
      [
        {
          text: 'Close',
        },
      ],
    );
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

// setJSExceptionHandler(errorHandler, true);

// setNativeExceptionHandler(errorString => {
//   console.log(errorString);
// });

export const Context = React.createContext();
export const ToastContext = React.createContext();
export const UserContext = React.createContext();

const APP_ID = 'fbe6ed10-63ce-4916-a097-e60c3cfed693';
const SENDER_ID = '2552422751';

const App = (props) => {
  // causeJSError = () => {
  //   throw new Error('THIS IS A CUSTOM UNHANDLED JS ERROR');
  // };
  // causeNativeError = () => {
  //   RnTestExceptionHandler.raiseTestNativeError();
  // };
  const [initial, setInitial] = useState('');
  // const routeNameRef = React.useRef();
  // const navigationRef = React.useRef();
  const [toast, setToast] = useState('');
  const [user, setUser] = useState({});
  useEffect(() => {

    setInitialRoute()
  }, []);

  // useEffect(() => {
  //   if (initial === 'provider') {
  //     getProfile();
  //   }
  // }, [initial]);

  const getProfile = () => {
    // setLoading(true);
    GetApi('me', { ...props, setInitial }).then(
      async res => {
        // setLoading(false);
        // console.log('Security Guard Profile:', res.data);
        console.log(res.data);
        if (res.status) {
          AsyncStorage.setItem('userDetail', JSON.stringify(res?.data));
          await AsyncStorage.setItem('profilePic', res?.data?.profile || '');
          setUser(res.data);
          if (res.data.verified) {
            setInitial('provider');
            // setInitial('provider');
            // props.navigation.reset('provider', {
            //   screen: 'Home',
            //   params: { screen: 'ServiceProvider' },
            // });

            // navigate('provider', {
            //   screen: 'Home',
            //   params: { screen: 'ServiceProvider' },
            // });
            // navigationRef?.current?.reset('provider')
            return
          }
          // console.log('profile=========>', res.data);
          if (!res.data.identity) {
            setToast('Please add your SIA Badge and get access full app');
            setInitial('ProfilePro');
          } else {
            const isSia = res.data.identity.find(f => f.type === 'SI_BATCH')
            // console.log('sia--------->fromapp', isSia)
            if (!isSia?._id) {
              setToast('Please add your SIA Badge and get access full app');
              setInitial('ProfilePro');
              // navigate('ProfilePro');
            } else {
              setInitial('provider');
              // navigate('provider', {
              //   screen: 'Home',
              //   params: { screen: 'ServiceProvider' },
              // });

              // navigationRef?.current?.navigate('ProfilePro');
            }
          }
          // if (res?.data?.verified !== 'true') {

          // }
          if (res?.data.type === 'USER') {
            setInitial('user');
          } else if (res?.data.type === 'PROVIDER') {
            setInitial('provider');
          }
        } else {
          setInitial('Signin');
          setToast(res.message);
        }
      },
      err => {
        // setLoading(false);
        setInitial('Signin');
        console.log(err);
      },
    );
  };

  const setInitialRoute = async () => {
    const users = await AsyncStorage.getItem('userDetail');
    const userDetail = JSON.parse(users);
    const token = await AsyncStorage.getItem(
      'token',
    );
    console.log('userDetail======================>', userDetail)
    console.log('userDetail======================>', token)

    if (userDetail?.id || userDetail?._id) {
      // if (!userDetail.verified) {
      //   setInitial('Signin');
      //   await AsyncStorage.removeItem('userDetail');
      //   // setInitial('provider');
      //   // reset('Signin');
      //   return;
      // }
      // setInitial('provider');
      getProfile()
      // setUser(userDetail)
      // if (userDetail?.verified !== 'true') {

      //   setToast('Your account is not verified by admin. Please check your pending documents');
      //   navigationRef?.current?.navigate('ProfilePro');
      // }
    }
    if (userDetail === null) {
      setInitial('Signin');
    }
    // else 
    // if (userDetail.type === 'USER') {
    //   setInitial('user');
    // } else if (userDetail.type === 'PROVIDER') {
    //   setInitial('provider');
    // }
  };

  useEffect(() => {
    // OneSignal.addTrigger('showPrompt', 'true');
    // OneSignal.setLogLevel(6, 0);
    OneSignal.initialize(APP_ID);


    // OneSignal.setNotificationWillShowInForegroundHandler(
    //   notificationReceivedEvent => {
    //     // console.log(
    //     //   'OneSignal: notification will show in foreground:',
    //     //   notificationReceivedEvent,
    //     // );
    //     let notification = notificationReceivedEvent.getNotification();
    //     // console.log('notification: ', notification);
    //     const data = notification.additionalData;
    //     // console.log('additionalData: ', data);
    //     // Complete with null means don't show a notification.
    //     notificationReceivedEvent.complete(notification);
    //   },
    // );

    // OneSignal.addEventListener('received', onReceived) .
  }, [OneSignal]);

  useEffect(() => {

    const inAppUpdates = new SpInAppUpdates(
      true,
    );
    ImageCropPicker.clean().then(() => {
      console.log('removed all tmp images from tmp directory');
    }).catch(e => {

    });

    try {
      inAppUpdates.checkNeedsUpdate({ curVersion: VersionInfo?.appVersion }).then(
        result => {
          // console.log(result.shouldUpdate);
          if (result.shouldUpdate) {
            const updateOptions = Platform.select({
              ios: {
                title: 'Update available',
                message:
                  'There is a new version of the app available on the App Store, do you want to update it?',
                buttonUpgradeText: 'Update',
                buttonCancelText: 'Cancel',
              },
              android: {
                updateType: IAUUpdateKind.IMMEDIATE,
              },
            });
            inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
          }
        },
        err => {
          console.log(err);
        },
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <Context.Provider value={[initial, setInitial]}>
      <ToastContext.Provider value={[toast, setToast]}>
        <UserContext.Provider value={[user, setUser]}>
          <SafeAreaView style={{ flex: 1, backgroundColor: Constants.newBlack }}>
            <CustomToaster
              color={Constants.black}
              backgroundColor={Constants.white}
              timeout={4000}
              toast={toast}
              setToast={setToast}
            />
            <StatusBar
              backgroundColor="#000000"
              barStyle="light-content"
              translucent={true}
            />
            {initial != '' && <MainRoutes initial={initial} />}
          </SafeAreaView>
          {/* {initial !== '' && ( */}

          {/* )} */}
        </UserContext.Provider>
      </ToastContext.Provider>
    </Context.Provider>
  );
};

export default App;

// https://sp-app-api.herokuapp.com/
