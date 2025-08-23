/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  RefreshControl,
  Modal,
  Pressable,
  Button,
  Platform
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import styles from './StyleProvider';
import Constants from '../../Helpers/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Post, GetApi } from '../../Helpers/Service';
import Spinner from '../../Component/Spinner';
import CoustomDropdown from '../../Component/CoustomDropdown';
import { Context } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import DatePicker from 'react-native-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';



const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const HistoryPro = props => {
  const dList = [
    { name: 'Last Week', type: '1_WEEK' },
    { name: 'Last 2 Weeks', type: '2_WEEK' },
    { name: 'Last 1 Month', type: '1_MONTH' },
    { name: 'Last Year', type: '1_YEAR' },
    { name: 'Custom Date', type: 'custom' },
  ];
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [dropList, setDropList] = useState(dList);
  const [showDrop, setShowrop] = useState(false);
  const [listType, setListType] = useState('Last Week');
  const [earningTotal, setEarningTotal] = React.useState(0);
  const [jobfound, setJobfound] = useState(true);
  const [historyList, setHistoryList] = useState([]);
  const [mainhistoryList, setMainHistoryList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [jobInfo, setJobInfo] = useState({
    startDate: 'DD/MM/YY',
    endDate: 'DD/MM/YY',
  });
  const [openTime, setOpenTime] = useState(false);
  const [datepeack, setDate] = useState(new Date());
  const [mode, setMode] = useState('');
  const [keys, setKeys] = useState('');
  const [minMax, setMinMax] = useState({});
  const [type, setType] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState('');

  const getDropValue = (title, types) => {
    setListType(title);
    setShowrop(false);
    setSearchVal('');
    if (types !== 'custom') {
      setJobInfo({ startDate: 'DD/MM/YY', endDate: 'DD/MM/YY' });
      getHistory(`provider/history/${types}`);
    }
  };

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      getHistory('provider/history/1_WEEk');
    });
    return () => {
      willFocusSubscription;
      setJobfound(true);
    };
    // getHistory(`user/history/${filterVal}`);
  }, []);

  const timeselect = date => {
    console.log(date);
    // if (keys === 'endDate') {
    //   const d = new Date(date).getDate() + 1;
    //   const d1 = new Date(new Date(date).setDate(d));
    //   console.log(d, d1);
    //   setJobInfo({
    //     ...jobInfo,
    //     [keys]: d1,
    //   });
    // } else {
    setJobInfo({
      ...jobInfo,
      [keys]: date,
    });
    // }

    setOpenTime(false);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const customQuery = () => {
    if (jobInfo.startDate === 'DD/MM/YY' && jobInfo.endDate === 'DD/MM/YY') {
      setSubmitted(true);
      return;
    }
    const d = new Date(jobInfo.endDate).getDate() + 1;
    const end = new Date(new Date(jobInfo.endDate).setDate(d));
    console.log(d, end);
    getHistory(
      `provider/history?start=${moment(jobInfo.startDate).format(
        'MM/DD/YYYY',
      )}&end=${moment(end).format('MM/DD/YYYY')}`,
    );
  };

  const localFilter = text => {
    let data = [];
    if (text.length > 3) {
      data = mainhistoryList.filter(f =>
        f?.title?.toLowerCase().includes(text.toLowerCase()),
      );
    } else {
      data = mainhistoryList;
    }

    setHistoryList(data);
    let total = 0;
    data.forEach(element => {
      total = total + element.amount * element.job_hrs;
    });
    console.log(total);
    setEarningTotal(total);
  };

  const getHistory = url => {
    setLoading(true);
    GetApi(url, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res.data);
        if (res.status) {
          if (res.data.jobs.length === 0) {
            setJobfound(false);
          } else {
            setJobfound(true);
          }
          setHistoryList(res.data.jobs);
          setMainHistoryList(res.data.jobs);
          let total = 0;
          res.data.jobs.forEach(element => {
            total = total + element.amount * element.job_hrs;
          });
          console.log(total);
          setEarningTotal(total);
        } else {
          setToast(res.message);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const jobHistory = () => (
    <>
      {historyList.map((item, index) => (
        <View style={styles.postjobView2} key={item._id}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.postjobTitleView}>
              <Text style={styles.postjobtitle}>{item.title}</Text>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                {/* <View style={styles.amountTimeMainView2}>
                  <Image
                    source={require('../../Assets/Images/History.png')}
                    style={{height: 20, width: 20}}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.amountTime,
                      {marginLeft: 5, fontSize: 10, lineHeight: 12},
                    ]}>
                    Time{'\n'}
                    {item.startTime} to {item.endTime}
                  </Text>
                </View> */}
                <View style={styles.amountTimeMainView2}>
                  <Image
                    source={require('../../Assets/Images/Clandar.png')}
                    style={{ height: 20, width: 20 }}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.amountTime,
                      { marginLeft: 5, fontSize: 10, lineHeight: 12 },
                    ]}>
                    {'Start Date & Time'}
                    {'\n'}
                    {moment(item.startDate).format('DD/MM/yyyy, HH:mm')}
                  </Text>
                </View>
                <View style={styles.amountTimeMainView2}>
                  <Image
                    source={require('../../Assets/Images/Clandar.png')}
                    style={{ height: 20, width: 20 }}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.amountTime,
                      { marginLeft: 5, fontSize: 10, lineHeight: 12 },
                    ]}>
                    {'End Date & Time'}
                    {'\n'}
                    {moment(item.endDate).format('DD/MM/yyyy, HH:mm')}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[styles.showAmount, { fontSize: 16 }]}>
                £{item.amount}/hr
              </Text>
            </View>
          </View>
          {item.showDetail && (
            <View>
              <Text style={[styles.showAmount, { fontSize: 14, marginTop: 10 }]}>
                Job Details....
              </Text>
              <Text style={styles.description}>{item.description}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  // marginRight: 20,
                }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    marginRight: 20,
                  }}>
                  {/* <TouchableOpacity
                    onPress={() => {
                      historyList[index].showDetail =
                        historyList[index]?.showDetail == undefined ||
                        historyList[index]?.showDetail == false
                          ? true
                          : false;
                      setHistoryList(historyList);
                      onRefresh();
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
                        {fontSize: 22, lineHeight: 25},
                      ]}>
                      Done
                    </Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate('Report', { ...item });
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
                      Report
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.iconView2}
            onPress={() => {
              historyList[index].showDetail =
                historyList[index]?.showDetail === undefined ||
                  historyList[index]?.showDetail === false
                  ? true
                  : false;
              setHistoryList(historyList);
              onRefresh();
            }}>
            <Ionicons
              name={
                item.showDetail ? 'chevron-up-outline' : 'chevron-down-outline'
              }
              size={20}
              color={Constants.white}
            />
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
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
      <ScrollView>
        <View style={[styles.fieldView, { width: '100%' }]}>
          <View style={styles.iconView}>
            <Ionicons
              name={'search-outline'}
              size={25}
              color={Constants.white}
            />
          </View>
          <TextInput
            style={styles.input2}
            placeholder="Search job History"
            placeholderTextColor={Constants.white}
            value={searchVal}
            onChangeText={text => {
              console.log(text);
              setSearchVal(text);
              localFilter(text);
            }}
          />
        </View>
        <View style={styles.filterView}>
          <TouchableOpacity
            style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setShowrop(true)}>
            <View>
              <Text style={styles.listtypeName}>{listType}</Text>
            </View>
            <View style={{ marginLeft: 10 }}>
              <Ionicons
                name="chevron-down-outline"
                color={Constants.red}
                size={25}
              />
            </View>
          </TouchableOpacity>

          <CoustomDropdown
            visible={showDrop}
            setVisible={setShowrop}
            getDropValue={getDropValue}
            data={dropList}
          />
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={[styles.listtypeName, { color: Constants.red }]}>
              £{earningTotal.toFixed(2)}
            </Text>
          </View>
        </View>
        <Modal
          animationType="fade" // or "slide"
          transparent={true}
          visible={openTime}
          onRequestClose={() => setOpenTime(false)} // For Android back button
        >
          <Pressable style={styles.centeredView} onPress={() => setOpenTime(false)}>
            <View style={styles.modalView} onStartShouldSetResponder={() => true}>

              <DateTimePicker
                testID="dateTimePicker" // Good practice for testing
                value={datepeack} // The currently selected date/time
                mode={'date'} // 'date' or 'time'
                is24Hour={false} // Use 24-hour format if true, otherwise 12-hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'} // 'default' for pop-up, 'spinner' for inline, 'calendar', 'clock' on Android
                // onChange={onChange} // Callback when date/time is changed
                onChange={(event, selectedDate) => {
                  const d = event.nativeEvent.timestamp
                  console.log(event.nativeEvent.timestamp, selectedDate)

                  console.log(new Date(d))
                  timeselect(d);
                }}
                themeVariant='dark'
                textColor='black'
              // minimumDate={new Date(2000, 0, 1)} // Optional: Set a minimum date
              // maximumDate={new Date(2030, 11, 31)} // Optional: Set a maximum date
              />
              {Platform.OS === 'ios' && (
                <Button title="Done" onPress={() => setOpenTime(false)} />
              )}
            </View>
          </Pressable>
        </Modal>
        {/* {openTime && (
          <DateTimePicker
            testID="dateTimePicker" // Good practice for testing
            value={datepeack} // The currently selected date/time
            mode={'date'} // 'date' or 'time'
            is24Hour={false} // Use 24-hour format if true, otherwise 12-hour
            display={Platform.OS === 'ios' ? 'spinner' : 'default'} // 'default' for pop-up, 'spinner' for inline, 'calendar', 'clock' on Android
            // onChange={onChange} // Callback when date/time is changed
            onChange={date => {
              timeselect(date);
            }}
            themeVariant='light'
            textColor='white'
          // minimumDate={new Date(2000, 0, 1)} // Optional: Set a minimum date
          // maximumDate={new Date(2030, 11, 31)} // Optional: Set a maximum date
          />
        )} */}

        {/* <DatePicker
          modal
          open={openTime}
          date={datepeack}
          mode={'date'}
          androidVariant={'nativeAndroid'}
          confirmText="Done"
          // maximumDate={props?.maxdate}
          // minimumDate={new Date()}
          onConfirm={date => {
            timeselect(date);
          }}
          onCancel={() => {
            setOpenTime(false);
          }}
        /> */}
        {listType === 'Custom Date' && (
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity
              style={[
                styles.amountTimeMainView,
                { justifyContent: 'flex-start' },

                submitted &&
                jobInfo.startDate === 'DD/MM/YY' &&
                styles.validateBorder,
              ]}
              onPress={() => {
                setOpenTime(true);
                setKeys('startDate');
                setMode('start');
                setDate(
                  jobInfo.startDate === 'DD/MM/YY'
                    ? new Date()
                    : new Date(jobInfo.startDate),
                );
                // setMinMax({
                //   maxdate: new Date(jobInfo.endDate),
                //   // jobInfo.endDate === 'DD/MM/YY'
                //   //   ? ''
                //   //   : new Date(jobInfo.endDate),
                // });
                setType('start');
              }}>
              <Image
                source={require('../../Assets/Images/Clandar.png')}
                style={{ height: 25, width: 25 }}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.amountTime}>{'Start Date'}</Text>
                <Text
                  style={[
                    styles.amountTime,
                    {
                      color: Constants.lightgrey,
                    },
                  ]}>
                  {jobInfo.startDate === 'DD/MM/YY'
                    ? jobInfo.startDate
                    : moment(new Date(jobInfo.startDate)).format('DD/MM/yyyy')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.amountTimeMainView,

                submitted &&
                jobInfo.endDate === 'DD/MM/YY' &&
                styles.validateBorder,
                { justifyContent: 'flex-start' },
              ]}
              onPress={() => {
                setOpenTime(true);
                setKeys('endDate');
                setMode('end');
                setDate(
                  jobInfo.endDate === 'DD/MM/YY'
                    ? new Date()
                    : new Date(jobInfo.endDate),
                );
                // setMinMax({
                //   mindate:
                //     jobInfo.startDate === 'DD/MM/YY'
                //       ? new Date()
                //       : new Date(jobInfo.startDate),
                //   maxdate:
                //     jobInfo.startDate === 'DD/MM/YY'
                //       ? new Date(new Date().setMonth(new Date().getMonth() + 1))
                //       : new Date(
                //           new Date(jobInfo.startDate).setMonth(
                //             new Date(jobInfo.startDate).getMonth() + 1,
                //           ),
                //         ),
                // });
                setType('end');
              }}>
              <Image
                source={require('../../Assets/Images/Clandar.png')}
                style={{ height: 25, width: 25 }}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.amountTime}>{'End Date'}</Text>
                <Text
                  style={[
                    styles.amountTime,
                    {
                      color: Constants.lightgrey,
                    },
                  ]}>
                  {jobInfo.endDate === 'DD/MM/YY'
                    ? jobInfo.endDate
                    : moment(new Date(jobInfo.endDate)).format('DD/MM/yyyy')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={customQuery}>
              <View
                style={{
                  backgroundColor: Constants.red,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                }}>
                <Text style={{ color: Constants?.white }}>Search</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <View
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {jobHistory()}
        </View>
      </ScrollView>
    </View>
  );
};

export default HistoryPro;
