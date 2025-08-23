/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actions-sheet';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';

const CameraGalleryPeacker = props => {

  const options = {
    width: props?.width || 300,
    height: props?.height || 300,
    cropping: props?.crop || false,
    compressImageQuality: props?.quality || 1,
    includeBase64: props.base64,
    useFrontCamera: props?.useFrontCamera ? props?.useFrontCamera : false,
  };
  const launchCamera = () => {
    console.log(options);
    ImagePicker.openCamera(options)
      .then(
        image => {
          console.log(image);
          props.refs.current?.hide();
          props.getImageValue(image);
        },
        err => {
          props.refs.current?.hide();
          console.log(err);
        },
      )
      .catch(e => {
        props.refs.current?.hide();
        // alert(e);
      });
  };

  const launchImageLibrary = () => {
    // if (Platform.OS === 'ios') {
    //   request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
    //     console.log('result ====>', result);
    //     if (result === 'granted') {
    //       ImagePicker.openPicker(options).then(
    //         image => {
    //           props.getImageValue(image);
    //         },
    //         err => {
    //           console.log(err);
    //         },
    //       );
    //     }
    //   });
    // }

    ImagePicker.openPicker(options)
      .then(
        image => {
          console.log(image);
          props.refs.current?.hide();
          props.getImageValue(image);
        },
        err => {
          props.refs.current?.hide();
          console.log(err);
        },
      )
      .catch(e => {
        props.refs.current?.hide();
        // alert(e);
      });
  };

  return (
    <ActionSheet
      ref={props.refs}
      containerStyle={{ backgroundColor: props.backgroundColor }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 30 }}>
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              color: props.headerColor,
              fontSize: 20,
              fontWeight: '700',
              marginBottom: 20,
            }}>
            Choose your photo
          </Text>
        </View>
        <TouchableOpacity
          style={{ flexDirection: 'row', width: '100%' }}
          onPress={() => {
            launchCamera();
            // props.refs.current?.hide();
          }}>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                color: props.titleColor,
                fontSize: 18,
                fontWeight: '500',
                opacity: 0.7,
              }}>
              Take a Picture
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flexDirection: 'row', marginTop: 10 }}
          onPress={() => {
            launchImageLibrary();
            // props.refs.current?.hide();
          }}>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                color: props.titleColor,
                fontSize: 18,
                fontWeight: '500',
                opacity: 0.7,
              }}>
              Choose from gallery
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'flex-end',
          }}
          onPress={() => {
            props.refs.current?.hide();
          }}>
          <View style={{ marginLeft: 10, width: '100%' }}>
            <Text
              style={{
                color: props.cancelButtonColor,
                fontSize: 18,
                fontWeight: '500',
                textAlign: 'right',
                marginRight: 20,
              }}>
              CANCEL
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );
};

export default CameraGalleryPeacker;
