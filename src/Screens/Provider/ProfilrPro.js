/* eslint-disable no-lone-blocks */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  RefreshControl,
  Modal,
  Pressable,
  Button,
} from 'react-native';
import React, { useEffect, useState, createRef, useContext } from 'react';
import styles from './StyleProvider';
import { Avatar } from 'react-native-paper';
import { checkForEmptyKeys, checkEmail } from '../../Helpers/InputsNullChecker';
import { GetApi, Post } from '../../Helpers/Service';
import Spinner from '../../Component/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../Helpers/constant';
import CameraGalleryPeacker from '../../Component/CameraGalleryPeacker';
import RNFetchBlob from 'rn-fetch-blob';
import { Context, ToastContext, UserContext } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CoustomDropdown from '../../Component/CoustomDropdown';
import moment from 'moment';
import { Switch } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { reset } from '../../../navigationRef';
import Icon from 'react-native-vector-icons/MaterialIcons';


const selectionCamera = createRef();
const selectionCameraForId = createRef();

const ProfilrPro = props => {
  const dList = [
    { name: 'Driving Liecense', type: 'DL' },
    { name: 'Passport', type: 'PASSPORT' },
    { name: 'SIA Batch', type: 'SI_BATCH' },
    // {name: 'Bank Account Detail', type: 'bank_account'},
  ];
  const [user, setUser] = useContext(UserContext);
  const payrolltype = [
    { name: 'Weekly', type: 'Weekly' },
    { name: 'Monthly', type: 'Monthly' },
    // {name: 'Bank Account Detail', type: 'bank_account'},
  ];
  const [modalVisible, setModalVisible] = useState(false);
  const [toast, setToast] = useContext(ToastContext);
  const [initial, setInitial] = useContext(Context);
  const [filedCheck, setfiledCheck] = useState([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: '',
    fullname: '',
    // identity: [],
    address: '',
    phone: '',
  });
  const [bankDetail, setbankDetail] = useState({
    bank_name: '',
    name: '',
    code: '',
    account: '',
  });
  const [profile, setprofile] = useState({});
  const [idProof, setIdProof] = useState({
    title: 'Select ID Type',
    type: '',
  });
  const [dropList, setDropList] = useState(dList);
  const [submitted, setSubmitted] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [datepeack, setDate] = useState(new Date());
  const [siaExpDate, setSiaExpDate] = useState('DD/MM/YYYY');
  const [showDrop, setShowrop] = useState(false);
  const [showpayroll, setShowPayroll] = useState(false);
  const [payroll, setPayrolls] = useState('Weekly');
  const [verified, setVerified] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = React.useState(true);
  console.log(props)
  useEffect(() => {
    let isSia = user?.identity?.find(f => f.type === 'SI_BATCH');
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <>
            {!edit && (
              <TouchableOpacity
                style={styles.editprofilebtnView}
                onPress={() => {
                  setEdit(true);
                }}>
                <Text style={styles.editprofilebtnText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </>
        );
      },
      headerTitle: () => {
        return (
          <Text style={styles.headerTitle}>
            {edit ? 'Edit Profile' : 'Profile'}
          </Text>
        );
      },
      headerLeft: () => {
        return (
          <TouchableOpacity onPress={() => {
            if (verified === 'false') {
              setToast('Please contact with support'); 
            }
            else if (isSia !== undefined) {
              reset('provider')
            } else {
              setToast('Please add your SIA Badge and get access full app');
            }
          }}>
            <Image source={require('../../Assets/Images/back.png')} style={{ height: 18, width: 24, marginRight: 10 }} />
          </TouchableOpacity>
        );
      },
    });
  }, [edit, user]);

  useEffect(() => {
    getProfile();
  }, []);

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const getDropValue = (title, type) => {
    // setJobInfo({...jobInfo, title});
    if (title) {
      setIdProof({ title, type });
      // if (idProof.type === '') {
      //   setSubmitted(true);
      //   return;
      // }
      // if (type === 'SI_BATCH' && siaExpDate === 'DD/MM/YYYY') {
      //   setSubmitted(true);
      // } else {
      //   setSiaExpDate('DD/MM/YYYY');
      //   setSubmitted(false);
      //   selectionCameraForId.current?.show();
      // }
    }
    setShowrop(false);
  };

  const onRefresh = React.useCallback(() => {
    console.log('called===========>');
    setRefreshing(true);
    getProfile(true);
    // wait(1000).then(() => setRefreshing(false));
  }, []);

  const getPayrolTypepValue = (title, type) => {
    // setJobInfo({...jobInfo, title});
    setPayrolls(title);
    setShowPayroll(false);
    setIsEdit(true)
  };

  const timeselect = (date) => {
    console.log(date);

    setSiaExpDate(date);
    // setDate(date);
    setOpenTime(false);
    // setSubmitted(false);
    // selectionCameraForId.current?.show();
  };

  // const editsave = () => {
  //   if (edit) {
  //     submit();
  //   } else {
  //     setEdit(true);
  //   }
  // };

  const submit = () => {

    // if (!isEdit) {
    //   setEdit(false);
    //   setSiaExpDate('DD/MM/YYYY')
    //   return;
    // }
    // console.log(userDetail);
    let { anyEmptyInputs, errorString } = checkForEmptyKeys(userDetail);
    setfiledCheck(anyEmptyInputs);
    console.log(anyEmptyInputs);
    console.log(errorString);
    if (checkValidation()) {
      setSubmitted(true);
      return;
    }
    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
      setToast('Add missing information');
    } else {
      const emailcheck = checkEmail(userDetail.email);
      if (!emailcheck) {
        setToast('Your email id is invalid');
        return;
      }

      //  if (idProof.type === '') {
      //   setSubmitted(true);
      //   return;
      // }

      const isSia = profile?.identity.find(f => f.type === 'SI_BATCH');
      if (isSia === undefined) {
        // setSubmitted(true);
        setToast('Please add your SIA Badge and get access full app');
        return;
      }

      if (idProof.type !== '') {
        let ss = profile?.identity.find(f => f.type === idProof.type);
        if (idProof.type === 'SI_BATCH') {
          if (isSia === undefined) {
            // setSubmitted(true);
            setToast('Please add your SIA Badge and get access full app');
            return;
          }
        }
      }

      let data = {
        email: userDetail.email.toLowerCase(),
        fullName: userDetail.fullname,
        address: userDetail.address,
        profile: image,
        phone: userDetail.phone,
        payroll: {
          type: profile?.payroll?.type || payroll,
          selected: payroll,
          // verified: payroll === profile?.payroll?.type,
        },
        bankDetails: bankDetail,
      };


      if (data.payroll.type !== data.payroll.selected) {
        data.payroll.verified = false;
        if (profile.payroll.verified) {
          data.updated = true;
        }
      } else {
        data.payroll.verified = true;
      }
      // console.log('data==========>', data);
      // return;
      setLoading(true);
      Post('profile/update', data, { ...props, setInitial }).then(
        async res => {
          setLoading(false);
          if (res.status) {
            setToast(res.data.message);
            setTimeout(() => {
              getProfile();
              setIsEdit(false)
            }, 200);
            setEdit(false);
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

  const getProfile = (type) => {
    setLoading(true);
    GetApi('me', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        setRefreshing(false);
        // console.log('Security Guard Profile:', res.data);
        // console.log(res.data.identity);
        if (res.status) {
if (res.data.verified==='false') {
  setModalVisible(true)
}
          setprofile(res?.data || {});
          await AsyncStorage.setItem('profilePic', res?.data?.profile || '');
          console.log('isVerify User ====>', res.data.verified);

          setUser(res.data);
          if (!type) {
            if (!res.data.identity) {
              const isSia = res.data.identity.find(f => f.type === 'SI_BATCH')
              setEdit(!isSia);
            } else {
              const isSia = res.data.identity.find(f => f.type === 'SI_BATCH');
              console.log('sia--------->', isSia);
              if (!isSia?._id) {
                setEdit(res.data.verified !== 'true');
              }
            }
            setImage(res?.data?.profile || '');
            setUserDetail({
              email: res.data.email,
              fullname: res?.data?.fullName || '',
              username: res.data.username,
              address: res.data.address || '',
              phone: res.data.phone || '',
            });
            { res.data.bankDetails && setbankDetail(res.data.bankDetails); }

            if (res.data.payroll) {
              setPayrolls(res.data.payroll.type);
            }
            setVerified(res.data.verified);
          }

        } else {
          setRefreshing(false);
          setToast(res.message);
        }
      },
      err => {
        setRefreshing(false);
        setLoading(false);
        console.log(err);
      },
    );
  };

  const getImageValue = img => {
    console.log(img);
    setImage(`data:${img.mime};base64,${img.data}`);
  };

  const getImageValue2 = img => {
    console.log('getImageValue2======>', img);
    // setImage(`data:${image.mime};base64,${image.data}`);
    uploadFile(img);
  };

  const uploadFile = async img => {
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
          name: 'type',
          data: idProof.type,
        },
      ];
      if (idProof.type === 'SI_BATCH') {
        d.push({
          name: 'expire',
          data: siaExpDate.toString(),
          // data: moment(siaExpDate).format('DD/MM/yyyy').toString(),
        });
      }
      console.log('data=>', d);
      // setLoading(true);
      RNFetchBlob.fetch(
        'POST',
        `${Constants.baseUrl}profile/file`,
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
            getProfile(true);
            setIsEdit(true)
          } else {
            setToast('Something went wrong please try again');
          }
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };


  const checkValidation = () => {
    const sia = profile?.identity?.find(f => f.type === 'SI_BATCH');
    if (!sia && (idProof.type === '' || idProof.type === 'SI_BATCH')) {
      return true;
    }

    return false;
  };

  const idUploadSection = () => (
    <View
      style={{
        borderColor: checkValidation() && submitted ? Constants.white : Constants.grey,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
      }}>
      <View style={[styles.pushNotiView, { alignItems: 'center' }]}>
        <View style={{ flex: 2 }}>
          <TouchableOpacity
            onPress={() => setShowrop(true)}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ alignContent: 'center', paddingVertical: 10 }}>
              <Text
                style={[
                  // styles.jobname,
                  styles.settingstext,
                  { color: Constants.red },
                  idProof.type === '' && { color: Constants.grey },
                ]}>
                {idProof.title}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                marginLeft: 10,
              }}
              onPress={() => setShowrop(true)}>
              <Ionicons
                name="chevron-down-outline"
                color={Constants.red}
                size={20}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          <CoustomDropdown
            visible={showDrop}
            setVisible={setShowrop}
            getDropValue={getDropValue}
            data={dropList}
            title="Select File"
            name="Upload"
          />
          {/* <Text style={[styles.settingstext, {color: Constants.red}]}>
            Driving Licence
          </Text> */}
        </View>

        <TouchableOpacity
          style={[
            styles.applyBtn1,
            { flex: 1, flexDirection: 'row', backgroundColor: Constants.red },
          ]}
          onPress={() => {
            if (idProof.type === '') {
              setSubmitted(true);
              return;
            }
            if (idProof.type === 'SI_BATCH' && siaExpDate === 'DD/MM/YYYY') {
              setSubmitted(true);
              return;
            }
            setSubmitted(false);
            selectionCameraForId.current?.show();
          }}>
          <Image
            source={require('../../Assets/Images/upload.png')}
            resizeMode="contain"
            style={{ height: 18, width: 18, marginRight: 10 }}
          />
          <Text style={styles.applyBtnTxt}>Upload</Text>
        </TouchableOpacity>
      </View>
      {idProof.type === 'SI_BATCH' && (
        <View style={[styles.pushNotiView, { alignItems: 'center' }]}>
          <View style={{ flex: 2 }}>
            <Text style={[styles.settingstext, { color: Constants.red }]}>
              SIA Batch Exp.Date -
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              borderBottomColor: Constants.grey,
              borderBottomWidth: 1,
              paddingBottom: 5,
            }}>
            <Text
              style={[
                { color: Constants.white },
                siaExpDate === 'DD/MM/YYYY' && { color: Constants.grey },
              ]}
              onPress={() => {
                setOpenTime(true);
              }}>
              {siaExpDate === 'DD/MM/YYYY'
                ? siaExpDate
                : moment(siaExpDate).format('DD/MM/yyyy')}
            </Text>
          </View>
        </View>
      )}

    </View>
  );

  const gettitle = type => {
    console.log(type);
    const title = dropList.find(t => t.type === type);
    if (title !== undefined) {
      return title.name;
    }
  };

  const idproofList = () => (
    <View
      style={{
        flex: 1,
        // borderColor:
        //   !!profile.identity && profile?.identity.length > 0
        //     ? Constants.grey
        //     : Constants.black,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
      }}>
      {!!profile.identity &&
        profile.identity.map((item, i) => (
          <View key={item._id} style={{ flex: 1, flexDirection: 'column', gap: 2 }}>
            {item.type !== undefined && (
              <View
                style={[
                  styles.pushNotiView,
                  {
                    alignItems: 'center',
                    flex: 1,
                    flexDirection: 'column',
                  },
                  // i !== profile.identity.length - 1 && {
                  //   borderBottomColor: Constants.grey,
                  //   borderBottomWidth: 1,
                  //   paddingBottom: 20,

                  // },
                ]}>
                <TouchableOpacity style={{ alignItems: 'flex-end' }}>
                  <Image
                    // source={require('../../Assets/Images/idproofs.jpg')}
                    source={{ uri: item.image }}
                    resizeMode="cover"
                    style={{ height: 80, width: 100, borderRadius: 5 }}
                  />
                </TouchableOpacity>
                <View style={{ marginTop: 5, flex: 1 }}>
                  <Text style={[styles.settingstext, { fontSize: 12, textAlign: 'center', flex: 1 }]}>
                    {/* {item.type} */}
                    {gettitle(item.type)}
                  </Text>
                  {item.type === 'SI_BATCH' && (
                    <Text style={[styles.settingstext, { fontSize: 12, textAlign: 'center', flex: 1, width: 100 }]}>
                      Exp.Date -{' '}
                      <Text style={{ color: Constants.white, fontSize: 12 }}>
                        {moment(item.expire).format('DD MMM, yyyy')}
                      </Text>
                    </Text>
                  )}
                </View>


              </View>
            )}
          </View>
        ))}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: 40 }]}>
      <Spinner color={'#fff'} visible={loading} />
      {/* <CustomToaster
        color={Constants.black}
        backgroundColor={Constants.white}
        timeout={5000}
        toast={toast}
        setToast={setToast}
      /> */}
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
        keyboardVerticalOffset={10}
        keyboardShouldPersistTaps="always">
        <ScrollView keyboardShouldPersistTaps="always" style={Platform.OS === 'ios' && { paddingHorizontal: 20 }}

        >
          <View style={styles.avtarView}>
            <View style={{ height: 100, width: 100, position: 'relative' }}>
              <Avatar.Image
                size={100}
                source={
                  image !== ''
                    ? { uri: image }
                    : require('../../Assets/Images/images.png')
                }
              />
              {edit && (
                <TouchableOpacity
                  style={{ bottom: 0, position: 'absolute', right: 0 }}
                  onPress={() => {
                    selectionCamera.current?.show();
                  }}>
                  <Avatar.Icon
                    size={30}
                    icon="camera"
                    color={Constants.red}
                    style={{
                      backgroundColor: Constants.lightgrey,
                    }}
                  />
                </TouchableOpacity>
              )}
              {!edit && verified === 'true' && (
                <View style={{ bottom: 0, position: 'absolute', right: 0 }}>
                  <Image
                    source={require('../../Assets/Images/greenstick.png')}
                    resizeMode="contain"
                    style={{ height: 30, width: 30 }}
                  />
                </View>
              )}
            </View>
          </View>

          <View style={{ marginTop: 30 }}>
            <View
              style={[
                styles.profileInputView,
                { justifyContent: 'space-between' },
              ]}>
              <Text style={styles.inputLabel}>I'm available for Work</Text>
              <View style={{ marginLeft: 5 }}>
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
                    trackColor={{ true: Constants.green, false: Constants.red }}
                    value={isSwitchOn}
                    onValueChange={onToggleSwitch}
                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }], borderCurve: 'circular' }}
                    thumbColor={Constants.black}
                  />
                </View>
              </View>
            </View>
            <View style={[styles.profileInputView, { borderColor: (filedCheck.includes('FULLNAME') && userDetail.fullname === '') ? Constants.white : Constants.grey }]}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.profileInput}
                value={userDetail.fullname}
                onChangeText={fullname => {
                  setUserDetail({ ...userDetail, fullname });
                  setIsEdit(true)
                }}
                editable={edit}
              />
            </View>
            {filedCheck.includes('FULLNAME') && userDetail.fullname === '' && (
              <Text style={{ color: 'white', fontStyle: 'italic' }}> Full name is required</Text>
            )}
            <View style={styles.profileInputView}>
              <Text style={styles.inputLabel}> Username</Text>
              <TextInput
                style={styles.profileInput}
                value={userDetail.username}
                onChangeText={username => {
                  setUserDetail({ ...userDetail, username });
                  setIsEdit(true)
                }}
                editable={false}
              />
            </View>
            {filedCheck.includes('USERNAME') && (
              <Text style={{ color: 'white', fontStyle: 'italic' }}> Full name is required</Text>
            )}
            <View style={[styles.profileInputView, { borderColor: (filedCheck.includes('EMAIL') && userDetail.email === '') ? Constants.white : Constants.grey }]}>

              <Text style={styles.inputLabel}>Email ID</Text>
              <TextInput
                style={styles.profileInput}
                value={userDetail.email}
                onChangeText={email => {
                  setUserDetail({ ...userDetail, email });
                  setIsEdit(true)
                }}
                editable={edit}
              />
            </View>
            {filedCheck.includes('EMAIL') && userDetail.email === '' && (
              <Text style={{ color: 'white', fontStyle: 'italic' }}> Email is required</Text>
            )}
            <View style={[styles.profileInputView, { borderColor: (filedCheck.includes('PHONE') && userDetail.phone === '') ? Constants.white : Constants.grey }]}>

              <Text style={styles.inputLabel}>Phone Number</Text>
              {!filedCheck.includes('PHONE') && (
                <TextInput
                  textAlignVertical="top"
                  style={[styles.profileInput2]}
                  value={userDetail.phone}
                  onChangeText={phone => {
                    setUserDetail({ ...userDetail, phone });
                    setIsEdit(true)
                  }}
                  editable={edit}
                  returnKeyType={'default'}
                  blurOnSubmit={true}
                />
              )}

            </View>
            {filedCheck.includes('PHONE') && userDetail.phone === '' && (
              <Text
                style={{ color: 'white', fontStyle: 'italic' }}
                onPress={() => {
                  setfiledCheck([]);
                }}>
                {' '}
                Phone is Required
              </Text>
            )}
            <View style={[styles.profileInputView, { borderColor: (filedCheck.includes('ADDRESS') && userDetail.address === '') ? Constants.white : Constants.grey }]}>

              <Text style={styles.inputLabel}>Address</Text>
              {/* {!filedCheck.includes('ADDRESS') && ( */}
              <TextInput
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                style={[styles.profileInput2]}
                value={userDetail.address}
                onChangeText={address => {
                  setUserDetail({ ...userDetail, address });
                  setIsEdit(true)
                }}
                editable={edit}
                returnKeyType={'default'}
                blurOnSubmit={true}
              />
              {/* )} */}

            </View>
            {filedCheck.includes('ADDRESS') && userDetail.address === '' && (
              <Text
                style={{ color: 'white', fontStyle: 'italic' }}
                onPress={() => {

                  setfiledCheck([]);
                }}>
                {' '}
                Address is required
              </Text>
            )}
            <View style={[styles.profileInputView, { justifyContent: 'space-between' }]}>
              <Text style={styles.inputLabel}>Payroll Type</Text>
              {/* <View style={styles.filterView}> */}
              <TouchableOpacity
                disabled={!edit}
                style={{ marginLeft: 10, flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                onPress={() => setShowPayroll(true)}>
                <View>
                  <Text style={styles.profileInput2}>{payroll}</Text>
                </View>
                {edit && <View style={{ marginLeft: 10 }}>
                  <Ionicons
                    name="chevron-down-outline"
                    color={Constants.red}
                    size={25}
                  />
                </View>}
              </TouchableOpacity>

              <CoustomDropdown
                visible={showpayroll}
                setVisible={setShowPayroll}
                getDropValue={getPayrolTypepValue}
                data={payrolltype}
                title="Select Payroll"
              />
              {/* </View> */}
            </View>
            {/* {filedCheck.includes('ADDRESS') && (
            <Text style={{color: 'red'}}> Address is required</Text>
          )} */}
            {edit && idUploadSection()}
            {checkValidation() && submitted && (
              <Text style={{ color: 'white', fontStyle: 'italic' }}>
                SIA Batch is mandatory please upload
              </Text>
            )}
            {idProof.type === 'SI_BATCH' &&
              siaExpDate === 'DD/MM/YYYY' &&
              submitted && (
                <Text style={{ color: 'white', fontStyle: 'italic' }}>
                  Please add SIA Batch expiry date.
                </Text>
              )}
            {idproofList()}

            <Text style={[{ color: 'red', fontSize: 20, marginLeft: 10 }, edit && { marginTop: 20 }]}>Bank Details</Text>
            <View style={styles.profileInputView}>
              <Text style={styles.inputLabel}>Bank Name</Text>
              <TextInput
                style={styles.profileInput}
                value={bankDetail.bank_name}
                onChangeText={bank_name => {
                  setbankDetail({ ...bankDetail, bank_name });
                  setIsEdit(true)
                }}
                editable={edit}
              />
            </View>
            <View style={[styles.profileInputView, { flexDirection: 'column' }]}>
              <Text style={styles.inputLabel}>Account holder name</Text>
              <TextInput
                style={styles.profileInput}
                value={bankDetail.name}
                onChangeText={name => {
                  setbankDetail({ ...bankDetail, name });
                  setIsEdit(true)
                }}
                editable={edit}
              />
            </View>
            <View style={styles.profileInputView}>
              <Text style={styles.inputLabel}>Sort code</Text>
              <TextInput
                style={styles.profileInput}
                value={bankDetail.code}
                keyboardType="numeric"
                onChangeText={code => {
                  setbankDetail({ ...bankDetail, code });
                  setIsEdit(true)
                }}
                editable={edit}
              />
            </View>
            <View style={[styles.profileInputView, { flexDirection: 'column' }]}>
              <Text style={styles.inputLabel}>Account number</Text>
              <TextInput
                style={styles.profileInput}
                value={bankDetail.account}
                keyboardType="numeric"
                onChangeText={account => {
                  setbankDetail({ ...bankDetail, account });
                  setIsEdit(true)
                }}
                editable={edit}
              />
            </View>

            {edit && (
              <View
                style={{
                  marginTop: 10,
                  marginRight: 0,
                }}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity style={styles.jobUpdatbtn} onPress={submit} >
                    <Text style={styles.jobUpdatBtnTxt}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* <CameraGalleryPeacker
          refs={selectionCamera}
          backgroundColor={Constants.grey}
          titleColor={Constants.white}
          headerColor={Constants.red}
          cancelButtonColor={Constants.red}
          crop={true}
          getImageValue={getImageValue}
          height={100}
          width={100}
          quality={0.5}
          base64={true}
          useFrontCamera={true}
        />

        <CameraGalleryPeacker
          refs={selectionCameraForId}
          backgroundColor={Constants.grey}
          titleColor={Constants.white}
          headerColor={Constants.red}
          cancelButtonColor={Constants.red}
          crop={false}
          getImageValue={getImageValue2}
          height={200}
          width={Dimensions.get('window').width - 40}
          quality={0.8}
          base64={false}
        /> */}

          <CameraGalleryPeacker
            refs={selectionCamera}
            backgroundColor={Constants.grey}
            titleColor={Constants.white}
            headerColor={Constants.red}
            cancelButtonColor={Constants.red}
            crop={true}
            getImageValue={getImageValue}
            height={100}
            width={100}
            quality={0.5}
            base64={true}
          />
          <CameraGalleryPeacker
            refs={selectionCameraForId}
            backgroundColor={Constants.grey}
            titleColor={Constants.white}
            headerColor={Constants.red}
            cancelButtonColor={Constants.red}
            crop={false}
            getImageValue={getImageValue2}
            height={200}
            width={Dimensions.get('window').width - 40}
            quality={0.5}
            base64={false}
          />
        </ScrollView>

        <Modal
          animationType="fade" // or "slide"
          transparent={true}
          visible={openTime}
          onRequestClose={() => setOpenTime(false)} // For Android back button
        >
          <Pressable style={styles.centeredView} onPress={() => setOpenTime(false)}>
            {/* <View style={styles.modalView} onStartShouldSetResponder={() => true}> */}

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
            {/* <DateTimePeacker
        open={openTime}
        datepeack={datepeack}
        mode={'date'}
        timeselect={timeselect}
        setOpenTime={setOpenTime}
      /> */}
            {Platform.OS === 'ios' && (
              <Button title="Done" onPress={() => setOpenTime(false)} />
            )}
            {/* </View> */}
          </Pressable>
        </Modal>
        <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{backgroundColor: 'white', alignItems: 'center'}}>
              <View style={[styles.covline,{width:'100%'}]}>
                <View></View>
                <Text style={styles.textStyle5}>Account Suspended </Text>
                <TouchableOpacity style={styles.croscov} onPress={()=>setModalVisible(false)}>
                  <Icon name="close" size={30} color="#ff0101ff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.textStyle4}>Your account has been suspended. Please contact our support team for assistance.</Text>
              
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setModalVisible(!modalVisible);
                  }}
                  style={styles.logOutButtonStyle2}>
                  <Text style={styles.modalText}>okay</Text>
                </TouchableOpacity>
              
            </View>
          </View>
        </View>
      </Modal>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ProfilrPro;
