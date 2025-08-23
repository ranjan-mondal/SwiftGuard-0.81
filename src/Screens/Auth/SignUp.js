/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import React, { useState, useContext } from 'react';
import Constants from '../../Helpers/constant';
import Styles from './Styles';
import { RadioButton } from 'react-native-paper';
import {
  checkForEmptyKeys,
  checkNumber,
  checkEmail,
} from '../../Helpers/InputsNullChecker';
import { Post } from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Checkbox, ActivityIndicator } from 'react-native-paper';



const SignUp = props => {
  const [toast, setToast] = useState('');
  const [organization, setOrganization] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [showPass, setShowPass] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [org, setOrg] = useState(true);
  const [type, setType] = useState('User');
  const [loading, setLoading] = useState(false);
  const [filedCheck, setfiledCheck] = useState([]);

  const [userDetail, setUserDetail] = useState({
    email: '',
    password: '',
    type: 'USER',
    username: '',
    fullName: '',
    phone: '',
    status: false,
  });

  const submit = () => {

    let { errorString, anyEmptyInputs } = checkForEmptyKeys(userDetail);
    setfiledCheck(anyEmptyInputs);
    setSubmitted(true);

    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
    } else {
      const emailcheck = checkEmail(userDetail.email);
      if (!emailcheck) {
        setToast('Your email id is invalid');
        return;
      }

      if (!checkNumber(userDetail.phone) || userDetail.phone.length !== 10) {
        setToast('Phone number must be a 10-digit number');
        return;
      }
      if (!userDetail.status) {
        setToast('Please accept our Terms and Condition');
        return;
      }
      // if (org && organization === '') {
      //   setSubmitted(true);
      //   return;
      // }

      const data = {
        password: userDetail.password,
        email: userDetail.email.toLowerCase(),
        username: userDetail.username,
        phone: userDetail.phone,
      };

      if (userDetail.type === 'USER') {
        if (org) {
          data.isOrganization = org;
          data.organization = userDetail.fullName;
        } else {
          data.type = userDetail.type;
          data.fullName = userDetail.fullName;
        }
      } else {
        data.type = userDetail.type;
        data.fullName = userDetail.fullName;
      }

      if (userDetail?.lastname !== undefined) {
        data.fullName = userDetail.fullName + ' ' + userDetail?.lastname;
      } else {
        if (
          userDetail.type === 'PROVIDER' &&
          (userDetail?.lastname === undefined || userDetail?.lastname === '')
        ) {
          return;
        }
      }

      console.log('data==========>', data);
      setLoading(true);
      Post('signUp', data, { ...props, setInitial }).then(
        async res => {
          setLoading(false);
          console.log(res);
          if (res.status) {
            setUserDetail({
              email: '',
              password: '',
              type: 'USER',
              username: '',
              fullName: '',
              phone: '',
            });
            props.navigation.navigate('Signin');
          } else {
            console.log('error------>', res);
            if (res.data.message !== undefined) {
              setToast(res.data.message);
            }
          }
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
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
          <Text style={Styles.title}>Sign Up</Text>
          <Text style={Styles.subtitle}>
            Please Enter Your Details Below to start Using the app
          </Text>

          <View style={Styles.fieldView}>
            <View style={Styles.iconView}>
              <Image
                source={require('../../Assets/Images/hand.png')}
                resizeMode="contain"
                style={Styles.icon}
              />
            </View>

            <RadioButton.Group
              onValueChange={type => {
                setUserDetail({ ...userDetail, type });
                if (type === 'PROVIDER') {
                  setOrg(false);
                }
              }}
              value={userDetail.type}>
              <View style={Styles.radioView}>
                <RadioButton.Item
                  mode="android"
                  label="Job Provider" //Organization
                  value="USER"
                  position="leading"
                  color={Constants.red}
                  uncheckedColor={Constants.lightgrey}
                  labelStyle={{
                    color:
                      userDetail.type === 'USER'
                        ? Constants.red
                        : Constants.lightgrey,
                    fontSize: 14,
                  }}
                // labelVariant="displayLarge"
                />
                <RadioButton.Item
                  mode="android"
                  style={{ fontSize: 12 }}
                  label="Security Guard" //Individual
                  value="PROVIDER"
                  position="leading"
                  color={Constants.red}
                  uncheckedColor={Constants.lightgrey}
                  labelStyle={{
                    color:
                      userDetail.type === 'PROVIDER'
                        ? Constants.red
                        : Constants.lightgrey,
                    fontSize: 14,
                  }}
                // labelVariant="displayLarge"
                />
              </View>
            </RadioButton.Group>
          </View>

          {userDetail.type === 'USER' && (
            <View>
              <View style={Styles.fieldView}>
                <View style={Styles.iconView}>
                  <Image
                    source={require('../../Assets/Images/hand.png')}
                    // style={{width: 22, height: 20}}
                    resizeMode="contain"
                    style={Styles.icon}
                  />
                </View>

                <RadioButton.Group
                  onValueChange={type => setOrg(type)}
                  value={org}>
                  <View style={Styles.radioView}>
                    <RadioButton.Item
                      mode="android"
                      label="Organisation"
                      value={true}
                      position="leading"
                      color={Constants.red}
                      uncheckedColor={Constants.lightgrey}
                      labelStyle={{
                        color: org ? Constants.red : Constants.lightgrey,
                        fontSize: 14,
                      }}
                    // labelVariant="displayLarge"
                    />
                    <RadioButton.Item
                      mode="android"
                      label="Individual"
                      value={false}
                      position="leading"
                      color={Constants.red}
                      uncheckedColor={Constants.lightgrey}
                      labelStyle={{
                        color: !org ? Constants.red : Constants.lightgrey,
                        fontSize: 14,
                      }}
                    // labelVariant="displayLarge"
                    />
                  </View>
                </RadioButton.Group>
              </View>
              {filedCheck.includes('TYPE') && (
                <Text style={{ color: 'red' }}> User type is required</Text>
              )}
            </View>
          )}

          <View style={Styles.fieldView}>
            <View style={Styles.iconView}>
              <Image
                source={require('../../Assets/Images/user.png')}
                style={Styles.icon}
                resizeMode="contain"
              />
            </View>
            <TextInput
              style={Styles.input}
              placeholder={
                userDetail.type === 'PROVIDER'
                  ? 'First Name'
                  : org
                    ? 'Organization Name'
                    : 'Full Name'
              }
              placeholderTextColor={Constants.lightgrey}
              value={userDetail.fullName}
              onChangeText={fullName =>
                setUserDetail({ ...userDetail, fullName })
              }
            />
          </View>
          {filedCheck.includes('FULLNAME') && (
            <Text style={{ color: 'red' }}>
              {' '}
              {org ? 'Organization Name' : 'Name'} is required
            </Text>
          )}

          {userDetail.type === 'PROVIDER' && (
            <View style={Styles.fieldView}>
              <View style={Styles.iconView}>
                <Image
                  source={require('../../Assets/Images/user.png')}
                  style={Styles.icon}
                  resizeMode="contain"
                />
              </View>
              <TextInput
                style={Styles.input}
                placeholder="Last Name"
                placeholderTextColor={Constants.lightgrey}
                value={userDetail?.lastname || ''}
                onChangeText={lastname =>
                  setUserDetail({ ...userDetail, lastname })
                }
              />
            </View>
          )}
          {userDetail?.lastname === undefined &&
            submitted &&
            userDetail.type === 'PROVIDER' && (
              <Text style={{ color: 'red' }}> Last Name is required</Text>
            )}

          <View>
            <View style={Styles.fieldView}>
              <View style={Styles.iconView}>
                <Image
                  source={require('../../Assets/Images/user.png')}
                  style={Styles.icon}
                  resizeMode="contain"
                />
              </View>
              <TextInput
                style={Styles.input}
                placeholder="User Name"
                placeholderTextColor={Constants.lightgrey}
                value={userDetail.username}
                onChangeText={username =>
                  setUserDetail({ ...userDetail, username })
                }
              />
            </View>
            {filedCheck.includes('USERNAME') && (
              <Text style={{ color: 'red' }}> User name is required</Text>
            )}
          </View>

          <View style={Styles.fieldView}>
            <View style={Styles.iconView}>
              <Image
                source={require('../../Assets/Images/Email.png')}
                style={Styles.icon}
                resizeMode="contain"
              />
            </View>
            <TextInput
              style={Styles.input}
              placeholder={org ? 'Organization Email' : 'Email'}
              placeholderTextColor={Constants.lightgrey}
              value={userDetail.email}
              onChangeText={email => setUserDetail({ ...userDetail, email })}
            />
          </View>
          {filedCheck.includes('EMAIL') && (
            <Text style={{ color: 'red' }}>
              {' '}
              {org ? 'Organization Email' : 'Email'} is required
            </Text>
          )}

          <View style={Styles.fieldView}>
            <View style={Styles.iconView}>
              <Image
                source={require('../../Assets/Images/phone.png')}
                style={Styles.icon}
                resizeMode="contain"
              />
            </View>
            <TextInput
              style={Styles.input}
              placeholder="Phone Number"
              placeholderTextColor={Constants.lightgrey}
              value={userDetail.phone}
              onChangeText={phone => setUserDetail({ ...userDetail, phone })}
            />
          </View>

          {filedCheck.includes('PHONE') && (
            <Text style={{ color: 'red' }}>
              {' '}
              Phone number is required
            </Text>
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
              style={[
                Styles.iconView,
                { position: 'absolute', right: 0, borderRightWidth: 0 },
              ]}>
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
          </View>
          {filedCheck.includes('PASSWORD') && (
            <Text style={{ color: 'red' }}> Password is required</Text>
          )}



          {/* {org && (
            <View>
              <View style={Styles.fieldView}>
                <View style={Styles.iconView}>
                  <Image
                    source={require('../../Assets/Images/Email.png')}
                    style={Styles.icon}
                    resizeMode="contain"
                  />
                </View>
                <TextInput
                  style={Styles.input}
                  placeholder="Organization Name"
                  placeholderTextColor={Constants.lightgrey}
                  value={organization}
                  onChangeText={text => setOrganization(text)}
                />
              </View>
              {submitted && organization === '' && (
                <Text style={{color: 'red'}}> Organization is required</Text>
              )}
            </View>
          )} */}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: 10,
            marginLeft: 12,
          }}>
          <Checkbox.Android
            label="item"
            uncheckedColor={Constants.blue}
            status={userDetail.status ? 'checked' : 'unchecked'}
            style={{ borderColor: Constants.blue, borderWidth: 1 }}
            onPress={() => {
              setUserDetail({
                ...userDetail,
                status: !userDetail.status,
              });
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',

              marginLeft: 10,
            }}>
            <Text
              style={{
                color: Constants.white,
                flexWrap: 'wrap',
                fontSize: 14,
                margin: 0,
              }}>
              I agree to the{' '}
              {/* <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}> */}
              <Text
                onPress={() => props.navigation.navigate('terms')}
                style={{
                  color: Constants.red,
                  fontSize: 14,
                }}>
                Terms of Condition
              </Text>

              {/* and 
              <Text style={{ color: Constants.red, fontSize: 14 }} onPress={() => Linking.openURL('https://admin.sadanamkayyilundo.in/privacy-policy')}>
                Privacy Policy
              </Text> */}

            </Text>
          </View>
        </View>
        <View
          style={[
            { flexDirection: 'row', marginTop: 25 },
            Platform.OS === 'ios' && { paddingHorizontal: 20 },
          ]}>
          <View style={{ flex: 1 }}>
            <Text style={[Styles.title, { fontSize: 25 }]}>Register</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={submit}>
              <Image
                source={require('../../Assets/Images/next.png')}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={Styles.acountBtn}>
          <Text style={Styles.Already}>Already have an account ?</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate('Signin')}>
            <Text style={Styles.signin}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default SignUp;
