/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import styles from './StylesUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../Helpers/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Post, GetApi} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import {checkForEmptyKeys} from '../../Helpers/InputsNullChecker';
import {Context} from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import VersionInfo from 'react-native-version-info';


const Settings = props => {
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [modalVisible, setModalVisible] = useState(false);

  console.log('settingsprops=========>', props);
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
  const [account, setAccount] = useState(false);
  const [accountSuc, setAccountSuc] = useState(false);

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      getSettings();
    });
    return () => {
      willFocusSubscription;
      setShowNoti(false);
      setShowChange(false);
    };
  }, []);

  const getSettings = () => {
    setLoading(true);
    // Services('user/jobs', 'get', {...props}, '').then(
    GetApi('settings', {...props, setInitial}).then(
      async res => {
        setLoading(false);
        console.log(res.data);
        // if (res.status) {
        setPushNoti(res?.data?.settings?.notification || false);
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

  const changePassword = () => {
    let {errorString, anyEmptyInputs} = checkForEmptyKeys(userDetail);
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
      Post('profile/changePassword', data, {...props, setInitial}).then(
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
    Post('settings', data, {...props, setInitial}).then(
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
      <ScrollView style={{marginTop: 40}} keyboardShouldPersistTaps="always">
        {/* <TouchableOpacity
          style={styles.settingsView}
          onPress={() => {
            props.navigation.navigate('UpdateCreditCard');
          }}>
          <View style={[styles.iconView2, {height: 35, borderRightWidth: 2}]}>
            <Image
              source={require('../../Assets/Images/creditcard.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.settingstext}>Update Credit Card</Text>
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
            <View style={[styles.iconView2, {height: 35, borderRightWidth: 2}]}>
              <Image
                source={require('../../Assets/Images/Notification1.png')}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.settingstext}>Notification Setting</Text>
            <View style={{flex: 1, alignItems: 'flex-end', marginRight: 10}}>
              <Ionicons
                name={showNoti ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Constants.white}
              />
            </View>
          </TouchableOpacity>
          {showNoti && (
            <View style={{paddingVertical: 10}}>
              <View style={styles.pushNotiView}>
                <View style={styles.pushNoti}>
                  <Text style={[styles.settingstext, {color: Constants.red}]}>
                    Push Notification
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    notificationSetings(!pushNoti);
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
                    style={{width: 40, height: 20}}
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
            <View style={[styles.iconView2, {height: 35, borderRightWidth: 2}]}>
              <Image
                source={require('../../Assets/Images/security.png')}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.settingstext}>Change Password</Text>
            <View style={{flex: 1, alignItems: 'flex-end', marginRight: 10}}>
              <Ionicons
                name={showChange ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Constants.white}
              />
            </View>
          </TouchableOpacity>

          {showChange && (
            <View style={{padding: 20}}>
              <View style={[styles.fieldView, {position: 'relative'}]}>
                <View
                  style={[styles.iconView2, {height: 35, borderRightWidth: 2}]}>
                  <Image
                    source={require('../../Assets/Images/lock.png')}
                    style={{height: 20, width: 20}}
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
                    setUserDetail({...userDetail, newpassword})
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowPass(!showPass);
                  }}
                  style={[
                    styles.iconView2,
                    {position: 'absolute', right: 0, borderRightWidth: 0},
                  ]}>
                  <Image
                    source={
                      showPass
                        ? require('../../Assets/Images/eye-1.png')
                        : require('../../Assets/Images/eye.png')
                    }
                    style={{height: 18, width: 22}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              {filedCheck.includes('NEWPASSWORD') && (
                <Text style={{color: 'red'}}> New Password is required</Text>
              )}

              <View
                style={[
                  styles.fieldView,
                  {position: 'relative', marginTop: 20},
                ]}>
                <View
                  style={[styles.iconView2, {height: 35, borderRightWidth: 2}]}>
                  <Image
                    source={require('../../Assets/Images/lock.png')}
                    style={{height: 20, width: 20}}
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
                    setUserDetail({...userDetail, confirmpassword})
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowConfirmPass(!showConfirmPass);
                  }}
                  style={[
                    styles.iconView2,
                    {position: 'absolute', right: 0, borderRightWidth: 0},
                  ]}>
                  <Image
                    source={
                      showConfirmPass
                        ? require('../../Assets/Images/eye-1.png')
                        : require('../../Assets/Images/eye.png')
                    }
                    style={{height: 18, width: 22}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              {filedCheck.includes('CONFIRMPASSWORD') && (
                <Text style={{color: 'red'}}>Confirm Password is required</Text>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <TouchableOpacity
                    onPress={() => {
                      changePassword();
                    }}
                    style={[styles.applyBtn, {width: '100%', height: 50}]}>
                    <Text
                      style={[
                        styles.applyBtnTxt,
                        {fontSize: 16, lineHeight: 25},
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
          <View style={[styles.iconView2, {height: 35, borderRightWidth: 2}]}>
            <Image
              source={require('../../Assets/Images/privacy.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.settingstext}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsView}
          onPress={async () => {
            setModalVisible(true);
          }}>
          <View style={[styles.iconView2, {height: 35, borderRightWidth: 2}]}>
            <Image
              source={require('../../Assets/Images/signout.png')}
              style={styles.icon}
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
          <View style={[styles.iconView2, {height: 35, borderRightWidth: 2}]}>
            <Image
              source={require('../../Assets/Images/signout.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.settingstext}>Delete Account</Text>
        </TouchableOpacity>
        <View style={styles.settingsView}>
          <View style={[styles.iconView2, {height: 35, borderRightWidth: 2}]}>
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
            <View style={{backgroundColor: 'white', alignItems: 'center'}}>
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
                    await AsyncStorage.removeItem('userDetail');
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
            <View style={{backgroundColor: 'white', alignItems: 'center'}}>
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
            <View style={{backgroundColor: 'white', alignItems: 'center'}}>
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

export default Settings;
