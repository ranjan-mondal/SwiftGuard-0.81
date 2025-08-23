/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import styles from './StylesUser';
import CoustomDropdown from '../../Component/CoustomDropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Constants from '../../Helpers/constant';
import RateView from '../../Component/RateView';
import {
  checkForEmptyKeys,
  checkNumber,
  checkEmail,
} from '../../Helpers/InputsNullChecker';
import { Post } from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Review = props => {
  const dList = [
    { name: 'Awesome service', type: 'Awesome service' },
    { name: 'Polite behaviour', type: 'Polite behaviour' },
    { name: 'Good work', type: 'Good work' },
    { name: 'Recommended', type: 'Recommended' },
    { name: 'Not Recommended', type: 'Not Recommended' },
    { name: 'Bad service/behaviour', type: 'Bad service/behaviour' },
  ];
  const [dropList, setDropList] = useState(dList);
  const [showDrop, setShowrop] = useState(false);
  const [dropValue, setDropValue] = useState('Awesome service');
  const [rate, setrate] = useState(0);
  const [filedCheck, setfiledCheck] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewObj, setReviewObj] = useState({
    title: '',
    details: '',
    rating: '',
  });

  const getDropValue = title => {
    setDropValue(title);
    setShowrop(false);
    setReviewObj({ ...reviewObj, title });
  };

  const getRateValue = review => {
    setrate(review);
    setReviewObj({ ...reviewObj, rating: review });
  };

  const submit = () => {
    let { anyEmptyInputs } = checkForEmptyKeys(reviewObj);
    setfiledCheck(anyEmptyInputs);

    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
    } else {
      const data = {
        title: reviewObj.title,
        details: reviewObj.details,
        job_id: props?.route?.params.job_id,
        rating: reviewObj.rating,
      };
      console.log('data==========>', data);
      setLoading(true);
      Post('user/review', data, { ...props }).then(
        async res => {
          setLoading(false);
          console.log(res);
          if (res.status) {
            Toaster(res.data.message);
            setReviewObj({
              title: '',
              details: '',
              rating: '',
            });
            props.navigation.navigate('HistoryList');
          } else {
            Toaster(res.message);
          }
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
    }
  };

  return (
    <View style={styles.container}>
      <Spinner color={'#fff'} visible={loading} />
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={[styles.postjobView3, { marginTop: 40 }]}>
          <View
            style={[
              styles.selectjobname,
              { flexDirection: 'row', padding: 10, justifyContent: 'flex-start' },
            ]}>
            {/* <Text style={styles.jobId}>Job id :-</Text> */}
            <Text
              style={[
                styles.jobId,
                { color: Constants.white, marginLeft: 5, flexWrap: 'wrap' },
              ]}>
              {props?.route.params?.title}
            </Text>
          </View>
          <View
            style={[styles.selectjobname, { flexDirection: 'row', padding: 10 }]}>
            <View style={{ flex: 7 }}>
              <Text style={[styles.jobname, { color: Constants.white }]}>
                {dropValue}
              </Text>
            </View>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'flex-end' }}
              onPress={() => setShowrop(true)}>
              <Ionicons
                name="chevron-down-outline"
                color={Constants.red}
                size={20}
              />
            </TouchableOpacity>
            <CoustomDropdown
              visible={showDrop}
              setVisible={setShowrop}
              getDropValue={getDropValue}
              data={dropList}
            />
          </View>
          {filedCheck.includes('TITLE') && (
            <Text style={{ color: 'red' }}> Title is required</Text>
          )}
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={[styles.showAmount, { fontSize: 14 }]}>
              Job Details....
            </Text>
            <TextInput
              multiline={true}
              numberOfLines={5}
              value={reviewObj.details}
              placeholder="Description"
              placeholderTextColor={Constants.grey}
              textAlignVertical="top"
              style={{ color: 'white', flex: 1, flexWrap: 'wrap' }}
              onChangeText={details => setReviewObj({ ...reviewObj, details })}
            />
            {filedCheck.includes('DETAILS') && (
              <Text style={{ color: 'red' }}> Detail is required</Text>
            )}
          </View>
          <View style={{ marginTop: 20 }}>
            <RateView
              rate={rate}
              getRateValue={getRateValue}
              checkedColor={Constants.red}
              uncheckedColor={Constants.lightgrey}
            />
          </View>
          {filedCheck.includes('RATING') && (
            <Text style={{ color: 'red' }}> Rating is required</Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              // marginRight: 20,
            }}>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => {
                  submit();
                }}
                style={[styles.applyBtn, { width: '100%', height: 50 }]}>
                <Text
                  style={[styles.applyBtnTxt, { fontSize: 22, lineHeight: 25 }]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Review;
