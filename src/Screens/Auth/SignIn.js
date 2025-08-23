/* eslint-disable prettier/prettier */
/* eslint-disable handle-callback-err */
/* eslint-disable no-sequences */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */

import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  NativeModules,
  Alert,
} from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import Constants from '../../Helpers/constant';
import Styles from './Styles';
import {
  checkForEmptyKeys,
  checkNumber,
  checkEmail,
} from '../../Helpers/InputsNullChecker';
import { Post } from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OneSignal } from 'react-native-onesignal';
import { Context, UserContext } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

const SignIn = props => {
  console.log(props)
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [showPass, setShowPass] = useState(true);
  const [filedCheck, setfiledCheck] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: '',
    password: '',
  });

  const [users, setUsers] = useState();
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      async () => {
        // await AsyncStorage.removeItem('user');
        const u = await AsyncStorage.getItem('user');
        if (u) {
          console.log('JSON.parse(u)========>', JSON.parse(u));
          setUsers(JSON.parse(u));
          setUserDetail({
            ...userDetail,
            email: JSON.parse(u).username,
          });
        } else {
          setUsers(u);
        }
      },
    );
    return () => {
      willFocusSubscription;
    };
  }, []);

  useEffect(() => {
    // console.log('checked', userDetail.email, users);
    if (
      !!users &&
      userDetail.email === users.username &&
      userDetail.password === users.password
    ) {
      console.log('called=======Detai;');
      submit();
    }
  }, [userDetail]);

  const submit = async () => {
    console.log(userDetail);
    let { errorString, anyEmptyInputs } = checkForEmptyKeys(userDetail);
    setfiledCheck(anyEmptyInputs);

    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
    } else {
      const emailcheck = checkEmail(userDetail.email);
      // if (!emailcheck) {
      //   Toaster('Your email id is invalid');
      //   return;
      // }
      const player_id = await OneSignal.User.pushSubscription.getIdAsync()
      const device_token = await OneSignal.User.pushSubscription.getTokenAsync()
      const data = {
        username: userDetail.email.toLowerCase(),
        password: userDetail.password,
        player_id,
        device_token
      };
      setLoading(true);


      Post('loginwithidentity', data, { ...props, setInitial }).then(
        async res => {
          setLoading(false);
          console.log(res);
          if (res.status) {
            // setUser(res.data)
            await AsyncStorage.setItem(
              'userDetail',
              JSON.stringify(res.data),
            );
            await AsyncStorage.setItem(
              'token',
              res.data.token,
            );
            await AsyncStorage.setItem(
              'profilePic',
              res?.data?.profile || '',
            );
            await AsyncStorage.setItem('user', JSON.stringify(data));
            // Toaster(res.message);
            setUserDetail({
              email: '',
              password: '',
            });
            if (res.data.type === 'PROVIDER') {

              console.log('sia--------->fromaaaa', res.data)
              if (res.data.verified==="true") {
                // setInitial('provider');
                // props.navigation.reset('provider', {
                //   screen: 'Home',
                //   params: { screen: 'ServiceProvider' },
                // });

                props.navigation.navigate('provider', {
                  screen: 'Home',
                  params: { screen: 'ServiceProvider' },
                });
                props.navigation.reset('provider')
              } else {
                if (!res.data.identity) {
                  // setInitial('provider');
                  props.navigation.navigate('ProfilePro');
                } else {
                  const isSia = res.data.identity.find(f => f.type === 'SI_BATCH');
                  console.log('sia--------->from', isSia);
                  if (!isSia?._id) {
                    // setInitial('provider');
                    props.navigation.navigate('ProfilePro');
                  } else {
                    props.navigation.navigate('ProfilePro');
                    // props.navigation.navigate('provider', {
                    //   screen: 'Home',
                    //   params: { screen: 'ServiceProvider' },
                    // });
                    // props.navigation.reset('provider')
                  }
                }

              }

            } else {
              // setInitial('user');
              // props.navigation.reset('user')
              props.navigation.navigate('user', {
                screen: 'Home',
                params: { screen: 'HomeUser' },
              });
              props.navigation.reset('user')
            }
            // props.navigation.navigate(
            //   res.data.type === 'PROVIDER'
            //     ? ('provider',
            //       {screen: 'Home', params: {screen: 'ServiceProvider'}})
            //     : ('user', {screen: 'home', params: {screen: 'HomeUser'}}),
            // );

          } else {
            console.log(res.message);
            setToast(res.message);
            // Toaster(res.message);
          }
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
      // Post('loginwithidentity', data, { ...props, setInitial }).then(
      //   async res => {
      //     setLoading(false);
      //     console.log(res);
      //     if (res.status) {
      //       // setUser(res.data)
      //       await AsyncStorage.setItem(
      //         'userDetail',
      //         JSON.stringify(res.data),
      //       );
      //       await AsyncStorage.setItem(
      //         'token',
      //         res.data.token,
      //       );
      //       await AsyncStorage.setItem(
      //         'profilePic',
      //         res?.data?.profile || '',
      //       );
      //       await AsyncStorage.setItem('user', JSON.stringify(data));
      //       // Toaster(res.message);
      //       setUserDetail({
      //         email: '',
      //         password: '',
      //       });
      //       if (res.data.type === 'PROVIDER') {
      //         console.log('sia--------->fromaaaa', res.data.identity)
      //         // if (res.data.verified === 'true') {
      //         //   props.navigation.navigate('provider', {
      //         //     screen: 'Home',
      //         //     params: { screen: 'ServiceProvider' },
      //         //   });
      //         // } else {
      //         if (res.data.identity === undefined || res.data.identity === null && res.data.identity.length === 0) {
      //           props.navigation.navigate('ProfilePro');
      //         } else {
      //           const isSia = res.data.identity.find(f => f.type === 'SI_BATCH');
      //           console.log('sia--------->from', isSia);
      //           if (isSia === undefined) {
      //             props.navigation.navigate('ProfilePro');
      //           } else {
      //             props.navigation.navigate('provider', {
      //               screen: 'Home',
      //               params: { screen: 'ServiceProvider' },
      //             });
      //           }
      //         }

      //         // }

      //       } else {
      //         props.navigation.navigate('user', {
      //           screen: 'Home',
      //           params: { screen: 'HomeUser' },
      //         });
      //       }
      //       // props.navigation.navigate(
      //       //   res.data.type === 'PROVIDER'
      //       //     ? ('provider',
      //       //       {screen: 'Home', params: {screen: 'ServiceProvider'}})
      //       //     : ('user', {screen: 'home', params: {screen: 'HomeUser'}}),
      //       // );
      //       setInitial('user');
      //     } else {
      //       console.log(res.message);
      //       setToast(res.message);
      //       // Toaster(res.message);
      //     }
      //   },
      //   err => {
      //     setLoading(false);
      //     console.log(err);
      //   },
      // );

      // OneSignal.getDeviceState().then(
      //   async d => {
      //     console.log('d==========>', d);
      //     (data.device_token = d.pushToken), (data.player_id = d.userId);
      //     console.log('data==========>', data);

      //     Post('login', data, { ...props, setInitial }).then(
      //       async res => {
      //         setLoading(false);
      //         console.log(res);
      //         if (res.status) {
      //           // setUser(res.data)
      //           await AsyncStorage.setItem(
      //             'userDetail',
      //             JSON.stringify(res.data),
      //           );
      //           await AsyncStorage.setItem(
      //             'token',
      //             res.data.token,
      //           );
      //           await AsyncStorage.setItem(
      //             'profilePic',
      //             res?.data?.profile || '',
      //           );
      //           await AsyncStorage.setItem('user', JSON.stringify(data));
      //           // Toaster(res.message);
      //           setUserDetail({
      //             email: '',
      //             password: '',
      //           });
      //           if (res.data.type === 'PROVIDER') {
      //             console.log('sia--------->fromaaaa', res.data.identity)
      //             // if (res.data.verified === 'true') {
      //             //   props.navigation.navigate('provider', {
      //             //     screen: 'Home',
      //             //     params: { screen: 'ServiceProvider' },
      //             //   });
      //             // } else {
      //             if (res.data.identity === undefined || res.data.identity === null && res.data.identity.length === 0) {
      //               props.navigation.navigate('ProfilePro');
      //             } else {
      //               const isSia = res.data.identity.find(f => f.type === 'SI_BATCH');
      //               console.log('sia--------->from', isSia);
      //               if (isSia === undefined) {
      //                 props.navigation.navigate('ProfilePro');
      //               } else {
      //                 props.navigation.navigate('provider', {
      //                   screen: 'Home',
      //                   params: { screen: 'ServiceProvider' },
      //                 });
      //               }
      //             }

      //             // }

      //           } else {
      //             props.navigation.navigate('user', {
      //               screen: 'Home',
      //               params: { screen: 'HomeUser' },
      //             });
      //           }
      //           // props.navigation.navigate(
      //           //   res.data.type === 'PROVIDER'
      //           //     ? ('provider',
      //           //       {screen: 'Home', params: {screen: 'ServiceProvider'}})
      //           //     : ('user', {screen: 'home', params: {screen: 'HomeUser'}}),
      //           // );
      //           setInitial('user');
      //         } else {
      //           console.log(res.message);
      //           setToast(res.message);
      //           // Toaster(res.message);
      //         }
      //       },
      //       err => {
      //         setLoading(false);
      //         console.log(err);
      //       },
      //     );
      //   },
      //   err => {
      //     setLoading(false);
      //   },
      // );
    }
  };

  const checkSupport = async () => {
    const { biometryType } = await rnBiometrics.isSensorAvailable();
    if (biometryType !== undefined) {
      let key = '';
      rnBiometrics.createKeys().then(resultObject => {
        const { publicKey } = resultObject;
        console.log(publicKey);
        key = publicKey;
      });

      if (users) {
        rnBiometrics
          .createSignature({
            promptMessage: 'Please Provide Touch ID',
            payload: key,
            cancelButtonText: 'Cancel',
          })
          .then(resultObject => {
            const { success, signature } = resultObject;
            console.log(success);
            if (success) {
              setUserDetail({
                ...userDetail,
                password: users.password,
              });
            }
          });
      }
    } else {
      setToast("Your Device dosen't supported this feature");
    }
  };

  return (
    <View style={Styles.container}>
      <Spinner color={'#fff'} visible={loading} />
      <CustomToaster
        color={Constants.black}
        backgroundColor={Constants.white}
        timeout={5000}
        toast={toast}
        setToast={setToast}
      />
      <KeyboardAwareScrollView
        style={Styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
        keyboardVerticalOffset={10}
        keyboardShouldPersistTaps="always">
        <View style={Styles.logoView}>
          <Image
            source={require('../../Assets/Images/logo2.png')}
            style={Styles.logoImg}
          />
        </View>
        <View style={Platform.OS === 'ios' && { paddingLeft: 20 }}>
          <Text style={[Styles.title, { fontSize: 25, marginTop: 10 }]}>
            Enter Your Login Credentials
          </Text>
          {/* <Text style={Styles.title}>Sign in</Text>
          <Text style={Styles.subtitle}>
            Please Enter Your Details Below to start Using the app
          </Text> */}
          <View style={[Styles.fieldView, { marginTop: 40 }]}>
            <View style={Styles.iconView}>
              <Image
                source={require('../../Assets/Images/user.png')}
                style={Styles.icon}
                resizeMode="contain"
              />
            </View>
            <TextInput
              style={Styles.input}
              // placeholder="UserID or Email"
              placeholder="Email"
              placeholderTextColor={Constants.lightgrey}
              value={userDetail.email}
              onChangeText={email => setUserDetail({ ...userDetail, email })}
            />
          </View>
          {filedCheck.includes('EMAIL') && (
            <Text style={{ color: 'red' }}> User name is required</Text>
          )}

          <View style={[Styles.fieldView, { position: 'relative' }]}>
            <View style={Styles.iconView}>
              <Image
                source={require('../../Assets/Images/lock.png')}
                style={Styles.icon}
                resizeMode="contain"
              />
            </View>
            <TextInput
              style={Styles.input}
              placeholder="Password"
              secureTextEntry={showPass}
              placeholderTextColor={Constants.lightgrey}
              value={userDetail.password}
              onChangeText={password =>
                setUserDetail({ ...userDetail, password })
              }
            />
            <TouchableOpacity
              onPress={() => {
                setShowPass(!showPass);
              }}
              style={[Styles.iconView, { borderRightWidth: 0 }]}>
              <Image
                source={
                  showPass
                    ? require('../../Assets/Images/eye-1.png')
                    : require('../../Assets/Images/eye.png')
                }
                style={{ height: 22, width: 25 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            {!!users && userDetail.email === users.username && (
              <TouchableOpacity
                style={{ paddingRight: 20 }}
                onPress={checkSupport}>
                <FontAwesome5
                  name="fingerprint"
                  color={Constants.red}
                  size={25}
                />
              </TouchableOpacity>
            )}
          </View>
          {filedCheck.includes('PASSWORD') && (
            <Text style={{ color: 'red' }}> Password is required</Text>
          )}
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('ForgotPassword');
            }}>
            <Text
              style={[
                Styles.forgot,
                Platform.OS === 'ios' && { marginRight: 20 },
              ]}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* <View
          style={[
            {flexDirection: 'row', marginTop: 30},
            Platform.OS == 'ios' && {paddingHorizontal: 20},
          ]}>
          <View style={{flex: 1}}>
            <Text style={[Styles.title, {fontSize: 25}]}>Sign in</Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <TouchableOpacity onPress={submit}>
              <Image
                source={require('../../Assets/Images/next.png')}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>
        </View> */}

        <View
          style={[
            {
              flex: 1,
              alignItems: 'center',
            },
            Platform.OS === 'ios' && { padding: 20 },
          ]}>
          <TouchableOpacity onPress={submit} style={[Styles.applyBtn]}>
            <Text style={[Styles.applyBtnTxt, { fontSize: 22, lineHeight: 25 }]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>

        {/* <View
          style={[
            {
              flex: 1,
              alignItems: 'center',
            },
            Platform.OS == 'ios' && {padding: 20},
          ]}>
          {/* <TouchableOpacity onPress={checkSupport} style={[Styles.applyBtn]}>
            <Text style={[Styles.applyBtnTxt, {fontSize: 22, lineHeight: 25}]}>
              Finger print
            </Text>
          </TouchableOpacity> */}
        {/* </View> */}

        <View style={Styles.acountBtn}>
          <Text style={Styles.Already}>Don't have an Account ?</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate('Signup')}>
            <Text style={Styles.signin}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
            
    </View>
  );
};

export default SignIn;
