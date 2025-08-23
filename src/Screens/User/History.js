/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
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
  Pressable,
} from 'react-native';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import styles from './StylesUser';
import Constants from '../../Helpers/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Post, GetApi, Api } from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import CoustomDropdown from '../../Component/CoustomDropdown';
import moment from 'moment';
import NojobFound from '../../Component/NojobFound';
import { Context } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import debounce from 'lodash.debounce';


const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const History = props => {
  const [initial, setInitial] = useContext(Context);
  const dList = [
    { name: 'Last Week', type: '1_WEEK' },
    { name: 'Last 2 Weeks', type: '2_WEEK' },
    { name: 'Last 1 Month', type: '1_MONTH' },
    { name: 'Last Year', type: '1_YEAR' },
  ];
  const [toast, setToast] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [dropList, setDropList] = useState(dList);
  const [showDrop, setShowrop] = useState(false);
  const [listType, setListType] = useState('Last Week');
  const [historyList, setHistoryList] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [filterVal, setFilterVal] = React.useState('1_WEEk');
  const [earningTotal, setEarningTotal] = React.useState(0);
  const [jobfound, setJobfound] = useState(true);

  const getDropValue = (title, type) => {
    setListType(title);
    setShowrop(false);
    // setFilterVal(type);
    getHistory(`user/history/${type}`);
  };

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      getHistory('user/history/1_WEEk');
    });
    return () => {
      willFocusSubscription;
      setJobfound(true);
    };
    // getHistory(`user/history/${filterVal}`);
  }, []);

  const getHistory = url => {
    setLoading(true);
    GetApi(url, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        if (res.status) {
          if (res.data.jobs.length === 0) {
            setJobfound(false);
          } else {
            setJobfound(true);
          }
          setHistoryList(res.data.jobs);
          let total = 0;
          res.data.jobs.forEach(element => {
            total = total + element.amount * element.job_hrs;
          });
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

  const debouncedSave = useCallback(
    debounce(text => {
      search(text);
    }, 1000),
    [], // will be created only once initially
  );

  const search = searc => {
    setLoading(true);
    Post('jobs/historyUserSearch', { searc }, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        if (res.status) {
          if (res?.data?.guards?.length === 0) {
            setJobfound(false);
          } else {
            setJobfound(true);
          }
          setHistoryList(res.data.guards);
          let total = 0;
          res.data.guards.forEach(element => {
            total = total + element.amount * element.job_hrs;
          });
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
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const jobHistory = () => (
    <>
      {historyList.map((item, index) => (
        <Pressable
          style={styles.postjobView2}
          key={item._id}
          onPress={() => {
            props.navigation.navigate('JobDetail', {
              job_id: item._id,
              from: 'history',
            });
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.postjobTitleView}>
              <Text style={styles.postjobtitle}>{item.title}</Text>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <View style={styles.amountTimeMainView}>
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
                    {moment(item?.startDate).format('DD/MM/yyyy, HH:mm')}
                  </Text>
                </View>
                <View style={styles.amountTimeMainView}>
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
                    {moment(item?.endDate).format('DD/MM/yyyy, HH:mm')}
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
        </Pressable>
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
        <View style={[styles.fieldView2]}>
          <View style={styles.iconView2}>
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
              debouncedSave(text);
              setSearchVal(text);
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
        {jobfound ? (
          <View
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {jobHistory()}
          </View>
        ) : (
          <NojobFound
            header="No job completed yet"
            height={Dimensions.get('window').height - 300}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default History;
