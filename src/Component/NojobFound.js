import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import Constants from '../Helpers/constant';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const NojobFound = props => {
  return (
    <View
      style={[
        styles.container,
        props.height !== undefined && {height: props.height},
        props.width !== undefined && {width: props.width},
      ]}>
      {/* <Image
        source={require('../Assets/Images/nojob.png')}
        resizeMode="contain"
        style={styles.image}
      /> */}
      <Text style={styles.header}>{props.header}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: height - 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    color: Constants.white,
    fontSize: 20,
    fontFamily: 'Helvetica',
    fontWeight: '700',
  },
  image: {height: 100, width: 100},
});

export default NojobFound;
