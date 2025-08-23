/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
// import {View, Text} from 'react-native';
import {
  View,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import Constants from '../Helpers/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';

const width = Dimensions.get('screen').width;
const CoustomDropdown = props => {
  const [select, setSelect] = useState(props.data[0]);
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={props.visible}
      style={{ zIndex: 1100 }}
      onRequestClose={() => { }}>
      <View style={Styles.modalBackground}>
        <View style={Styles.activityIndicatorWrapper}>
          <View
            style={{
              borderTopColor: Constants.red,
              borderTopWidth: 5,
              // borderRadius: 10,
              padding: 20,
              width: width * 0.8,
              backgroundColor: Constants.white,
              position: 'relative',
            }}>
            <TouchableOpacity style={{ position: 'absolute', right: 5, top: 5, height: 35, width: 35 }} onPress={() => { props.setVisible(false) }} zIndex={9}>
              <Ionicons name="close-circle-outline" size={35} color={Constants.red} />
            </TouchableOpacity>
            {!!props.title && (
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  color: Constants.red,
                  marginBottom: 18,
                  fontFamily: 'Helvetica',
                }}>
                {props.title}
              </Text>
            )}
            {props.data !== undefined &&
              props.data.map((item, index) => (
                <Text
                  key={index}
                  style={{
                    color: select.name === item.name ? Constants.red : Constants.black,
                    fontSize: 16,
                    lineHeight: 25,
                    fontWeight: '700',
                    borderBottomColor: Constants.lightgrey,
                    borderBottomWidth: 1,
                    paddingBottom: 5,
                  }}
                  onPress={() => setSelect(item)}>
                  {item.name}
                </Text>
              ))}

            <View style={{
              flexDirection: 'row', justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
              <TouchableOpacity onPress={() => props.getDropValue(select.name, select.type)} style={{
                backgroundColor: Constants.red,
                width: 100,
                height: 35,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
              }}>
                <Text style={{ color: Constants.white }}>{props?.name || 'Select'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    // height:'80%',
    // width:'80%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  activityIndicatorWrapper: {
    flex: 1,
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    marginTop: 210,
    // justifyContent: 'space-around',
  },
});

export default CoustomDropdown;
