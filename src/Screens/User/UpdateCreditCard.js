/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useState } from 'react';
import styles from './StylesUser';
import { Context } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import Constants from '../../Helpers/constant';


const UpdateCreditCard = props => {
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  return (
    <View style={styles.container}>
      <CustomToaster
        color={Constants.black}
        backgroundColor={Constants.white}
        timeout={5000}
        toast={toast}
        setToast={setToast}
      />
      <ScrollView style={{ marginTop: 40 }}>
        <View>
          <Text style={styles.listtypeName}>Update Credit Card</Text>
          <View style={styles.updatecardView}>
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.listtypeName, { fontSize: 16 }]}>
                First Name
              </Text>
              <TextInput style={styles.updatecardInput} />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.listtypeName, { fontSize: 16 }]}>
                Last Name
              </Text>
              <TextInput style={styles.updatecardInput} />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.listtypeName, { fontSize: 16 }]}>
                Credit Card Number
              </Text>
              <TextInput style={styles.updatecardInput} />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.listtypeName, { fontSize: 16 }]}>
                Expiration Date
              </Text>
              <TextInput style={styles.updatecardInput} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 20,
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('Review');
                  }}
                  style={[
                    styles.applyBtn,
                    {
                      height: 50,
                      width: '100%',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.applyBtnTxt,
                      { fontSize: 22, lineHeight: 25 },
                    ]}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateCreditCard;
