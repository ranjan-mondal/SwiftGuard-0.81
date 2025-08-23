import React from 'react';
import {View, Text, ToastAndroid, StyleSheet, Modal} from 'react-native';
// import Toast from 'react-native-simple-toast';

const Toaster = toast => {
  // console.log(toast)
  return (
    // ToastAndroid.show(toast, ToastAndroid.LONG)
    // setTimeout(() => {
    //   Toast.show(toast, Toast.LONG);
    // }, 0)
    null
  );
};

// const Toaster = toast => {
//   return (
//     <Modal
//       transparent={true}
//       animationType={'none'}
//       visible={true}
//       style={{zIndex: 1100}}
//       onRequestClose={() => {}}>
//       <View style={{backgroundColor: 'white'}}>
//         <Text style={{color: '#000000'}}>{toast}</Text>
//       </View>
//     </Modal>
//   );
// };

// const Styles = StyleSheet.create({
//   modalBackground: {
//     flex: 1,
//     // height:'80%',
//     // width:'80%',
//     alignItems: 'center',
//     flexDirection: 'column',
//     justifyContent: 'space-around',
//     backgroundColor: '#rgba(0, 0, 0, 0.5)',
//     zIndex: 9999,
//   },
//   activityIndicatorWrapper: {
//     flex: 1,
//     height: 100,
//     width: 100,
//     borderRadius: 10,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-around',
//   },
// });

export default Toaster;
