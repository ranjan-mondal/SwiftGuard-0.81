/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  ViewPagerAndroidBase,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import styles from './StyleProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../Helpers/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Post, GetApi } from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import { checkForEmptyKeys } from '../../Helpers/InputsNullChecker';
import { Context } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import debounce from 'lodash.debounce';
import VersionInfo from 'react-native-version-info';


const SettingPro = props => {
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [countmile, setCountMile] = useState(1);
  const [showNoti, setShowNoti] = useState(false);
  const [pushNoti, setPushNoti] = useState(false);
  const [emailNoti, setEmailNoti] = useState(false);
  const [showChange, setShowChange] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const [showConfirmPass, setShowConfirmPass] = useState(true);
  const [userDetail, setUserDetail] = useState({
    newpassword: '',
    confirmpassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [filedCheck, setfiledCheck] = useState([]);
  const [dbValue, saveToDb] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [account, setAccount] = useState(false);
  const [accountSuc, setAccountSuc] = useState(false);

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      getSettings();
      console.log(VersionInfo);
    });
    return () => {
      willFocusSubscription;
      setShowNoti(false);
      setShowChange(false);
    };
  }, []);

  const debouncedSave = useCallback(
    debounce(nextValue => {
      saveToDb(nextValue);
      setDistance(nextValue);
    }, 1000),
    [], // will be created only once initially
  );

  const setCountMileValue = type => {
    if (type === 'add') {
      if (countmile !== 10) {
        setCountMile(countmile + 1);
        debouncedSave(countmile + 1);
      }
    } else if (countmile !== 0) {
      setCountMile(countmile - 1);
      debouncedSave(countmile - 1);
    }
  };

  const changePassword = () => {
    let { errorString, anyEmptyInputs } = checkForEmptyKeys(userDetail);
    setfiledCheck(anyEmptyInputs);

    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
    } else {
      if (userDetail.newpassword !== userDetail.confirmpassword) {
        setToast('Your password does not match with Confirm password');
        return;
      }

      const data = {
        password: userDetail.newpassword,
      };
      console.log('data==========>', data);
      setLoading(true);
      Post('profile/changePassword', data, { ...props, setInitial }).then(
        async res => {
          setLoading(false);
          console.log(res);
          if (res.status) {
            setToast(res.data.message);
            // props.navigation.navigate('Signin');
            setShowChange(false);
            setUserDetail({
              newpassword: '',
              confirmpassword: '',
            });
          }
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
    }
  };

  const notificationSetings = type => {
    setPushNoti(type);
    const data = {
      notification: type,
    };
    console.log('data==========>', data);
    setLoading(true);
    Post('settings', data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setToast(res.data.message);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const setDistance = distance => {
    console.log('data==========>', { distance });
    setLoading(true);
    Post('settings', { distance }, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        await AsyncStorage.setItem('distance', distance.toString());
        console.log(res);
        if (res.status) {
          setToast(res.data.message);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getSettings = () => {
    setLoading(true);
    // Services('user/jobs', 'get', {...props}, '').then(
    GetApi('settings', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res.data);
        await AsyncStorage.setItem(
          'distance',
          res?.data?.settings?.distance.toString() || 5,
        );
        // if (res.status) {
        setPushNoti(res?.data?.settings?.notification || false);
        setCountMile(res?.data?.settings?.distance || 5);
        // setJobList(res.data.jobs);
        // } else {
        //   Toaster(res.message);
        // }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const openURI = async url => {
    const supported = await Linking.canOpenURL(url); //To check if URL is supported or not.
    await Linking.openURL(url); // It will open the URL on browser.
    console.log(supported);
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
      <ScrollView
        style={{ marginTop: 40, marginBottom: 20 }}
        keyboardShouldPersistTaps="always">
        {/* <TouchableOpacity style={styles.settingsView}>
          <View style={[styles.iconView, {height: 35, borderRightWidth: 2}]}>
            <Image
              source={require('../../Assets/Images/Notification1.png')}
              style={styles.icon2}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.settingstext}>Notification Setting</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsView}>
          <View style={[styles.iconView, {height: 35, borderRightWidth: 2}]}>
            <Image
              source={require('../../Assets/Images/security.png')}
              style={styles.icon2}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.settingstext}>Security</Text>
        </TouchableOpacity> */}

        <View style={styles.notificationSetingView}>
          <TouchableOpacity
            style={[
              styles.notificationtitle,
              showNoti && {
                borderBottomWidth: 1,
                borderBottomColor: Constants.grey,
              },
            ]}
            onPress={() => {
              setShowNoti(!showNoti);
            }}>
            <View style={[styles.iconView, { height: 35, borderRightWidth: 2 }]}>
              <Image
                source={require('../../Assets/Images/Notification1.png')}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.settingstext}>Notification Setting</Text>
            <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
              <Ionicons
                name={showNoti ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Constants.white}
              />
            </View>
          </TouchableOpacity>
          {showNoti && (
            <View style={{ paddingVertical: 10 }}>
              <View style={styles.pushNotiView}>
                <View style={styles.pushNoti}>
                  <Text style={[styles.settingstext, { color: Constants.red }]}>
                    Push Notification
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    notificationSetings(!pushNoti);
                    // setPushNoti(!pushNoti);
                  }}
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={
                      pushNoti
                        ? require('../../Assets/Images/on.png')
                        : require('../../Assets/Images/off.png')
                    }
                    resizeMode="contain"
                    style={{ width: 40, height: 20 }}
                  />
                </TouchableOpacity>
              </View>
              {/* <View style={styles.pushNotiView}>
                <View style={styles.pushNoti}>
                  <Text style={[styles.settingstext, {color: Constants.red}]}>
                    Email Notification
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setEmailNoti(!emailNoti);
                  }}
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={
                      emailNoti
                        ? require('../../Assets/Images/on.png')
                        : require('../../Assets/Images/off.png')
                    }
                    resizeMode="contain"
                    style={{width: 40, height: 20}}
                  />
                </TouchableOpacity>
              </View> */}
            </View>
          )}
        </View>

        <View style={styles.notificationSetingView}>
          <TouchableOpacity
            style={[
              styles.notificationtitle,
              showChange && {
                borderBottomWidth: 1,
                borderBottomColor: Constants.grey,
              },
            ]}
            onPress={() => {
              setShowChange(!showChange);
            }}>
            <View style={[styles.iconView, { height: 35, borderRightWidth: 2 }]}>
              <Image
                source={require('../../Assets/Images/security.png')}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.settingstext}>Change Password</Text>
            <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
              <Ionicons
                name={showChange ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Constants.white}
              />
            </View>
          </TouchableOpacity>

          {showChange && (
            <View style={{ padding: 20 }}>
              <View style={[styles.fieldView, { position: 'relative' }]}>
                <View
                  style={[styles.iconView, { height: 35, borderRightWidth: 2 }]}>
                  <Image
                    source={require('../../Assets/Images/lock.png')}
                    style={{ height: 20, width: 20 }}
                    resizeMode="contain"
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  secureTextEntry={showPass}
                  placeholderTextColor={Constants.lightgrey}
                  value={userDetail.newpassword}
                  onChangeText={newpassword =>
                    setUserDetail({ ...userDetail, newpassword })
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowPass(!showPass);
                  }}
                  style={[
                    styles.iconView,
                    { position: 'absolute', right: 0, borderRightWidth: 0 },
                  ]}>
                  <Image
                    source={
                      showPass
                        ? require('../../Assets/Images/eye-1.png')
                        : require('../../Assets/Images/eye.png')
                    }
                    style={{ height: 18, width: 22 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              {filedCheck.includes('NEWPASSWORD') && (
                <Text style={{ color: 'red' }}> New Password is required</Text>
              )}
              <View
                style={[
                  styles.fieldView,
                  { position: 'relative', marginTop: 20 },
                ]}>
                <View
                  style={[styles.iconView, { height: 35, borderRightWidth: 2 }]}>
                  <Image
                    source={require('../../Assets/Images/lock.png')}
                    style={{ height: 20, width: 20 }}
                    resizeMode="contain"
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry={showConfirmPass}
                  placeholderTextColor={Constants.lightgrey}
                  value={userDetail.confirmpassword}
                  onChangeText={confirmpassword =>
                    setUserDetail({ ...userDetail, confirmpassword })
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowConfirmPass(!showConfirmPass);
                  }}
                  style={[
                    styles.iconView,
                    { position: 'absolute', right: 0, borderRightWidth: 0 },
                  ]}>
                  <Image
                    source={
                      showConfirmPass
                        ? require('../../Assets/Images/eye-1.png')
                        : require('../../Assets/Images/eye.png')
                    }
                    style={{ height: 18, width: 22 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              {filedCheck.includes('CONFIRMPASSWORD') && (
                <Text style={{ color: 'red' }}>
                  {' '}
                  Confirm Password is required
                </Text>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <TouchableOpacity
                    onPress={() => {
                      changePassword();
                    }}
                    style={[styles.applyBtn, { width: '100%', height: 50 }]}>
                    <Text
                      style={[
                        styles.applyBtnTxt,
                        { fontSize: 16, lineHeight: 25 },
                      ]}>
                      Set Password
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.settingsView}
          onPress={() => {
            openURI(
              'https://www.termsandconditionsgenerator.com/live.php?token=Wabgap7JmhLKxksVSiQVUnvpHfDGPSEj',
            );
          }}>
          <View style={[styles.iconView, { height: 35, borderRightWidth: 2 }]}>
            <Image
              source={require('../../Assets/Images/privacy.png')}
              style={styles.icon2}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.settingstext}>Privacy</Text>
        </TouchableOpacity>
        <View style={styles.settingsView}>
          <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.iconView, { height: 35, borderRightWidth: 2 }]}>
              <Image
                source={require('../../Assets/Images/distance.png')}
                style={styles.icon2}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.settingstext, { marginRight: 0 }]}>
              Job Distance
            </Text>
            <Text
              style={[
                styles.settingstext,
                { color: Constants.red, marginLeft: 5, fontSize: 12 },
              ]}>
              (Miles)
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingRight: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setCountMileValue('remove');
              }}>
              <Ionicons name="remove" size={25} color={Constants.red} />
            </TouchableOpacity>
            <Text style={styles.mileCount}>{countmile}</Text>
            <TouchableOpacity
              onPress={() => {
                setCountMileValue('add');
              }}>
              <Ionicons name="add" size={25} color={Constants.red} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.settingsView}
          onPress={async () => {
            setModalVisible(true);
          }}>
          <View style={[styles.iconView, { height: 35, borderRightWidth: 2 }]}>
            <Image
              source={require('../../Assets/Images/signout.png')}
              style={styles.icon2}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.settingstext}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsView}
          onPress={async () => {
            setAccount(true);
          }}>
          <View style={[styles.iconView, { height: 35, borderRightWidth: 2 }]}>
            <Image
              source={require('../../Assets/Images/signout.png')}
              style={styles.icon2}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.settingstext}>Delete Account</Text>
        </TouchableOpacity>
        <View style={styles.settingsView}>
          <View style={[styles.iconView, { height: 35, borderRightWidth: 2 }]}>
            <Ionicons name="server" size={25} color={Constants.red} />
          </View>
          {Platform.OS === 'ios' ? (
            <Text style={styles.settingstext}>
              Version - {VersionInfo?.appVersion}.{VersionInfo?.buildVersion}
            </Text>
          ) : (
            <Text style={styles.settingstext}>
              Version - {VersionInfo?.buildVersion}.{VersionInfo?.appVersion}
            </Text>
          )}
        </View>
      </ScrollView>
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
                Are you sure you want to sign out?
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
                    setInitial('Signin');
                    await AsyncStorage.clear();
                    props.navigation.navigate('Signin');
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Sign out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="none"
        transparent={true}
        visible={account}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setAccount(!account);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={styles.textStyle}>
                Deleting your account will delete your access and all your
                information on this app and website. Are you sure you want to
                continue?
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setAccount(!account)}
                  style={styles.cancelButtonStyle}>
                  <Text style={styles.modalText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setAccount(!account);
                    setAccountSuc(true);
                    // setInitial('Signin');
                    // await AsyncStorage.removeItem('userDetail');
                    // props.navigation.navigate('Signin');
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="none"
        transparent={true}
        visible={accountSuc}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setAccountSuc(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text
                style={styles.textStyle}
                onPress={() => {
                  openURI(
                    'https://swiftguard-admin-2digitinnovations.vercel.app/',
                  );
                }}>
                Go to our website {'Login -> edit profile -> delete account'}.
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setAccountSuc(false)}
                  style={styles.cancelButtonStyle}>
                  <Text style={styles.modalText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setAccountSuc(false);
                    openURI(
                      'https://swiftguard-admin-2digitinnovations.vercel.app/',
                    );
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Open website</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingPro;
