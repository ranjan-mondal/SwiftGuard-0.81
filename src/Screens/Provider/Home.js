/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable no-shadow */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  StatusBar,
  Modal,
  Alert
} from 'react-native';
import React, { useEffect, useState, useContext, createRef } from 'react';
import styles from './StyleProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from '../../Helpers/constant';
import { Switch } from 'react-native-paper';
import CustomMapView from '../../Component/CustomMapView';
import CustomCurrentLocation from '../../Component/CustomCurrentLocation';
import { Post, GetApi, Delete, Put } from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import moment from 'moment';
import CountDownTime from '../../Component/CountDownTime';
import { Context, ToastContext } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobFilter from '../../Component/JobFilter';
import NojobFound from '../../Component/NojobFound';
import { OneSignal } from 'react-native-onesignal';
import { Avatar } from 'react-native-paper';
import GetCurrentAddressByLatLong from '../../Component/GetCurrentAddressByLatLong';
import RNFetchBlob from 'react-native-blob-util';
import CameraGalleryPeacker from '../../Component/CameraGalleryPeacker';
import ImageCropPicker from 'react-native-image-crop-picker';


const Home = props => {
  const [filterHour, setFilterHour] = useState(2);
  const [distance, setDistance] = useState(5);
  const [toast, setToast] = useContext(ToastContext);
  const [initial, setInitial] = useContext(Context);
  const [searchVal, setSearchVal] = useState('');
  const [isSwitchOn, setIsSwitchOn] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [nearbyList, setNearByList] = useState([]);
  const [upcomingJob, setUpcomingJob] = useState([]);
  const [liveJob, setLiveJob] = useState([]);
  const [mainUpcomingJob, setMainUpcomingJob] = useState([]);
  const [avalablaJobList, setAvailableJobList] = useState([]);
  const [start, setStart] = useState(false);
  const [locationArray, setLocationArray] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [deviceLoc, setDeviceLoc] = React.useState({});
  const [notilist, setNotiList] = useState([]);
  const [noAvailable, setNoavailable] = useState(true);
  const [noComfirmed, setNoComfirmed] = useState(true);
  const [noPending, setNoPending] = useState(true);
  const [profilePic, setProfilePic] = useState(
    require('../../Assets/Images/images.png'),
    // ../Assets/Images/images.png
  );
  const [accountSuc, setAccountSuc] = useState(false);
  const [jobId, setJobId] = useState('');
  const [currLoc, setCurrLoc] = useState({});

  useEffect(() => {
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', (notificationReceivedEvent) => {
      getAvailableJobs();
      muUpcomingJobs();
      getNoification();
      // let notification = notificationReceivedEvent.getNotification();
      // // console.log('notification: ', notification);
      // const data = notification.additionalData;
      // // console.log('additionalData: ', data);
      // // Complete with null means don't show a notification.
      // notificationReceivedEvent.complete(notification);
    })

    // OneSignal.addEventListener('received', onReceived) .
  }, [OneSignal]);

  useEffect(() => {
    // CustomCurrentLocation(getLocation);
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      async () => {
        setLiveJob([]);
        setUpcomingJob([]);
        // setLocationArray([]);
        // CustomCurrentLocation(getLocation);
        getAvailableJobs();
        muUpcomingJobs();
        getNoification();
        userdetail();
        console.log(props);
        if (deviceLoc) {
          // getNearByJob();
        }
        const d = await AsyncStorage.getItem('distance');
        if (!!d) {
          setDistance(d);
        }
        props?.navigation?.setParams({});
      },
    );

    // currentLoc();

    // const timeoutID = setInterval(() => {

    //   currentLoc();
    // }, 30000);

    return () => {
      willFocusSubscription();
      setNotiList([]);
      // clearInterval(timeoutID);
    };
  }, []);
  // useEffect(() => {
  //   getAvailableJobs();
  //   muUpcomingJobs();
  // }, []);

  const userdetail = async () => {
    const profile = await AsyncStorage.getItem('profilePic');
    if (profile !== undefined && profile !== null && profile !== '') {
      setProfilePic({ uri: profile });
    }
    // console.log('profilePic========>', profilePic);
  };

  const renderHeader = () => { };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLiveJob([]);
    setUpcomingJob([]);
    // setLocationArray([]);
    // CustomCurrentLocation(getLocation);
    getAvailableJobs();
    muUpcomingJobs();
    getNoification();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const onRefreshes = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

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

  const uploadFile = async (img, job) => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token');
    // let users = JSON.parse(user);
    try {
      const d = [
        {
          name: 'file',
          filename: img.path.toString(),
          type: img.mime,
          data: RNFetchBlob.wrap(img.path),
        },
        {
          name: 'job',
          data: job,
        },

      ];
      console.log('data=>', d);
      // setLoading(true);
      RNFetchBlob.fetch(
        'POST',
        `${Constants.baseUrl}jobs/startclose`,
        {
          'Content-Type': 'multipart/form-data',
          Authorization: `jwt ${token}`,
        },
        d,
      )
        .then(resp => {
          console.log('res============>', resp.data);
          setLoading(false);
          if (JSON.parse(resp.data).status) {
            setToast(JSON.parse(resp.data).data.message);
            muUpcomingJobs()
          } else {
            setToast('Something went wrong please try again');
          }
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });
    } catch (err) {
      setLoading(false)
      console.log(err);
    }
  };

  const getLocation = res => {
    // console.log(res);
    setDeviceLoc({
      lat: res.coords.latitude,
      lng: res.coords.longitude,
    });
    if (locationArray.length === 0) {
      // locationArray.push({
      //   lat: res.coords.latitude,
      //   lng: res.coords.longitude,
      //   // lat: 21.17024,
      //   // lng: 72.831062,
      // });
      setLocationArray([
        ...locationArray,
        { lat: res.coords.latitude, lng: res.coords.longitude },
      ]);
    }

    // getNearByJob(res);
  };

  const getNearByJob = location => {
    if (location !== undefined) {
      setLoading(true);
      const data = {
        location: [location.coords.longitude, location.coords.latitude],
        // location: [72.799736, 21.192572], //surat
      };
      Post('provider/jobs/near', data, { ...props, setInitial }).then(
        async res => {
          setLoading(false);
          if (res.status) {
            // let array = [];
            // array.push({
            //   lat: location.coords.latitude,
            //   lng: location.coords.longitude,
            //   // lat: 21.17024,
            //   // lng: 72.831062,
            // });
            if (res?.data?.jobs.length > 0) {
              res?.data?.jobs.forEach(element => {
                locationArray.push({
                  lat: element?.location?.coordinates[1],
                  lng: element?.location?.coordinates[0],
                  job_id: element._id,
                });
              });
              setLocationArray(locationArray);
              onRefreshes();
            }
          } else {
            setToast(res.message);
          }
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
    }
  };

  const currentLoc = () => {
    CustomCurrentLocation(async (add) => {
      console.log(add)
      const res = await GetCurrentAddressByLatLong({ lat: add.coords.latitude, long: add.coords.longitude })
      setCurrLoc({
        lat: add.coords.latitude,
        long: add.coords.longitude,
        add: res.results[0].formatted_address,
      })
    })
  }

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
      if (type === 'start') {
        datas.message = `clock in time: ${moment(new Date(datas.start)).format('HH:mm')} and clock in location: ${datas.startAddress}`;
      } else {
        datas.message = `clock out time: ${moment(new Date(datas.close)).format('HH:mm')} and clock out location: ${datas.endAddress}`;
      }
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
            setLiveJob([]);
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

  const getAvailableJobs = () => {
    setLoading(true);
    GetApi('provider/jobs/available', { ...props, setInitial }).then(
      async res => {
        console.log(res);
        setLoading(false);
        if (res.status) {
          console.log(res?.data?.jobs[0]);
          setAvailableJobList(res?.data?.jobs);
          if (res?.data?.jobs.length === 0) {
            setNoavailable(false);
          } else {
            setNoavailable(true);
          }
        } else {
          setToast(res.message);
        }
      },
    );
  };

  const filter = hour => {
    JobFilter(mainUpcomingJob, hour, 'down').then(res => {
      setUpcomingJob(res);
    });
  };

  const selectLocation = loc => {
    if (loc?.job_id !== undefined) {
      props.navigation.navigate('AvailableJob', { jobId: loc.job_id });
    } else {
      setToast('This is your location');
    }

    // let foundJob = {};
    // foundJob = avalablaJobList.find(
    //   f => f?.location?.coordinates === [loc?.lng, loc?.lat],
    // );
    // if (foundJob !== undefined) {
    //   foundJob = mainUpcomingJob.find(
    //     f => f?.location?.coordinates === [loc?.lng, loc?.lat],
    //   );
    //   if (foundJob !== undefined) {
    //     // props.navigation.navigate('MyUpcomingJob');
    //   }
    // } else {
    //   // props.navigation.navigate('AvailableJob');
    // }
  };

  const muUpcomingJobs = () => {
    setLoading(true);
    GetApi('provider/myjobs', { ...props, setInitial }).then(async res => {
      // console.log(res.data);
      setLoading(false);
      if (res.status) {
        let livJobs = []
        // console.log('myupcoming job', res?.data?.jobs);
        JobFilter(res?.data?.jobs, 0, 'down').then(ress => {
          // console.log('live jobs----------->', ress[0].applicant)
          livJobs = ress
          // .filter(f => !f?.guards?.close)
          console.log('live============>', livJobs)
          // setLiveJob(ress);

          // if (ress.length > 0) {
          //   GetApi(`jobs/invitejob/${ress[0]._id}`, { ...props, setInitial }).then(async res => {
          //     ress[0].guards = res.data.guards
          //     console.log('invited banda------->', ress[0].guards)
          //     setLiveJob(ress);
          //   })
          // } else {
          //   setLiveJob(ress);
          // }
        });

        if (res?.data?.jobs.length === 0) {
          setNoComfirmed(false);
        } else {
          setNoComfirmed(true);
        }
        // setMainUpcomingJob(res?.data?.jobs);
        // setUpcomingJob(res?.data?.jobs);
        JobFilter(res?.data?.jobs, 0, 'up').then(res => {
          setMainUpcomingJob(res?.data?.jobs);
          const d = res.sort(function (a, b) {
            // const adate = moment(a.startDate).format('MMM DD, YYYY');
            // const bdate = moment(b.startDate).format('MMM DD, YYYY');
            return (
              new Date(a.startDate) - new Date(b.startDate)
              // new Date(`${adate} ${a.startTime}`)
            );

          });
          const l = d.filter(f => f?.guards?.start && !f?.guards?.close)
          const r = d.filter(f => !f?.guards?.start && !f?.guards?.close)
          console.log('==========>', l)
          setLiveJob([...livJobs, ...l])

          setUpcomingJob(r);
          // JobFilter(res, filterHour, 'down').then(res => {
          //   console.log('upcominglob=============>', res);
          //   setUpcomingJob(res);
          // });
          if (d.length === 0) {
            setNoComfirmed(false);
          } else {
            setNoComfirmed(true);
          }
        });
      } else {
        setToast(res.message);
      }
    });
  };
  const applyJob = id => {
    setLoading(true);
    Put(`jobs/apply/${id}`, '', { ...props, setInitial }).then(async res => {
      setLoading(false);
      if (res.status) {
        setToast(res?.data?.message || '');
        getAvailableJobs();
        muUpcomingJobs();
      } else {
        setToast(res.message);
      }
    });
  };

  const startNow = job => {
    setLiveJob([]);
    setUpcomingJob([]);
    muUpcomingJobs();
    getAvailableJobs();
    // let dCheck = false;
    // if (liveJob.length > 0) {
    //   dCheck = liveJob.find(d => d._id === job._id);
    // }
    // console.log('startNow=================>', dCheck, job);
    // if (!dCheck) {
    //   const j = [];
    //   job.started = true;
    //   j.push(job);
    //   setLiveJob(j);
    //   statrtJob('STARTED', job._id);
    // }
  };

  const endNow = job => {
    liveJob[job.index].started = false;
    setLiveJob(liveJob);
    statrtJob('FINISHED', job._id);
  };

  // const StartEndjob = () => {};

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const getNoification = jobs => {
    setNotiList([])
    setLoading(true);
    GetApi('notification', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log('notification===>', res?.data?.notifications)
        if (res.status) {
          if (res?.data?.notifications.length === 0) {
            setNoPending(false);
            return
          }
          let data = res?.data?.notifications.filter(
            f =>
              f?.invited_for?.status === 'PENDING' &&
              f?.invited_for?.job_status === 'ACTIVE' &&
              !!f?.invited_for?.job,
          );
          // console.log(
          //   'noti============>',
          //   res?.data?.notifications[0].invited_for.job,
          // );
          if (data.length === 0) {
            setNoPending(false);
          } else {
            setNoPending(true);
            // setNotiList(data);
            data.forEach(ele => {
              ele.startDate = ele.invited_for?.job.endDate;
            });
            JobFilter(data, 0, 'up').then((res = []) => {
              console.log('noti============>', res);
              setNotiList(res);
              if (res.length === 0) {
                setNoPending(false);
              } else {
                setNoPending(true);
              }
            });
          }

          // setUpcomingJob(d);
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

  const getTitle = item => {
    let newDate = new Date().getTime();
    let start = new Date(item?.startDate).getTime();
    let exc = start - newDate;
    if (exc > 86400000) {
      return 'Next Job';
    } else {
      return 'My Job';
    }
  };

  const statrtJob = (event, job_id) => {
    setLoading(true);
    Post(`jobEvents`, { event, job_id }, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        if (res.status) {
          setToast(res?.data?.message || '');
          getAvailableJobs();
          muUpcomingJobs();
        } else {
          setToast(res.message);
        }
      },
    );
  };

  const liveJobs = (item, index) => (
    <>
      {/* <View style={styles.livejobView}> */}
      {/* {liveJob.map((item, index) => ( */}
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Constants.newBlack,
            width: '100%',
          }}>
          <View style={[{}, styles.jobStatus]}>
            <Text style={[styles.jobtitle, { color: Constants.white }]}>
              {item?.title}
            </Text>
            <Text
              style={[
                styles.jobStatustext,
                !item?.started && { color: Constants.white },
              ]}>
              STARTED
            </Text>
          </View>
        </View>
        <CountDownTime
          {...item}
          index={index}
          startNow={startNow}
          show={false}
        />
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View
            style={[
              styles.amountTimeMainView,
              { flex: 3, justifyContent: 'flex-start' },
            ]}>
            <Image
              source={require('../../Assets/Images/History.png')}
              style={{ height: 25, width: 25 }}
            />
            <View>
              <Text style={[styles.amountTime, { fontSize: 18 }]}>
                {/* Start : {moment(item?.startDate).format('DD/MM/yyyy, HH:mm')}
              {'\n'}
              End : {moment(item?.endDate).format('DD/MM/yyyy, HH:mm')} */}
                {moment(item?.startDate).format('DD/MM/yyyy')}
              </Text>
              <Text style={[styles.amountTime, { fontSize: 18, marginTop: 5 }]}>
                {moment(item?.startDate).format('HH:mm')}
              </Text>
            </View>
          </View>
          <View style={[styles.amountTimeMainView, { flex: 2 }]}>
            <Text style={styles.pound}>£</Text>
            {/* <Image
                  source={require('../../Assets/Images/dollar.png')}
                  style={{height: 22, width: 22}}
                /> */}
            <Text style={[styles.amountTime, { fontSize: 18 }]}>
              Amount{'\n'}£{item?.amount}/hr
            </Text>
          </View>
        </View>
        {/* <TouchableOpacity
            style={styles.reportbtn}
            onPress={() => {
              props.navigation.navigate('Report', {...item});
            }}>
            <Text
              style={[
                styles.jobtitle,
                {
                  color: Constants.red,
                },
              ]}>
              Report
            </Text>
          </TouchableOpacity> */}
      </View>
      {/* ))} */}
      {/* <View style={styles.mylivejobtitle}>
          <Text style={styles.jobtitle}>My Live Jobs</Text>
        </View> */}
      {/* </View> */}
    </>
  );

  const upComingJobs = () => (
    <>
      {upcomingJob.slice(0, 1).map(item => (
        <View style={{ marginBottom: 20 }} key={item._id}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Constants.newBlack,
              // width: '100%',
              // height: 70,
              paddingTop: 5,
              width: Dimensions.get('window').width - 80,
              borderRadius: 5,
              marginTop: 5,
            }}>
            <View
              style={[
                styles.jobStatus,
                { marginTop: 0 },
              ]}>
              {/* <Text
                style={[styles.jobtitle, { color: Constants.white, marginBottom: 10 }]}>
                Job Starts in :
              </Text> */}
              <CountDownTime {...item} startNow={startNow} show={true} />
              {/* <Text
                          style={[
                            styles.jobStatustext,
                            !item?.started && {color: Constants.red},
                          ]}>
                          STARTED
                        </Text> */}
            </View>
            {clockinOutUi(item)}
          </View>


          {/* <Text
            style={[styles.jobtitle, {paddingTop: 0, color: Constants.white}]}>
            {item.title}
          </Text>
          <View
            style={[
              styles.jobStatus,
              {
                height: 40,
                justifyContent: 'center',
                borderWidth: 0,
                alignItems: 'center',
                width: '100%',
                marginTop:5,
                backgroundColor:Constants.newBlack
              },
            ]}>
            <CountDownTime {...item} startNow={startNow} show={true} />
          </View> */}

          <View style={{
            flexDirection: 'row',
            marginTop: 15,
            paddingHorizontal: 10,
            justifyContent: 'space-between',
          }}>
            <View
              style={[
                styles.amountTimeMainView,
                { justifyContent: 'flex-start' },
              ]}>
              <Image
                source={require('../../Assets/Images/History.png')}
                style={{ height: 25, width: 25 }}
              />
              {/* <Text style={styles.amountTime}>
                Start : {moment(item.startDate).format('DD/MM/yyyy, HH:mm')}
                {'\n'}
                End : {moment(item.endDate).format('DD/MM/yyyy, HH:mm')}
              </Text> */}
              <View>
                <Text style={[styles.amountTime, { fontSize: 14 }]}>
                  {/* Start : {moment(item?.startDate).format('DD/MM/yyyy, HH:mm')}
              {'\n'}
              End : {moment(item?.endDate).format('DD/MM/yyyy, HH:mm')} */}
                  {moment(item?.startDate).format('DD/MM/yyyy')}
                </Text>
                <Text style={[styles.amountTime, { fontSize: 14, marginTop: 5 }]}>
                  {moment(item?.startDate).format('HH:mm')}
                </Text>
              </View>
            </View>
            <View style={styles.amountTimeMainView}>
              <Text style={styles.pound}>£</Text>
              {/* <Image
                source={require('../../Assets/Images/dollar.png')}
                style={{height: 22, width: 22}}
              /> */}
              <Text style={[styles.amountTime, { fontSize: 14 }]}>
                Amount{'\n'}£{item.amount}/hr
              </Text>
            </View>
          </View>
        </View>
      ))}
    </>
  );

  const availableJobs = () => (
    <>
      {avalablaJobList.map(item => (
        <View
          key={item._id}
          style={{
            flexDirection: 'row',
            borderBottomColor: Constants.white,
            borderBottomWidth: 1,
            borderStyle: 'dashed',
            paddingVertical: 10,
          }}>
          <View style={{ flex: 2, justifyContent: 'center' }}>
            <Text style={styles.availablejobtitle}>
              {item?.client?.fullName} ({item.title})
            </Text>
          </View>
          {/* <View style={{flex: 1, alignItems: 'flex-end'}}>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => {
                applyJob(item._id);
              }}>
              <Text style={styles.applyBtnTxt}>Apply Job</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      ))}
    </>
  );
  const pendigJobs = () => (
    <>
      {notilist?.slice(0, 3).map(item => (
        <View
          key={item._id}
          style={{
            flexDirection: 'row',
            borderBottomColor: Constants.white,
            borderBottomWidth: 1,
            borderStyle: 'dashed',
            paddingVertical: 10,
          }}>
          <View style={{ flex: 2, justifyContent: 'center' }}>
            <Text style={styles.availablejobtitle} numberOfLines={1}>
              {item?.invited_for?.job?.client?.fullName} (
              {item?.invited_for?.job?.title})
            </Text>
          </View>
          {/* <View style={{flex: 1, alignItems: 'flex-end'}}>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => {
                applyJob(item._id);
              }}>
              <Text style={styles.applyBtnTxt}>Apply Job</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      ))}
    </>
  );

  const DataLength = type => (
    <View style={styles.bookingHeaderNumberView}>
      <Text style={styles.bookingHeaderNumber}>{type}</Text>
    </View>
  );

  const clockinOutUi = (item) => (
    <View style={{ flexDirection: 'row', flex: 1, gap: 10, padding: 10 }}>
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
            console.log(Math.abs(d))
            // setJobId(item._id)
            // setAccountSuc(true)
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
          // console.log('check--------->', check)
          if (check === 1 || (check === -1 && Math.abs(d) < 15)) {
            getImageValue2(item._id)
          } else {
            setToast(`You can not upload a photo before the start time`)
          }
        }}>
        <Text style={{ textAlign: 'center', color: Constants.white, fontWeight: '700' }}>Take Picture</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    // , {paddingTop: StatusBar.currentHeight}
    <View style={[styles.container]}>
      <Spinner color={'#fff'} visible={loading} />
      <CustomToaster
        color={Constants.black}
        backgroundColor={Constants.white}
        timeout={5000}
        toast={toast}
        setToast={setToast}
      />
      <View>
        {/* <Text
          style={[
            styles.title,
            {textAlign: 'center', color: Constants.white, fontSize: 22},
          ]}>
          Security Guard
        </Text> */}
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              console.log('clicked=>');
              // navigation.navigate('provider', {
              //   screen: 'Account',
              //   params: {screen: 'ProfilePro'},
              // });
              props.navigation.navigate('ProfilePro');
            }}>
            <View style={styles.headerAvtarView}>
              <Avatar.Image size={40} source={profilePic} />
            </View>
          </TouchableOpacity>
          <View style={styles.switchView}>
            <View>
              <Text style={styles.title}>I'm available for Work</Text>
            </View>
            <View style={{marginLeft: 5}}>
              <View
                style={[
                  styles.switchView2,
                  {
                    backgroundColor: isSwitchOn
                      ? Constants.green
                      : Constants.red,
                  },
                ]}>
                <Switch
                  trackColor={{true: Constants.green, false: Constants.red}}
                  value={isSwitchOn}
                  onValueChange={onToggleSwitch}
                  style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
                  thumbColor={Constants.black}
                />
              </View>
            </View>
          </View>
        </View> */}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* <ScrollView horizontal> */}
          {/* <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => {
                filter(2);
                setFilterHour(2);
              }}>
              <Text
                style={[
                  styles.filterBtnTxt,
                  {color: filterHour === 2 ? Constants.red : Constants.white},
                ]}>
                Next 02:00 Hours
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => {
                filter(5);
                setFilterHour(5);
              }}>
              <Text
                style={[
                  styles.filterBtnTxt,
                  {color: filterHour === 5 ? Constants.red : Constants.white},
                ]}>
                Next 05:00 Hours
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => {
                filter(24);
                setFilterHour(24);
              }}>
              <Text
                style={[
                  styles.filterBtnTxt,
                  {color: filterHour === 24 ? Constants.red : Constants.white},
                ]}>
                Next 24:00 Hours
              </Text>
            </TouchableOpacity> */}

          {/* <TouchableOpacity
            style={[styles.filterBtn, {marginRight: 5}]}
            onPress={() => {
              props.navigation.navigate('MyUpcomingJob');
            }}>
            <Text style={[styles.filterBtnTxt, {color: Constants.white}]}>
              Confirmed Jobs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => {
              props.navigation.navigate('AvailableJob');
            }}>
            <Text style={[styles.filterBtnTxt, {color: Constants.white}]}>
              Available Jobs
            </Text>
          </TouchableOpacity> */}
          {/* </ScrollView> */}
        </View>

        <View>
          {/* {liveJob.length > 0 && (
            <Text style={[styles.title, {color: Constants.white}]}>
              Live Job
            </Text>
          )} */}
          {/* {liveJob.length > 0 && liveJobs()} */}

          {liveJob.length > 0 && (
            <>
              {liveJob.map((item, index) => (
                <View key={index}>
                  <View
                    style={[
                      styles.livejobView,
                      {
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirectionL: 'row',
                        width: "100%",
                      },
                    ]}>
                    {/* {liveJobs(item, index)} */}
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Constants.newBlack,
                        width: '100%',
                        borderRadius: 5,
                        marginTop: 5,
                      }}>
                      <View
                        style={[
                          styles.jobStatus,
                          { marginTop: 0, paddingVertical: 10 },
                        ]}>
                        <Text
                          style={[styles.jobtitle, { color: Constants.white }]}>
                          {item?.title}
                        </Text>
                        <Text
                          style={[
                            styles.jobStatustext,
                            !item?.started && { color: Constants.red },
                          ]}>
                          STARTED
                        </Text>

                      </View>
                      {clockinOutUi(item)}
                      {/* <View style={{ flexDirection: 'row', flex: 1, gap: 10, padding: 10 }}>
                        {!item?.guards?.start && <TouchableOpacity style={{ flex: 1, backgroundColor: Constants.red, padding: 10, borderRadius: 5 }} onPress={() => {

                          jobstartclose('start', 'startlocation', 'startAddress', item._id)
                        }}>

                          <Text style={{ textAlign: 'center', color: Constants.white, fontWeight: '700' }}>Clock In</Text>
                        </TouchableOpacity>}
                        {item?.guards?.start &&
                          <TouchableOpacity
                            disabled={item?.guards?.close}
                            style={{ flex: 1, backgroundColor: item?.guards?.close ? '#8f0f0e' : Constants.red, padding: 10, borderRadius: 5 }} onPress={() => {
                              const d = moment().diff(new Date(item.endDate), 'minutes')
                              console.log(Math.abs(d))
                              // setJobId(item._id)
                              // setAccountSuc(true)
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

                            getImageValue2(item._id)
                          }}>
                          <Text style={{ textAlign: 'center', color: Constants.white, fontWeight: '700' }}>Take Picture</Text>
                        </TouchableOpacity>
                      </View> */}
                      {/* <View>  // live location
                        <Text style={{ color: Constants.white, textAlign: 'center', paddingBottom: 10 }}>{currLoc?.add}</Text>
                      </View> */}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 15,
                        paddingHorizontal: 10,
                      }}>
                      <View
                        style={[
                          styles.amountTimeMainView,
                          { flex: 3, justifyContent: 'flex-start' },
                        ]}>
                        <Image
                          source={require('../../Assets/Images/History.png')}
                          style={{ height: 25, width: 25 }}
                        />
                        <View>
                          <Text style={[styles.amountTime, { fontSize: 14 }]}>
                            {moment(item?.startDate).format('DD/MM/yyyy')}
                          </Text>
                          <Text
                            style={[
                              styles.amountTime,
                              { fontSize: 14, marginTop: 5 },
                            ]}>
                            {moment(item?.startDate).format('HH:mm')}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.amountTimeMainView, { flex: 2 }]}>
                        <Text style={styles.pound}>£</Text>
                        <Text
                          style={[
                            styles.amountTime,
                            { fontSize: 14, lineHeight: 20 },
                          ]}>
                          Amount{'\n'}£{item?.amount}/hr
                        </Text>
                      </View>
                    </View>
                    <View style={styles.mylivejobtitle}>
                      <Text style={[styles.jobtitle, { color: Constants.white }]}>
                        My Live Job
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.reportbtn}
                      onPress={() => {
                        props.navigation.navigate('Report', { ...item });
                      }}>
                      <Text
                        style={[
                          styles.jobtitle,
                          {
                            color: Constants.red,
                          },
                        ]}>
                        Report
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}

          <View
            style={[
              styles.livejobView,
              // !noComfirmed &&
              {
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            {/* {noComfirmed && upComingJobs()}
            {!noComfirmed && (
              <NojobFound
                header="No comfirmed job yet"
                height={80}
                width={Dimensions.get('window').width - 80}
              />
            )} */}
            <View
              style={[
                styles.mylivejobtitle,
                { flexDirection: 'row', alignItems: 'center' },
              ]}>
              <Text
                style={[
                  styles.jobtitle,
                  { textAlign: 'left', color: Constants.white },
                ]}>
                {'My Confirmed Job'}
              </Text>
            </View>
            {upcomingJob.length > 0 ? upComingJobs() : DataLength(upcomingJob.length)}
            {/* {DataLength(upcomingJob.length)} */}
            <TouchableOpacity
              style={styles.reportbtn}
              onPress={() => {
                props.navigation.navigate('MyUpcomingJob');
              }}>
              <Text
                style={[
                  styles.jobtitle,
                  {
                    color: Constants.red,
                  },
                ]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.livejobView,
            // !noPending &&
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          {/* {noPending && pendigJobs()}
          {!noPending && (
            <NojobFound
              header="No pending job"
              height={80}
              width={Dimensions.get('window').width - 80}
            />
          )} */}
          <View
            style={[
              styles.mylivejobtitle,
              { flexDirection: 'row', alignItems: 'center' },
            ]}>
            <Text style={[styles.jobtitle, { color: Constants.white }]}>
              My Pending Job
            </Text>
          </View>
          {DataLength(notilist.length)}

          <TouchableOpacity
            style={styles.reportbtn}
            onPress={() => {
              // props.navigation.navigate('Notification', {
              //   screen: 'NotificationPro2',
              //   params: {status: 'Pending'},
              // });
              props.navigation.navigate('NotificationPro', {
                status: 'Pending',
              });
            }}>
            <Text
              style={[
                styles.jobtitle,
                {
                  color: Constants.red,
                },
              ]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.livejobView,
            // avalablaJobList?.length === 0 &&
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          {/* {noAvailable && availableJobs()}
          {!noAvailable && (
            <NojobFound
              header=" No other available job"
              height={80}
              width={Dimensions.get('window').width - 80}
            />
          )} */}
          <View
            style={[
              styles.mylivejobtitle,
              { flexDirection: 'row', alignItems: 'center' },
            ]}>
            <Text
              style={[
                styles.jobtitle,
                { textAlign: 'left', color: Constants.white },
              ]}>
              Other Available Job
            </Text>
          </View>
          {DataLength(avalablaJobList.length)}

          <TouchableOpacity
            style={styles.reportbtn}
            onPress={() => {
              props.navigation.navigate('AvailableJob');
            }}>
            <Text
              style={[
                styles.jobtitle,
                {
                  color: Constants.red,
                },
              ]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {/* {deviceLoc !== undefined && (
          <View style={styles.mapView}>
            <View style={styles.mapheader}>
              <Text style={styles.mapheadertxt}>Jobs Near Me</Text>
              <Text style={styles.mapheadertxt2}>({distance} Mile)</Text>
            </View>
            <CustomMapView
              style={{
                height: 300,
                width: Dimensions.get('window').width - 40,
              }}
              deviceLoc={deviceLoc}
              selectLocation={selectLocation}
              locationArray={locationArray}
            />
          </View>
        )} */}
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

export default Home;
