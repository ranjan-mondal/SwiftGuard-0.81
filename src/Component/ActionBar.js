import {View, Text} from 'react-native';
import React from 'react';
import ActionSheet from 'react-native-actions-sheet';

const ActionBar = props => {
  return (
    <ActionSheet
      ref={props.ref}
      containerStyle={{backgroundColor: props.backgroundColor}}>
      <View style={{paddingHorizontal: 20, paddingVertical: 30}}>
        <View style={{marginLeft: 10}}>
          <Text
            style={{
              color: '#000',
              fontSize: 20,
              fontWeight: '700',
              marginBottom: 20,
            }}>
            Choose your photo
          </Text>
        </View>
        <TouchableOpacity
          style={{flexDirection: 'row', width: '100%'}}
          onPress={() => {
            props.launchCamera();
            props.ref.current?.hide();
          }}>
          <View style={{marginLeft: 10}}>
            <Text
              style={{
                color: '#000',
                fontSize: 18,
                fontWeight: '500',
                opacity: 0.7,
              }}>
              Take a Picture
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{flexDirection: 'row', marginTop: 10}}
          onPress={() => {
            props.launchImageLibrary();
            props.ref.current?.hide();
          }}>
          <View style={{marginLeft: 10}}>
            <Text
              style={{
                color: '#000',
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
            props.ref.current?.hide();
          }}>
          <View style={{marginLeft: 10, width: '100%'}}>
            <Text
              style={{
                color: '#850631',
                fontSize: 18,
                fontWeight: '500',
                textAlign: 'right',
                marginRight: 20,
              }}>
              CANCEL
            </Text>
          </View>
        </TouchableOpacity>

        {/* </RadioButton.Group> */}
      </View>
    </ActionSheet>
  );
};

export default ActionBar;
