/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Pressable,
  Button,
  Platform
} from 'react-native';
import React, { useEffect, useState, createRef, useContext } from 'react';
import styles from './StylesUser';
import { Avatar } from 'react-native-paper';
import {
  checkForEmptyKeys,
  checkNumber,
  checkEmail,
} from '../../Helpers/InputsNullChecker';
import { GetApi, Post, PostMultipart } from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../Helpers/constant';
import CameraGalleryPeacker from '../../Component/CameraGalleryPeacker';
import CoustomDropdown from '../../Component/CoustomDropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'react-native-blob-util';
import moment, { relativeTimeRounding } from 'moment';
import { Context } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import { white } from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';
import DateTimePicker from '@react-native-community/datetimepicker';


const selectionCamera = createRef();
const selectionCameraForId = createRef();

const Profile = props => {
  const dList = [
    { name: 'Driving Liecense', type: 'DL' },
    { name: 'Passport', type: 'PASSPORT' },
    // {name: 'SIA Batch', type: 'SI_BATCH'},
  ];
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [filedCheck, setfiledCheck] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [edit, setEdit] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: '',
    fullname: '',
    address: '',
    phone: '',
  });
  const [showDrop, setShowrop] = useState(false);
  const [idProof, setIdProof] = useState({
    title: 'Select ID type',
    type: '',
  });
  const [dropList, setDropList] = useState(dList);
  const [submitted, setSubmitted] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [datepeack, setDate] = useState(new Date());
  const [siaExpDate, setSiaExpDate] = useState('DD/MM/YYYY');
  const [profile, setprofile] = useState({});

  useEffect(() => {
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
    });
  }, [edit]);

  useEffect(() => {
    getProfile();
    return () => {
      setToast('');
      setInitial(Context);
      setfiledCheck(false);
      setUserDetail({ email: '', fullname: '', address: '' });
    };
  }, []);

  const timeselect = date => {
    console.log(date);
    setSiaExpDate(date);
    // setDate(date);
    setOpenTime(false);
  };

  const getDropValue = (title, type) => {
    // setJobInfo({...jobInfo, title});
    setIdProof({ title, type });
    setShowrop(false);
  };

  const submit = detail => {
    console.log(userDetail, detail);
    let { anyEmptyInputs } = checkForEmptyKeys(userDetail);
    setfiledCheck(anyEmptyInputs);
    console.log(anyEmptyInputs);
    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
    } else {
      const emailcheck = checkEmail(userDetail.email);
      if (!emailcheck) {
        setToast('Your email id is invalid');
        return;
      }

      const data = {
        email: userDetail.email.toLowerCase(),
        fullName: userDetail.fullname,
        address: userDetail.address,
        phone:
          profile.hasOwnProperty('isOrganization') && profile.isOrganization
            ? userDetail.orgPhone
            : userDetail.phone,
        profile: image,
      };

      console.log('data==========>', data);
      setLoading(true);
      Post('profile/update', data, { ...props, setInitial }).then(
        async res => {
          setLoading(false);
          console.log(res);
          if (res.status) {
            // await AsyncStorage.setItem('userDetail', JSON.stringify(res.data));
            setToast(res.data.message);
            setEdit(false);
            getProfile();
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

  const getProfile = async () => {
    setLoading(true);
    GetApi('me', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res.data.identity);
        console.log('Response Data:', res.data);
        if (res.status) {
          await AsyncStorage.setItem('profilePic', res.data.profile || '');
          setprofile(res.data);
          setImage(res?.data?.profile || '');
          setUserDetail({
            email: res.data.email,
            fullname: res?.data?.fullName || '',
            // identity: res.data.identity,
            address: res?.data?.address || '',
            phone: res?.data?.phone,
            // image: res?.data?.profile || '',
          });
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

  const getImageValue = image => {
    console.log(image);
    setImage(`data:${image.mime};base64,${image.data}`);
  };

  const getImageValue2 = image => {
    console.log('getImageValue2======>', image);
    uploadFile(image);
  };

  const uploadFile = async image => {
    const user = await AsyncStorage.getItem('userDetail');
    let users = JSON.parse(user);
    try {
      const d = [
        {
          name: 'file',
          filename: image.path.toString(),
          type: image.mime,
          data: RNFetchBlob.wrap(image.path),
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
      setLoading(true);
      RNFetchBlob.fetch(
        'POST',
        `${Constants.baseUrl}profile/file`,
        {
          'Content-Type': 'multipart/form-data',
          Authorization: `jwt ${users.token}`,
        },
        d,
      )
        .then(resp => {
          console.log('res============>', resp.data);
          setLoading(false);
          if (JSON.parse(resp.data).status) {
            setToast(JSON.parse(resp.data).data.message);
            getProfile();
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

  const idUploadSection = () => (
    <View
      style={{
        borderColor: Constants.grey,
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
      {/* <DateTimePeacker
        open={openTime}
        datepeack={datepeack}
        mode={'date'}
        timeselect={timeselect}
        setOpenTime={setOpenTime}
      /> */}
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
        borderColor: Constants.grey,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
      }}>
      {profile.identity !== undefined &&
        profile.identity.map((item, i) => (
          <View key={item._id}>
            {item.type !== undefined && (
              <View
                style={[
                  styles.pushNotiView,
                  {
                    alignItems: 'center',
                  },
                  i !== profile.identity.length - 1 && {
                    borderBottomColor: Constants.grey,
                    borderBottomWidth: 1,
                    paddingBottom: 20,
                  },
                ]}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.settingstext, { color: Constants.red }]}>
                    {/* {item.type} */}
                    {gettitle(item.type)}
                  </Text>
                  {item.type === 'SI_BATCH' && (
                    <Text style={[styles.settingstext, { color: Constants.red }]}>
                      Exp.Date -{' '}
                      <Text style={{ color: Constants.white, fontSize: 14 }}>
                        {moment(item.expire).format('DD MMM, yyyy')}
                      </Text>
                    </Text>
                  )}
                </View>

                <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Image
                    // source={require('../../Assets/Images/idproofs.jpg')}
                    source={{ uri: item.image }}
                    resizeMode="contain"
                    style={{ height: 80, width: 120, borderRadius: 5 }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
    </View>
  );

  return (
    <View style={[styles.container]}>
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
          </View>
        </View>
        <View style={{ marginTop: 50 }}>
          <View style={styles.profileInputView}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.profileInput}
              value={userDetail.fullname}
              onChangeText={text => {
                console.log(userDetail, text);
                setUserDetail({ ...userDetail, fullname: text });
              }}
              editable={edit}
            />
          </View>
          {filedCheck.includes('FULLNAME') && (
            <Text style={{ color: 'red' }}> Full name is required</Text>
          )}
          <View style={styles.profileInputView}>
            <Text style={styles.inputLabel}>Email ID</Text>
            <TextInput
              style={styles.profileInput}
              value={userDetail.email}
              onChangeText={email => {
                setUserDetail({ ...userDetail, email });
              }}
              editable={false}
            />
          </View>
          {filedCheck.includes('EMAIL') && (
            <Text style={{ color: 'red' }}> Email is required</Text>
          )}

          <View style={styles.profileInputView}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            {!filedCheck.includes('PHONE NUMBER') && (
              <TextInput
                textAlignVertical="top"
                style={styles.profileInput2}
                value={userDetail.phone}
                onChangeText={phone => {
                  setUserDetail({ ...userDetail, phone });
                }}
                editable={edit}
                returnKeyType={'default'}
                blurOnSubmit={true}
              />
            )}
            {filedCheck.includes('PHONE') && (
              <Text
                style={{ color: 'white', marginLeft: 20 }}
                onPress={() => {
                  setfiledCheck([]);
                }}>
                {' '}
                Phone is Required
              </Text>
            )}
          </View>

          <View style={styles.profileInputView}>
            <Text style={styles.inputLabel}>Address</Text>
            {!filedCheck.includes('ADDRESS') && (
              <TextInput
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                style={styles.profileInput2}
                value={userDetail.address}
                onChangeText={text => {
                  console.log(userDetail.address, text);
                  setUserDetail({ ...userDetail, address: text });
                }}
                editable={edit}
                returnKeyType={'default'}
                blurOnSubmit={true}
              />
            )}
            {filedCheck.includes('ADDRESS') && (
              <Text
                style={{ color: 'white', marginLeft: 20 }}
                onPress={() => {
                  setfiledCheck([]);
                }}>
                {' '}
                Address is required
              </Text>
            )}
          </View>
          <View style={{ height: 20, width: 20, backgroundColor: 'red' }}>
            <Text style={{ color: 'white' }}>Bank Detail</Text>
          </View>

          {/* {filedCheck.includes('ADDRESS') && (
            <Text style={{color: 'red'}}> Address is required</Text>
          )} */}
        </View>
        {edit && idUploadSection()}
        {!edit && profile?.identity?.length > 0 && idproofList()}
        {idProof.type === '' && submitted && (
          <Text style={{ color: 'red', marginTop: 5 }}>
            Please select ID type from list
          </Text>
        )}
        {idProof.type === 'SI_BATCH' &&
          siaExpDate === 'DD/MM/YYYY' &&
          submitted && (
            <Text style={{ color: 'red', marginTop: 5 }}>
              Please add SIA Batch expiry date.
            </Text>
          )}

        {edit && (
          <View
            style={{
              marginTop: 10,
              marginRight: 0,
            }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={styles.jobUpdatbtn} onPress={submit}>
                <Text style={styles.jobUpdatBtnTxt}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
          quality={0.6}
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
          <View style={styles.modalView} onStartShouldSetResponder={() => true}>

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
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Profile;
