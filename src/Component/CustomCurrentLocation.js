import { View, Text, PermissionsAndroid, Platform } from 'react-native';
import React from 'react';
import Geolocation from 'react-native-geolocation-service';
import {
  request,
  PERMISSIONS,
  requestLocationAccuracy,
} from 'react-native-permissions';

const CustomCurrentLocation = async getLocation => {
  try {
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
        console.log(result);
        if (result === 'granted') {
          Geolocation.getCurrentPosition(
            position => {
              getLocation(position);
            },
            error => {
              console.log('errrr=========================================>', error.code, error.message);
              //   return error;
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        }
      });
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      console.log(granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log(granted);
        Geolocation.getCurrentPosition(
          position => {
            getLocation(position);
          },
          error => {
            console.log('errrr=========================================>', error.code, error.message);
            //   return error;
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } else {
        console.log('location permission denied');
      }
    }
  } catch (err) {
    console.log('location err =====>', err);
  }
};

export default CustomCurrentLocation;
