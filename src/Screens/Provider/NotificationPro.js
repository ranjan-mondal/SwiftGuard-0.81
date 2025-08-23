/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Modal,
  AppState,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Constants from '../../Helpers/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Post, GetApi, Put, Delete } from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import { Badge } from 'react-native-paper';
import styles from './StyleProvider';
import { Context } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import moment from 'moment';
import CoustomDropdown from '../../Component/CoustomDropdown';
import { SwipeListView } from 'react-native-swipe-list-view';
import { white } from 'react-native-paper/lib/typescript/styles/colors';
import NojobFound from '../../Component/NojobFound';
import JobFilter from '../../Component/JobFilter';
import { OneSignal } from 'react-native-onesignal';


const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const NotificationPro = props => {
  // console.log(props);
  const dList = [
    { name: 'All', type: 'ALL' },
    { name: 'Pending', type: 'PENDING' },
    { name: 'Assigned', type: 'ASSIGNED' },
    { name: 'Accepted', type: 'ACCEPTED' },
    { name: 'Rejected', type: 'REJECTED' },
  ];
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [notilist, setNotiList] = useState([]);
  const [mainList, setMainList] = useState([]);
  // const [mainNotiList, setMainNotiList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showDrop, setShowrop] = useState(false);
  const [dropList, setDropList] = useState(dList);
  const [listType, setListType] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [noti, setNoti] = useState(false);
  const [jobfound, setJobfound] = useState(true);
  // const [titles, setTitle] = useState('Notifications');

  useEffect(() => {
    if (props?.route?.name === 'NotificationPro') {
      OneSignal.Notifications.addEventListener('foregroundWillDisplay', (notificationReceivedEvent) => {
        console.log(
          'OneSignal: notification will show in foreground:',
          notificationReceivedEvent,
        );

        getNoification();

        // let notification = notificationReceivedEvent.getNotification();
        // console.log('notification: ', notification);
        // const data = notification.additionalData;
        // console.log('additionalData: ', data);
        // // Complete with null means don't show a notification.
        // notificationReceivedEvent.complete(notification);
      },
      );
    }


    // OneSignal.addEventListener('received', onReceived) .
  }, [OneSignal]);

  console.log(AppState.currentState, props?.route?.name);
  useEffect(() => {
    getNoification();
    if (props?.route?.params?.status === 'Pending') {
      props.navigation.setOptions({
        headerTitle: () => {
          return <Text style={styles.headerTitle}>{'Pending Jobs'}</Text>;
        },
      });
    }
  }, [AppState.currentState]);

  useEffect(() => {
    // let cancel = false;
    // if (cancel) return;

    setListType('All');
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      async () => {
        getNoification();
        if (props?.route?.params?.status === 'Pending') {
          props.navigation.setOptions({
            headerTitle: () => {
              return <Text style={styles.headerTitle}>{'Pending Jobs'}</Text>;
            },
          });
        }
      },
    );

    const unsubscribe = props.navigation.addListener('tabPress', e => {
      // Prevent default action
      clearState();
      getNoification();
    });

    return function cleanup() {
      // cancel = false;

      console.log('=============================================>');

      willFocusSubscription;
      unsubscribe;
      // setToast('');
      // setNotiList([]);
      // setMainList([]);
      // setDropList([]);
      // setLoading(false);
      // setSearchVal('');
      // setRefreshing(false);
      // setShowrop(false);
      // setListType('');
      // setInitial(Context);
    };
  }, []);

  const clearState = async () => {
    await props.navigation.reset();
  };

  const getDropValue = (title, type) => {
    // console.log(title, type);
    setListType(title);
    setShowrop(false);
    if (title === 'All') {
      console.log(mainList);
      if (mainList.length === 0) {
        setJobfound(false);
      } else {
        setJobfound(true);
      }
      setNotiList(mainList);
    } else {
      if (title === 'Pending') {
        const d = mainList.filter(
          f =>
            f?.invited_for?.status === 'PENDING' &&
            f?.invited_for?.job_status === 'ACTIVE' &&
            !!f?.invited_for?.job,
        );
        console.log(d);
        if (d.length > 0) {
          setJobfound(true);
          // setNotiList(d);
          d.forEach(ele => {
            ele.startDate = ele.invited_for?.job.endDate;
          });
          JobFilter(d, 0, 'up').then(res => {
            console.log('noti============>', res);

            setNotiList(res);
            if (res.length === 0) {
              setJobfound(false);
            } else {
              setJobfound(true);
            }
          });
        } else {
          setJobfound(false);
        }
      } else {
        const data = mainList.filter(f => f?.invited_for?.status === type);
        console.log(data);
        if (data?.length === 0) {
          setJobfound(false);
        } else {
          setJobfound(true);
        }
        setNotiList(data);
      }
    }
    // if (props?.route?.params?.status === 'Pending') {
    //   props.navigation.setOptions({
    //     headerTitle: () => {
    //       return <Text style={styles.headerTitle}>{title + ' Jobs'}</Text>;
    //     },
    //   });
    // }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  // const localFilter = text => {
  //   let data = [];
  //   if (text.length > 3) {
  //     data = mainNotiList.filter(f =>
  //       f?.title?.toLowerCase().includes(text.toLowerCase()),
  //     );
  //     setNotiList(data);
  //   } else {
  //     setNotiList(mainNotiList);
  //   }
  // };

  const getNoification = () => {
    setLoading(true);
    GetApi('notification', { ...props, setInitial }).then(
      async res => {
        console.log('noti============>', res?.data?.notifications[0]);
        setLoading(false);
        // console.log(res.data.notifications[6].invited_for);
        if (res.status) {
          // console.log(res.data.notifications[3]);
          // const p = props.navigation.getState();
          // console.log(p);
          setMainList(res.data.notifications);
          if (props?.route?.params?.status === 'Pending') {
            const data = res.data.notifications.filter(
              f =>
                f?.invited_for?.status === 'PENDING' &&
                f?.invited_for?.job_status === 'ACTIVE' &&
                !!f?.invited_for?.job,
            );
            console.log(data.length);
            if (data.length > 0) {
              // setNotiList(data);
              data.forEach(ele => {
                ele.startDate = ele.invited_for?.job.endDate;
              });
              JobFilter(data, 0, 'up').then(re => {
                console.log('noti============>', re);
                console.log(re.length);
                setNotiList(re);
                if (re.length === 0) {
                  setJobfound(false);
                } else {
                  setJobfound(true);
                }
              });
              if (data.length === 0) {
                setJobfound(false);
              } else {
                setJobfound(true);
              }
              // setNotiList(data);
              setListType('Pending');
              props.navigation.setOptions({
                headerTitle: () => {
                  return (
                    <Text style={styles.headerTitle}>{'Pending Jobs'}</Text>
                  );
                },
              });
            } else {
              setJobfound(false);
            }
          } else {
            if (res.data.notifications.length === 0) {
              setJobfound(false);
            } else {
              setJobfound(true);
            }
            setNotiList(res.data.notifications);
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
  };

  const applyJob = item => {
    if (item?.invited_for?.job_status === 'ACTIVE') {
      setLoading(true);
      Put(
        `jobs/apply/${item.invited_for.job._id}?notification_page=true&&invite_id=${item.invited_for._id}`,
        '',
        {
          ...props,
          setInitial,
        },
      ).then(async res => {
        setLoading(false);
        console.log('notification========>', res);
        if (res.status) {
          setToast(res?.data?.message || '');
          if (res.data.message !== 'Vacancy Full!') {
            props.navigation.navigate('MyUpcomingJob');
          }
        } else {
          setToast(res.message);
        }
      });
    } else {
      setToast(
        item?.invited_for?.job_status === 'REVOKED'
          ? 'Re assigned to someone'
          : item?.invited_for?.job_status === 'PUBLIC'
            ? 'Job made public'
            : item?.invited_for?.job_status === 'DELETED' &&
            'Job no longer available',
      );
    }
  };

  const reject = (invite, index) => {
    setLoading(true);
    console.log(invite?.job._id);
    Delete(`jobs/reject/${invite?.job._id}`, '', {
      ...props,
      setInitial,
    }).then(async res => {
      setLoading(false);
      console.log(res);
      if (res.status) {
        setToast(res?.data?.message || '');
        invite.status = 'REJECTED';
        notilist[index].invited_for = invite;
        setNotiList(notilist);

        onRefresh();
      } else {
        setToast(res.message);
      }
    });
  };

  const deleteAllNoti = item => {
    setLoading(true);
    let url = 'notification';
    if (!!item?._id) {
      url = `notification${!!item?._id && '/' + item._id}`;
    }
    Delete(url, '', {
      ...props,
      setInitial,
    }).then(async res => {
      setLoading(false);
      console.log(res);
      if (res.status) {
        setToast(res?.data?.message || 'Cleared successfully');
        getNoification();
      } else {
        setToast(res.message);
      }
    });
  };

  const notificationHistory = (item, index) => (
    <View
      style={[
        styles.postjobView2,
        {
          paddingLeft: 0,
          backgroundColor: Constants.black,
          // borderColor: 'red',
          // borderWidth: 2,
        },
      ]}>
      <View
        style={[
          {
            flexDirection: 'row',
            padding: 10,
          },
          item?.showDetail && {
            borderBottomWidth: 1,
            borderBottomColor: Constants.grey,
          },
        ]}>
        {/* <View style={styles.iconView}>
          <Ionicons name={'search-outline'} size={25} color={Constants.white} />
        </View> */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={[styles.showdetail, { fontSize: 20 }]}>{index + 1}</Text>
        </View>
        <View
          style={[
            styles.postjobTitleView,

            item.invited_for === undefined && { borderRightWidth: 0 },
            {
              borderLeftWidth: 2,
              borderLeftColor: Constants.red,
              paddingHorizontal: 2,
            },
          ]}>
          <Text style={[styles.postjobtitle, { marginLeft: 10, lineHeight: 20 }]}>
            {item?.message}
          </Text>
        </View>
        {!item?.showDetail && item.invited_for !== undefined && (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.showdetail}>Show{'\n'}Details</Text>
          </View>
        )}
        {item?.showDetail && (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.showAmount, { fontSize: 16 }]}>
              £{item?.invited_for?.job?.amount}/hr
            </Text>
          </View>
        )}
      </View>

      {item?.showDetail && item?.invited_for?.job_status !== 'DELETED' && (
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
          }}>
          <View
            style={[
              styles.postjobTitleView,
              { position: 'relative', borderRightWidth: 0 },
            ]}>
            <Text
              style={[
                styles.postjobtitle,
                { color: Constants.red, fontWeight: '700', fontSize: 16 },
              ]}>
              {item?.invited_for?.job?.client?.fullName} (
              {item?.invited_for?.job?.title})
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
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
                  {moment(item?.invited_for?.job?.startDate).format(
                    'DD/MM/yyyy, HH:mm',
                  )}
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
                  {moment(item?.invited_for?.job?.endDate).format(
                    'DD/MM/yyyy, HH:mm',
                  )}
                </Text>
              </View>
            </View>
            {item?.showDetail && item?.invited_for?.job_status !== 'ACTIVE' && (
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 20,
                }}>
                <View
                  style={[
                    styles.postjobTitleView,
                    { position: 'relative', borderRightWidth: 0 },
                  ]}>
                  <Text
                    style={[
                      styles.postjobtitle,
                      {
                        color: Constants.red,
                        fontWeight: '700',
                        fontSize: 20,
                      },
                    ]}>
                    {item?.invited_for?.job_status === 'REVOKED'
                      ? 'Re assigned to someone !!'
                      : item?.invited_for?.job_status === 'PUBLIC'
                        ? 'Job made public !!'
                        : item?.invited_for?.job_status === 'DELETED' &&
                        'Job no longer available !!'}
                  </Text>
                </View>
              </View>
            )}
            <View>
              <Text style={[styles.showAmount, { fontSize: 14, marginTop: 10 }]}>
                Address
              </Text>
              <Text style={[styles.description, { fontSize: 11 }]}>
                {item?.invited_for?.job?.address}
              </Text>
            </View>
          </View>
        </View>
      )}

      {item?.showDetail && item?.invited_for?.job_status === 'DELETED' && (
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
          }}>
          <View
            style={[
              styles.postjobTitleView,
              { position: 'relative', borderRightWidth: 0 },
            ]}>
            <Text
              style={[
                styles.postjobtitle,
                {
                  color: Constants.red,
                  fontWeight: '700',
                  fontSize: 20,
                },
              ]}>
              {item?.invited_for?.job_status === 'REVOKED'
                ? 'Re assigned to someone !!'
                : item?.invited_for?.job_status === 'PUBLIC'
                  ? 'Job made public !!'
                  : item?.invited_for?.job_status === 'DELETED' &&
                  'Job no longer available !!'}
            </Text>
          </View>
        </View>
      )}

      {item?.showDetail && item?.invited_for?.job_status === 'ACTIVE' && (
        <View style={{ paddingHorizontal: 20 }}>
          {item?.invited_for?.status !== 'REJECTED' && (
            <Text style={[styles.showAmount, { fontSize: 14 }]}>
              Job Details....
            </Text>
          )}
          {item?.invited_for?.status !== 'REJECTED' && (
            <Text style={[styles.description, { fontSize: 11 }]}>
              {item?.invited_for?.job?.description}
            </Text>
          )}

          {item?.invited_for?.status === 'PENDING' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={[
                    styles.applyBtn1,
                    { backgroundColor: Constants.green, height: 40 },
                  ]}
                  onPress={() => {
                    applyJob(item);
                  }}>
                  <Text style={styles.applyBtnTxt}>Accept</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={styles.applyBtn1}
                  onPress={() => {
                    reject(item.invited_for, index);
                  }}>
                  <Text style={styles.applyBtnTxt}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {item?.invited_for?.status !== 'PENDING' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
              }}>
              {item?.invited_for?.status === 'ACCEPTED' && (
                <View style={{ flex: 1 }}>
                  <View
                    style={[
                      styles.applyBtn1,
                      {
                        backgroundColor: Constants.black,
                        height: 40,
                        borderColor: Constants.white,
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => {
                      notilist[index]?.showDetail === false;
                      setNotiList(notilist);
                      onRefresh();
                    }}>
                    <Text
                      style={[
                        styles.applyBtnTxt,
                        { color: Constants.green, fontSize: 16 },
                      ]}>
                      You have accepted the job.
                    </Text>
                  </View>
                </View>
              )}
              {item?.invited_for?.status === 'REJECTED' && (
                <View style={{ flex: 1 }}>
                  <View
                    style={[
                      styles.applyBtn1,
                      {
                        backgroundColor: Constants.black,
                        height: 40,
                        borderColor: Constants.white,
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => {
                      notilist[index]?.showDetail === false;
                      setNotiList(notilist);
                      onRefresh();
                    }}>
                    <Text
                      style={[
                        styles.applyBtnTxt,
                        { color: Constants.red, fontSize: 16 },
                      ]}>
                      You have rejected the job.
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.applyBtn1}
                onPress={() => {
                  deleteAllNoti(item);
                }}>
                <Text style={styles.applyBtnTxt}>Delete this notification</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowDetail(!showDetail);
                }}
                style={[
                  styles.applyBtn,
                  {
                    height: 50,
                    width: '100%',
                  },
                ]}>
                <Text
                  style={[styles.applyBtnTxt, {fontSize: 22, lineHeight: 25}]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View> */}
        </View>
      )}

      <View style={{ position: 'absolute', right: 10, top: 10 }}>
        <Badge
          size={10}
          style={{
            backgroundColor:
              item?.invited_for?.status === 'ACCEPTED' ||
                item?.invited_for?.status === 'ASSIGNED'
                ? Constants.green
                : item?.invited_for?.status === 'REJECTED'
                  ? Constants.red
                  : 'orange',
          }}
        />
      </View>

      {item.invited_for !== undefined && (
        <TouchableOpacity
          style={styles.iconView2}
          // onPress={() => {
          onPress={() => {
            notilist[index].showDetail =
              notilist[index]?.showDetail === undefined ||
                notilist[index]?.showDetail === false
                ? true
                : false;
            setNotiList(notilist);
            onRefresh();
            // setShowDetail(!showDetail);
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
      )}
    </View>
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
      <View
        style={{
          flex: 1,
          paddingBottom: props?.route?.params?.status !== 'Pending' ? 80 : 0,
        }}>
        {/* {props?.route?.params?.status !== 'Pending' && (
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
              placeholder="Search job notifcation"
              placeholderTextColor={Constants.white}
              value={searchVal}
              onChangeText={text => {
                setSearchVal(text);
                localFilter(text);
              }}
            />
          </View>
        )} */}
        {props?.route?.params?.status !== 'Pending' && (
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
              <CoustomDropdown
                visible={showDrop}
                setVisible={setShowrop}
                getDropValue={getDropValue}
                data={dList}
              />
            </TouchableOpacity>
            {notilist.length > 0 && (
              <TouchableOpacity
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <View>
                  <Text
                    style={[
                      styles.listtypeName,
                      { fontSize: 16, color: Constants.red },
                    ]}>
                    Clear All
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}

        {jobfound && (
          // && {paddingBottom: 260}
          <View
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <SwipeListView
              data={notilist}
              disableRightSwipe
              // closeOnScroll
              renderItem={(data, index) => (
                <TouchableOpacity
                  onPress={() => {
                    setNoti(data.item);
                  }}>
                  {notificationHistory(data.item, data.index)}
                </TouchableOpacity>
              )}
              renderHiddenItem={(data, rowMap) => (
                <View
                  style={[
                    { flex: 1, justifyContent: 'center', alignItems: 'center' },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('called');
                      deleteAllNoti(data.item);
                    }}
                    style={{ position: 'absolute', right: 5 }}>
                    <Text
                      style={{
                        color: Constants.red,
                        fontWeight: '700',
                      }}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              // leftOpenValue={60}
              rightOpenValue={-75}
            />
          </View>
        )}
        {!jobfound && (
          <NojobFound
            header={'No notification(s) yet'}
            height={Dimensions.get('window').height - 300}
          />
        )}
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={styles.textStyle}>
                Are you sure you want to clear all notifications?
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.cancelButtonStyle}>
                  <Text style={styles.modalText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setModalVisible(!modalVisible);
                    deleteAllNoti();
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Clear All</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NotificationPro;
