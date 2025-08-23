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
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import styles from './StyleProvider';
import Constants from '../../Helpers/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Post, GetApi, Put} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import CoustomDropdown from '../../Component/CoustomDropdown';
import moment from 'moment';
import CustomMapView from '../../Component/CustomMapView';
import {Context} from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import NojobFound from '../../Component/NojobFound';


const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const AvailableJob = props => {
  console.log(props);
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [showDetail, setShowDetail] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [avalablaJobList, setAvailableJobList] = useState([]);
  const [mainList, setMainList] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [jobId, setJobId] = useState('');
  const [jobfound, setJobfound] = useState(true);

  useEffect(() => {
    getAvailableJobs();
  }, []);

  const getAvailableJobs = () => {
    setLoading(true);
    GetApi('provider/jobs/available', {...props, setInitial}).then(
      async res => {
        setLoading(false);
        console.log(res.data.jobs);
        if (res.status) {
          if (props?.route?.params?.jobId !== undefined) {
            const foundJob = res.data.jobs.find(
              f => f._id === props?.route?.params.jobId,
            );
            foundJob.showDetail = true;
            console.log('found job.........>', foundJob);
          }

          setAvailableJobList(res.data.jobs);
          setMainList(res.data.jobs);
          if (res.data.jobs.length === 0) {
            setJobfound(false);
          }
        } else {
          setToast(res.message);
        }
      },
    );
  };

  const localFilter = text => {
    let data = [];
    if (text.length > 3) {
      data = mainList.filter(f =>
        f?.title?.toLowerCase().includes(text.toLowerCase()),
      );
    } else {
      data = mainList;
    }
    setAvailableJobList(data);
  };

  const applyJob = id => {
    setLoading(true);
    Put(`jobs/apply/${id}`, '', {...props, setInitial}).then(async res => {
      setLoading(false);
      console.log(res);
      if (res.status) {
        setToast(res.data.message);
      } else {
        setToast(res.message);
      }
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAvailableJobs();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const onRefreshes = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const card = () => (
    <>
      {avalablaJobList.map((item, index) => (
        <View style={styles.postjobView2} key={index}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.postjobTitleView}>
              <Text style={styles.postjobtitle}>
                {item?.client?.fullName} ({item.title})
              </Text>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <View style={styles.amountTimeMainView2}>
                  <Image
                    source={require('../../Assets/Images/Clandar.png')}
                    style={{height: 20, width: 20}}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.amountTime,
                      {marginLeft: 5, fontSize: 10, lineHeight: 12},
                    ]}>
                    {'Start Date & Time'}
                    {'\n'}
                    {moment(item.startDate).format('DD/MM/yyyy, HH:mm')}
                  </Text>
                </View>
                <View style={styles.amountTimeMainView2}>
                  <Image
                    source={require('../../Assets/Images/Clandar.png')}
                    style={{height: 20, width: 20}}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.amountTime,
                      {marginLeft: 5, fontSize: 10, lineHeight: 12},
                    ]}>
                    {'End Date & Time'}
                    {'\n'}
                    {moment(item.endDate).format('DD/MM/yyyy, HH:mm')}
                  </Text>
                </View>

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
                </View>
                <View style={styles.amountTimeMainView2}>
                  <Image
                    source={require('../../Assets/Images/Clandar.png')}
                    style={{height: 20, width: 20}}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.amountTime,
                      {marginLeft: 5, fontSize: 10, lineHeight: 12},
                    ]}>
                    Date{'\n'}
                    {moment(item.startDate).format('DD/MM/yyyy')}
                  </Text>
                </View> */}
              </View>
            </View>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={[styles.showAmount, {fontSize: 16}]}>
                £{item.amount}/hr
              </Text>
            </View>
          </View>
          {item.showDetail !== undefined && item.showDetail && (
            <View>
              <Text style={[styles.showAmount, {fontSize: 14, marginTop: 10}]}>
                Job Details....
              </Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={[styles.showAmount, {fontSize: 14, marginTop: 10}]}>
                Job Location
              </Text>
              <View
                style={{
                  borderRadius: 10,
                  overflow: 'hidden',
                  width: Dimensions.get('window').width - 80,
                  marginTop: 10,
                }}>
                <CustomMapView
                  style={{
                    height: 180,
                    width: Dimensions.get('window').width - 80,
                  }}
                  locationArray={[
                    {
                      lat: item?.location?.coordinates[1] || '',
                      lng: item?.location?.coordinates[0] || '',
                      job_id: item?._id,
                    },
                  ]}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      applyJob(item._id);
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
                      Apply Job
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.iconView2}
            onPress={() => {
              avalablaJobList[index].showDetail =
                avalablaJobList[index]?.showDetail == undefined ||
                avalablaJobList[index]?.showDetail == false
                  ? true
                  : false;
              setAvailableJobList(avalablaJobList);
              onRefreshes();
            }}>
            <Ionicons
              name={
                item.showDetail !== undefined && item.showDetail
                  ? 'chevron-up-outline'
                  : 'chevron-down-outline'
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={[styles.fieldView, {width: '100%'}]}>
          <View style={styles.iconView}>
            <Ionicons
              name={'search-outline'}
              size={25}
              color={Constants.white}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Search job History"
            placeholderTextColor={Constants.white}
            value={searchVal}
            onChangeText={text => setSearchVal(text)}
          />
        </View>
        {jobfound && (
          <View
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {card()}
          </View>
        )}
        {!jobfound && (
          <NojobFound
            header="No other available job"
            height={Dimensions.get('window').height - 300}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default AvailableJob;
