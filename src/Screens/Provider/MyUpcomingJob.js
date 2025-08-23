/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  Modal,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import styles from './StyleProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from '../../Helpers/constant';
import CustomMapView from '../../Component/CustomMapView';
import { Post, GetApi, Delete } from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import moment from 'moment';
import CountDownTime from '../../Component/CountDownTime';
import { Context, ToastContext } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import JobFilter from '../../Component/JobFilter';
import { Badge } from 'react-native-paper';
import NojobFound from '../../Component/NojobFound';
import CustomCurrentLocation from '../../Component/CustomCurrentLocation';
import GetCurrentAddressByLatLong from '../../Component/GetCurrentAddressByLatLong';
import ImageCropPicker from 'react-native-image-crop-picker';


const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const MyUpcomingJob = props => {
  const [toast, setToast] = useContext(ToastContext);
  const [initial, setInitial] = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [upcomingJob, setUpcomingJob] = useState([]);
  const [mainList, setMainList] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [jobfound, setJobfound] = useState(true);
  const [accountSuc, setAccountSuc] = useState(false);
  const [jobId, setJobId] = useState('');
  const [currLoc, setCurrLoc] = useState({});

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      async () => {
        muUpcomingJobs();
        // getNoification();
      },
    );
    return () => {
      willFocusSubscription();
    };
  }, []);

  const muUpcomingJobs = () => {
    setLoading(true);
    GetApi('provider/myjobs', { ...props, setInitial }).then(async res => {
      setLoading(false);
      console.log(res?.data?.jobs[0]?.start);
      if (res.status) {
        JobFilter(res?.data?.jobs, 0, 'up').then(ress => {
          // console.log('mainJob====>', r);
          if (ress.length > 0) {

            const r = ress?.filter(f => !f?.guards?.start)
            r.sort(function (a, b) {
              return new Date(a.startDate) - new Date(b.startDate);
            });


            if (r.length > 0) {
              setJobfound(true);
              setUpcomingJob(r);
              setMainList(r);
            } else {
              setJobfound(false);
            }
          }
          // else {
          //   const r = res?.data?.jobs.filter(f => !f?.guards?.start)
          //   r.sort(function (a, b) {
          //     return new Date(a.startDate) - new Date(b.startDate);
          //   });
          //   setUpcomingJob(r);
          //   setMainList(r);
          // }

          // setUpcomingJob(r);
          // setMainList(r);
        });
        // setMainList(res?.data?.jobs);
        // setUpcomingJob(res?.data?.jobs);
        if (res.data.jobs.length === 0) {
          setJobfound(false);
        }
      } else {
        setToast(res.message);
      }
    });
  };
  const jobstartclose = (type, locationType, addressType, job) => {
    setLoading(true);
    CustomCurrentLocation(async (add) => {
      console.log(add)
      let datas = {
        job
      }
      datas[type] = new Date();
      datas[locationType] = {
        type: "Point",
        coordinates: [add.coords.longitude, add.coords.latitude],
      };
      const res = await GetCurrentAddressByLatLong({ lat: add.coords.latitude, long: add.coords.longitude })
      datas[addressType] = res.results[0].formatted_address;
      console.log('maindata------------------>', datas)

      Post('jobs/startclose', datas, { ...props, setInitial }).then(
        async res => {
          setLoading(false);
          if (res.status) {
            // const data = {
            //   title:`Clock in time: ${moment(new Date(res.data.guards.start)).format('HH:mm')}`,
            //   message:`Clock in location: ${res.data.guards.startAddress}`,
            //   options:
            // }
            // Alert.alert('')
            console.log('clock in ===============>', res.data)
            if (type === 'start') {
              setToast(`Clock in time: ${moment(new Date(res.data.guards.start)).format('HH:mm')},\nClock in location: ${res.data.guards.startAddress}`);
            } else {
              setToast(`Clock out time: ${moment(new Date(res.data.guards.close)).format('HH:mm')},\nClock out location: ${res.data.guards.endAddress}`);
            }
            muUpcomingJobs()
            setJobId('')
          } else {
            setToast(res.message);
          }
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
    })
  };

  const getImageValue2 = job => {
    const options = {
      width: 300,
      height: 300,
      cropping: false,
      compressImageQuality: 0.7,
      includeBase64: false,
      useFrontCamera: false,
    };

    ImageCropPicker.openCamera(options)
      .then(
        image => {
          console.log(image);
          uploadFile(image, job);
        },
        err => {
          console.log(err);
        },
      )
      .catch(e => {
        // alert(e);
      });

  };

  const clockinOutUi = (item) => {
    console.log('from----------ui---------->', item)
    return (<View style={{ flexDirection: 'row', flex: 1, gap: 10, padding: 10 }}>
      {!item?.guards?.start && <TouchableOpacity style={{ flex: 1, backgroundColor: Constants.red, padding: 10, borderRadius: 5 }} onPress={() => {
        const d = moment().diff(new Date(item.startDate), 'minutes')
        const check = Math.sign(d);
        if (Math.abs(d) < 15) {
          jobstartclose('start', 'startlocation', 'startAddress', item._id)
        } else {
          setToast(`You can not start the job before the start time`)
        }
      }}>
        <Text style={{ textAlign: 'center', color: Constants.white, fontWeight: '700' }}>Clock In</Text>
      </TouchableOpacity>}
      {item?.guards?.start &&
        <TouchableOpacity
          disabled={item?.guards?.close}
          style={{ flex: 1, backgroundColor: item?.guards?.close ? '#8f0f0e' : Constants.red, padding: 10, borderRadius: 5 }} onPress={() => {
            const d = moment().diff(new Date(item.endDate), 'minutes')
            const check = Math.sign(d);
            console.log('check--------->', check)
            if (Math.abs(d) < 15) {
              setJobId(item._id)
              setAccountSuc(true)
            } else {
              setToast(`You can not end the job before the end time`)
            }
          }}>
          <Text style={{ textAlign: 'center', color: Constants.white, fontWeight: '700' }}>Clock Out</Text>
        </TouchableOpacity>}
      <TouchableOpacity
        disabled={item?.guards?.img}
        style={{ flex: 1, backgroundColor: item?.guards?.img ? '#8f0f0e' : Constants.red, padding: 10, borderRadius: 5 }} onPress={() => {
          const d = moment().diff(new Date(item.startDate), 'minutes')
          const check = Math.sign(d);
          console.log('check--------->', check)
          if (check === 1 || (check === -1 && Math.abs(d) < 15)) {
            getImageValue2(item._id)
          } else {
            setToast(`You can not upload a photo before the start time`)
          }
        }}>
        <Text style={{ textAlign: 'center', color: Constants.white, fontWeight: '700' }}>Take Picture</Text>
      </TouchableOpacity>
    </View>)
  }


  const localFilter = text => {
    let data = [];
    if (text.length > 3) {
      data = mainList.filter(f =>
        f?.title?.toLowerCase().includes(text.toLowerCase()),
      );
    } else {
      data = mainList;
    }
    setUpcomingJob(data);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    muUpcomingJobs();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const card = () => (
    <>
      {upcomingJob.map((item, index) => (
        <View
          style={[
            styles.livejobView2,
            { marginBottom: 20, position: 'relative' },
          ]}
          key={item._id}>
          <Text style={styles.jobtitle}>{item.title}</Text>
          {/* <Text style={[styles.jobStatus, {color: Constants.red}]}>
            01:00:00
          </Text> */}
          {/* <View
            style={[
              styles.jobStatus,
              {
                height: 50,
                justifyContent: 'center',
                borderWidth: 0,
                alignItems: 'center',
                width: '100%',
              },
            ]}>
            <CountDownTime {...item} show={true} />
          </View> */}
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View
              style={[
                styles.amountTimeMainView,
                { flex: 2, justifyContent: 'flex-start' },
              ]}>
              <Image
                source={require('../../Assets/Images/History.png')}
                style={{ height: 25, width: 25 }}
              />
              <Text style={styles.amountTime}>
                Start : {moment(item.startDate).format('DD/MM/yyyy, HH:mm')}
                {'\n'}
                end : {moment(item.endDate).format('DD/MM/yyyy, HH:mm')}
              </Text>
            </View>
            <View
              style={[
                styles.amountTimeMainView,
                { justifyContent: 'flex-start' },
              ]}>
              <Text style={styles.pound}>£</Text>
              {/* <Image
                source={require('../../Assets/Images/dollar.png')}
                style={{height: 22, width: 22}}
              /> */}
              <Text style={styles.amountTime}>
                Amount{'\n'}£{item.amount}/hr
              </Text>
            </View>
          </View>
          {clockinOutUi(item)}
          <View>
            <Text style={[styles.showAmount, { fontSize: 14, marginTop: 10 }]}>
              Address
            </Text>
            <Text style={[styles.description, { fontSize: 11 }]}>
              {item?.address}
            </Text>
          </View>

          {item.showDetail !== undefined && item.showDetail && (
            <View>
              <Text style={[styles.showAmount, { fontSize: 14, marginTop: 10 }]}>
                Job Details....
              </Text>

              <Text style={styles.description}>{item.description}</Text>

              {/* <Text style={[styles.showAmount, {fontSize: 14, marginTop: 10}]}>
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
                      // lat: 27.6312447,
                      // lng: 78.0499502,
                      lat: item?.location?.coordinates[1] || '',
                      lng: item?.location?.coordinates[0] || '',
                      job_id: item?._id,
                    },
                  ]}
                />
              </View> */}
            </View>
          )}
          <View style={{ position: 'absolute', right: 10, top: 10 }}>
            <Badge
              size={10}
              style={{
                backgroundColor: Constants.green,
              }}
            />
          </View>
          <TouchableOpacity
            style={[styles.iconView2, { borderColor: Constants.red }]}
            onPress={() => {
              setShowDetail(!showDetail);
              upcomingJob[index].showDetail =
                upcomingJob[index]?.showDetail === undefined ||
                  upcomingJob[index]?.showDetail === false
                  ? true
                  : false;
              setUpcomingJob(upcomingJob);
              // onRefresh();
            }}>
            <Ionicons
              name={
                // item.showDetail !== undefined && item.showDetail
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
        <View style={[styles.fieldView, { width: '100%' }]}>
          <View style={styles.iconView}>
            <Ionicons
              name={'search-outline'}
              size={25}
              color={Constants.white}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Search confirmed job"
            placeholderTextColor={Constants.white}
            value={searchVal}
            onChangeText={text => {
              setSearchVal(text);
              localFilter(text);
            }}
          />
        </View>
        {jobfound && (
          <View
            style={{ marginTop: 20 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {card()}
          </View>
        )}
        {!jobfound && (
          <NojobFound
            header="No confirmed job"
            height={Dimensions.get('window').height - 300}
          />
        )}
      </ScrollView>
      <Modal
        animationType="none"
        transparent={true}
        visible={accountSuc}
        onRequestClose={() => {
          setAccountSuc(false);
          setJobId('');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={styles.textStyle}>
                Are you sure you want to end this job?
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => { setAccountSuc(false); setJobId('') }}
                  style={styles.cancelButtonStyle}>
                  <Text style={styles.modalText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setAccountSuc(false);
                    jobstartclose('close', 'endLocation', 'endAddress', jobId)
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Clock Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyUpcomingJob;
