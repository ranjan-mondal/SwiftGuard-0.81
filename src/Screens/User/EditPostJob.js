/* eslint-disable no-shadow */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useState, useEffect, useContext, createRef, useRef } from 'react';
import styles from './StylesUser';
import Constants from '../../Helpers/constant';
import { Checkbox } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CoustomDropdown from '../../Component/CoustomDropdown';
import moment from 'moment';
import DateTimePeacker from '../../Component/DateTimePeacker';
import { checkForEmptyKeys } from '../../Helpers/InputsNullChecker';
import { GetApi, Post, Put } from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationDropdown from '../../Component/LocationDropdown';
import { Context } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import MultiSelect from 'react-native-multiple-select';


const EditPostJob = props => {
  const dList = [{ title: 'Driving Liecense', type: 'DL' }];
  const [toast, setToast] = useState('');
  const { title, jobId } = props?.route?.params;
  const [initial, setInitial] = useContext(Context);
  const [dropList, setDropList] = useState(dList);
  const [showDrop, setShowrop] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [datepeack, setDate] = useState(new Date());
  const [mode, setMode] = useState('');
  const [keys, setKeys] = useState('');
  const [loading, setLoading] = useState(false);
  const [filedCheck, setfiledCheck] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState([]);
  const [jobTitleSelected, setjobTitleSelected] = useState([]);
  const [items, setItems] = useState([]);
  const [check, setCheck] = useState('checked');
  const [minMax, setMinMax] = useState({});
  const [type, setType] = useState('');

  const multiSelect = useRef();
  const singleSelect = useRef();

  const [jobInfo, setJobInfo] = useState({
    startDate: 'DD/MM/YY 00:00',
    endDate: 'DD/MM/YY 00:00',
    title: 'Job Name',
    location: '',
    latitude: '',
    longitude: '',
    description:
      'Resumption: Please try to arrive 10 minutes before your resumption time so you can be at your duty post on time.\n \nDress code: Clean Black suit, white shirt, black shoes, and black tie.\n \nDuties: Customer service and security service.\n \nCancellation policy: If after accepting this shift, you change your mind, please notify the Operation Manager via text (07827297538) at least 48 hours before the start of your shift, otherwise you will be fined for not complying with our cancellation policy',
    jobtype: 'event',
    amount: '',
    jobPerson: '',
  });

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => {
        return <Text style={styles.headerTitle}>{title}</Text>;
      },
    });
    getConfig();
    getStaff();
    if (jobId !== undefined) {
      getJobDetail(jobId);
    }
  }, [title]);

  const getJobDetail = id => {
    setLoading(true);
    GetApi(`jobs/${id}`, { ...props, setInitial }).then(async res => {
      setLoading(false);
      console.log(res);
      if (res.status) {
        setJobInfo({
          startDate: res.data?.job?.startDate.toString(),
          endDate: res.data?.job?.endDate.toString(),
          title: res.data?.job?.title,
          location: res?.data?.job?.address || '',
          latitude: res.data?.job?.location?.coordinates[1],
          longitude: res.data?.job?.location?.coordinates[0],
          description: res.data?.job?.description,
          jobtype: res.data?.job?.type,
          amount: res?.data?.job?.amount.toString(),
          jobPerson: res?.data?.job?.person.toString() || '',
        });
        setjobTitleSelected([res.data?.job?.title]);
        setSelected(res.data?.job?.staff);
        setCheck(res.data?.job?.public ? 'checked' : 'unchecked');
      } else {
        setToast(res.message);
      }
    });
  };

  const getConfig = () => {
    setLoading(true);
    GetApi('user/config', { ...props, setInitial }).then(async res => {
      setLoading(false);
      console.log(res);
      if (res.status) {
        let d = [];
        res.data.title.forEach((element, i) => {
          d.push({
            id: i + 1,
            name: element.name,
          });
          if (res.data.title.length === i + 1) {
            setDropList(d);
          }
        });
      } else {
        setToast(res.message);
      }
    });
  };

  const getStaff = () => {
    setLoading(true);
    Post('user/getStaff', { ...props, setInitial }).then(async res => {
      setLoading(false);
      console.log(res);
      if (res.status) {
        let d = [];
        res.data.guards.forEach((element, i) => {
          d.push({
            id: element._id,
            name: element.username,
            disabled: jobId !== undefined ? true : false,
          });
          if (res.data.guards.length === i + 1) {
            setItems(d);
          }
        });
      } else {
        setToast(res.message);
      }
    });
  };

  const getDropValue = (title, type) => {
    setJobInfo({ ...jobInfo, title });
    setShowrop(false);
  };

  const getLocationVaue = (lat, add) => {
    console.log('lat=======>', lat);
    setJobInfo({
      ...jobInfo,
      latitude: lat.lat.toString(),
      longitude: lat.lng.toString(),
      location: add,
    });
  };

  const submit = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    let { anyEmptyInputs } = checkForEmptyKeys(jobInfo);
    setfiledCheck(anyEmptyInputs);
    setSubmitted(true);
    if (jobInfo.title === 'Job Name') {
      return;
    }
    if (anyEmptyInputs.length > 0) {
      setToast('Please fill all required fields');
    } else {
      if (jobInfo.title === 'Job Name') {
        return;
      }
      if (
        jobInfo.startDate === 'DD/MM/YY 00:00' ||
        jobInfo.endDate === 'DD/MM/YY 00:00'
      ) {
        setToast('Please fill all required fields');
        return;
      }

      if (jobInfo.latitude === '' || jobInfo.longitude === '') {
        setToast('Please select location from list');
        return;
      }
      console.log(JSON.parse(user));
      if (JSON.parse(user) !== null) {
        const data = {
          title: jobInfo.title,
          amount: jobInfo.amount,
          description: jobInfo.description,
          posted_by: JSON.parse(user).id,
          startDate: jobInfo.startDate,
          endDate: jobInfo.endDate,
          type: jobInfo.jobtype,
          person: jobInfo.jobPerson,
          location: [jobInfo.longitude, jobInfo.latitude],
          address: jobInfo.location,
        };
        if (check === 'checked') {
          data.public = true;
        } else {
          if (selected.length === 0) {
            return;
          }
          data.public = false;
          data.staff = selected;
        }
        console.log('data==========>', data);
        setLoading(true);
        if (jobId !== undefined) {
          Put(`jobs/${jobId}`, data, { ...props, setInitial }).then(async res => {
            setLoading(false);
            console.log(res);
            if (res.status) {
              setJobInfo({
                startDate: 'DD/MM/YY 00:00',
                endDate: 'DD/MM/YY 00:00',
                title: 'Job Name',
                location: '',
                latitude: '',
                longitude: '',
                description: '',
                jobtype: 'event',
                amount: '',
                jobPerson: '',
              });
              props.navigation.goBack();
            } else {
              setToast(res.message);
            }
          });
        } else {
          Post('jobs', data).then(async res => {
            setLoading(false);
            console.log(res);
            if (res.status) {
              setJobInfo({
                startDate: 'DD/MM/YY 00:00',
                endDate: 'DD/MM/YY 00:00',
                title: 'Job Name',
                location: '',
                latitude: '',
                longitude: '',
                description: '',
                jobtype: 'event',
                amount: '',
                jobPerson: '',
              });
              props.navigation.navigate('HomeUser');
            } else {
              setToast(res.message);
            }
          });
        }
      }
    }
  };

  const jobDetail = () => (
    <View style={{ marginTop: 20 }}>
      <Text style={[styles.showAmount, { fontSize: 13 }]}>
        Job Responsibility
      </Text>
      <TextInput
        multiline={true}
        numberOfLines={5}
        value={jobInfo.description}
        placeholder="Description"
        placeholderTextColor={Constants.grey}
        textAlignVertical="top"
        style={{
          color: Constants.lightgrey,
          flex: 1,
          flexWrap: 'wrap',
          fontSize: 13,
        }}
        returnKeyType={'default'}
        blurOnSubmit={true}
        onChangeText={description => setJobInfo({ ...jobInfo, description })}
      />
      {filedCheck.includes('DESCRIPTION') && (
        <Text style={{ color: 'red' }}> Description is required</Text>
      )}

      <View
        style={{
          marginTop: 10,
          marginRight: 0,
        }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.jobUpdatbtn} onPress={submit}>
            <Text style={styles.jobUpdatBtnTxt}>
              {jobId !== undefined ? 'Job Update' : 'Job Post'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const onSelectedItemsChange = selecteditems => {
    setSelected(selecteditems);
    console.log(multiSelect);
    console.log(selecteditems);
  };

  const onSelectedJobTitleChange = selecteditems => {
    setjobTitleSelected(selecteditems);
    console.log('selecteditems===========>', selecteditems);
    setJobInfo({ ...jobInfo, title: selecteditems[0] });
  };

  const staffSelect = () => {
    return (
      <View
        style={[
          styles.amountTimeMainView,
          { alignItems: 'flex-start', marginTop: 20, flex: 1 },
        ]}>
        <Image
          source={require('../../Assets/Images/user.png')}
          style={{ height: 25, width: 25 }}
          resizeMode="contain"
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.amountTime, { flex: 1 }]}>Select Staff</Text>
            <View
              style={[
                styles.amountTimeMainView,
                { height: 35, flex: 1, alignItems: 'flex-end' },
              ]}>
              <Checkbox.Item
                mode="android"
                position="leading"
                label="Post for Every One"
                status={check}
                onPress={() => {
                  check === 'checked'
                    ? setCheck('unchecked')
                    : setCheck('checked');
                }}
                color={Constants.red}
                uncheckedColor={Constants.red}
                labelStyle={[styles.labelStyle, { fontSize: 13 }]}
                style={{ paddingLeft: 0 }}
              />
            </View>
          </View>
          {check === 'unchecked' && (
            <View
              style={{
                flex: 1,
                backgroundColor: Constants.black,
                marginRight: 20,
              }}>
              <MultiSelect
                noItemsText="Staff not found"
                hideTags
                items={items}
                uniqueKey="id"
                ref={multiSelect}
                onSelectedItemsChange={onSelectedItemsChange}
                selectedItems={selected}
                selectText="Pick Staff"
                searchInputPlaceholderText="Search Staff..."
                onChangeInput={text => console.log(text)}
                altFontFamily="Helvetica"
                tagRemoveIconColor="#CCC"
                tagBorderColor={Constants.lightgrey}
                tagTextColor={Constants.lightgrey}
                selectedItemTextColor={Constants.red}
                selectedItemIconColor="#fff"
                itemTextColor={Constants.lightgrey}
                displayKey="name"
                searchInputStyle={{ color: '#CCC' }}
                submitButtonColor={Constants.red}
                submitButtonText="Submit"
                styleInputGroup={{
                  backgroundColor: Constants.black,
                  height: 40,
                }}
                styleDropdownMenuSubsection={{
                  backgroundColor: Constants.black,
                }}
                styleItemsContainer={{
                  backgroundColor: Constants.black,
                  borderColor: 'red',
                  borderWidth: items.length === 0 ? 0 : 1,
                }}
                tagContainerStyle={{ height: 30, padding: 0 }}
              />
              <View>{multiSelect?.current?.getSelectedItemsExt(selected)}</View>
            </View>
          )}
          {submitted && check === 'unchecked' && selected.length === 0 && (
            <Text style={{ color: 'red' }}>Staff is required</Text>
          )}
        </View>
      </View>
    );
  };

  const timeselect = date => {
    setJobInfo({
      ...jobInfo,
      [keys]: date.toString(),
    });
    setOpenTime(false);
  };

  return (
    <View style={styles.container}>
      <Spinner color={'#fff'} visible={loading} />
      <CustomToaster
        color={Constants.black}
        backgroundColor={Constants.white}
        timeout={5000}
        toast={toast}
        setToast={setToast}
      />
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={{ marginTop: 30 }}>
          <Text style={styles.pageTitle}>Enter Job Details</Text>
          <View style={styles.postjobView3}>
            {/* <TouchableOpacity
              onPress={() => setShowrop(true)}
              style={[
                styles.selectjobname,
                {flexDirection: 'row', padding: 10},
              ]}>
              <View style={{flex: 7}}>
                <Text style={styles.jobname}>{jobInfo.title}</Text>
              </View>
              <TouchableOpacity
                style={{flex: 1, alignItems: 'flex-end'}}
                onPress={() => setShowrop(true)}>
                <Ionicons
                  name="chevron-down-outline"
                  color={Constants.red}
                  size={20}
                />
              </TouchableOpacity>
            </TouchableOpacity> */}

            <View
              style={{
                flex: 1,
                backgroundColor: Constants.black,
                marginRight: 20,
              }}>
              <MultiSelect
                noItemsText="Job title not found"
                hideTags
                single
                items={dropList}
                uniqueKey="name"
                ref={singleSelect}
                onSelectedItemsChange={onSelectedJobTitleChange}
                selectedItems={jobTitleSelected}
                selectText="Pick Job Title"
                searchInputPlaceholderText="Search Job Title..."
                onChangeInput={text => console.log(text)}
                altFontFamily="Helvetica"
                tagRemoveIconColor="#CCC"
                tagBorderColor={Constants.lightgrey}
                tagTextColor={Constants.lightgrey}
                selectedItemTextColor={Constants.red}
                selectedItemIconColor="#fff"
                itemTextColor={Constants.lightgrey}
                displayKey="name"
                searchInputStyle={{ color: '#CCC' }}
                submitButtonColor={Constants.red}
                submitButtonText="Submit"
                styleInputGroup={{
                  backgroundColor: Constants.black,
                  height: 40,
                }}
                styleDropdownMenuSubsection={{
                  backgroundColor: Constants.black,
                }}
                styleItemsContainer={{
                  backgroundColor: Constants.black,
                  borderColor: 'red',
                  borderWidth: items.length === 0 ? 0 : 1,
                }}
                tagContainerStyle={{ height: 30, padding: 0 }}
              />
              {/* <View>{multiSelect?.current?.getSelectedItemsExt(selected)}</View> */}
            </View>
            {jobInfo.title === 'Job Name' && submitted && (
              <Text style={{ color: 'red' }}> Job name is required</Text>
            )}
            <CoustomDropdown
              visible={showDrop}
              setVisible={setShowrop}
              getDropValue={getDropValue}
              data={dropList}
              title="Type of security"
            />
            <DateTimePeacker
              open={openTime}
              datepeack={datepeack}
              mode="datetime"
              timeselect={timeselect}
              setOpenTime={setOpenTime}
              {...minMax}
              type={type}
            />
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity
                style={[
                  styles.amountTimeMainView,
                  (filedCheck.includes('STARTDATE') ||
                    (submitted && jobInfo.startDate === 'DD/MM/YY 00:00')) &&
                  styles.validateBorder,
                ]}
                onPress={() => {
                  setOpenTime(true);
                  setKeys('startDate');
                  setMode('start');
                  setDate(
                    jobInfo.startDate === 'DD/MM/YY 00:00'
                      ? new Date()
                      : new Date(jobInfo.startDate),
                  );
                  setMinMax({
                    maxdate:
                      jobInfo.endDate === 'DD/MM/YY 00:00'
                        ? new Date(
                          new Date().setMonth(new Date().getMonth() + 1),
                        )
                        : new Date(jobInfo.endDate),
                  });
                  setType('start');
                }}>
                <Image
                  source={require('../../Assets/Images/Clandar.png')}
                  style={{ height: 25, width: 25 }}
                  resizeMode="contain"
                />
                <View>
                  <Text style={styles.amountTime}>{'Start Date & Time'}</Text>
                  <Text
                    style={[
                      styles.amountTime,
                      {
                        color: Constants.lightgrey,
                      },
                    ]}>
                    {jobInfo.startDate === 'DD/MM/YY 00:00'
                      ? jobInfo.startDate
                      : moment(new Date(jobInfo.startDate)).format(
                        'DD/MM/yyyy, HH:mm',
                      )}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.amountTimeMainView,
                  (filedCheck.includes('ENDTIME') ||
                    (submitted && jobInfo.endDate === 'DD/MM/YY 00:00')) &&
                  styles.validateBorder,
                  { justifyContent: 'flex-end' },
                ]}
                onPress={() => {
                  setOpenTime(true);
                  setKeys('endDate');
                  setMode('end');
                  setDate(
                    jobInfo.endDate === 'DD/MM/YY 00:00'
                      ? new Date()
                      : new Date(jobInfo.endDate),
                  );
                  setMinMax({
                    mindate:
                      jobInfo.startDate === 'DD/MM/YY 00:00'
                        ? new Date()
                        : new Date(jobInfo.startDate),
                    maxdate:
                      jobInfo.startDate === 'DD/MM/YY 00:00'
                        ? new Date(
                          new Date().setMonth(new Date().getMonth() + 1),
                        )
                        : new Date(
                          new Date(jobInfo.startDate).setMonth(
                            new Date(jobInfo.startDate).getMonth() + 1,
                          ),
                        ),
                  });
                  setType('end');
                }}>
                <Image
                  source={require('../../Assets/Images/Clandar.png')}
                  style={{ height: 25, width: 25 }}
                  resizeMode="contain"
                />
                <View>
                  <Text style={styles.amountTime}>{'End Date & Time'}</Text>
                  <Text
                    style={[
                      styles.amountTime,
                      {
                        color: Constants.lightgrey,
                      },
                    ]}>
                    {jobInfo.endDate === 'DD/MM/YY 00:00'
                      ? jobInfo.endDate
                      : moment(new Date(jobInfo.endDate)).format(
                        'DD/MM/yyyy, HH:mm',
                      )}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View
                style={[
                  styles.amountTimeMainView,
                  filedCheck.includes('AMOUNT') && styles.validateBorder,
                ]}>
                <Text style={styles.pound}>£</Text>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    marginTop: 5,
                  }}>
                  <Text style={[styles.amountTime, { marginBottom: 7 }]}>
                    Amount per Hour
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.amountTime,
                        {
                          lineHeight: 12,
                          marginTop: 1,
                          color: Constants.lightgrey,
                        },
                      ]}>
                      £
                    </Text>
                    <TextInput
                      value={jobInfo.amount}
                      placeholder="00"
                      keyboardType="number-pad"
                      placeholderTextColor={Constants.grey}
                      style={[styles.amountTime, styles.editjobinput]}
                      onChangeText={amount => setJobInfo({ ...jobInfo, amount })}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.amountTimeMainView,
                  filedCheck.includes('JOBPERSON') && styles.validateBorder,
                  { justifyContent: 'flex-end' },
                ]}>
                <Image
                  source={require('../../Assets/Images/user.png')}
                  style={{ height: 25, width: 25 }}
                  resizeMode="contain"
                />
                <View>
                  <Text style={[styles.amountTime, { marginBottom: 7 }]}>
                    Number of Staff
                  </Text>
                  <TextInput
                    value={jobInfo.jobPerson}
                    placeholder="01"
                    keyboardType="number-pad"
                    placeholderTextColor={Constants.grey}
                    style={[
                      styles.amountTime,
                      styles.editjobinput,
                      { marginLeft: 10 },
                    ]}
                    onChangeText={jobPerson =>
                      setJobInfo({ ...jobInfo, jobPerson })
                    }
                  />
                </View>
              </View>
            </View>
            <View
              style={filedCheck.includes('LOCATION') && styles.validateBorder}>
              <LocationDropdown
                value={jobInfo.location}
                getLocationVaue={getLocationVaue}
                setJobInfo={setJobInfo}
              />
            </View>
            {/* {jobtype()} */}
            {staffSelect()}
            {jobDetail()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditPostJob;
