/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, { useState, useContext, useEffect, createRef } from 'react';
import styles from './StyleProvider';
import CoustomDropdown from '../../Component/CoustomDropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons//FontAwesome5';
import Constants from '../../Helpers/constant';
import RateView from '../../Component/RateView';
import {
  checkForEmptyKeys,
  checkNumber,
  checkEmail,
} from '../../Helpers/InputsNullChecker';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import { GetApi, Post } from '../../Helpers/Service';
import CameraGalleryPeacker from '../../Component/CameraGalleryPeacker';
import RNFetchBlob from 'rn-fetch-blob';

const selectionCamera = createRef();

const Report = props => {
  const dList = [
    { name: 'Fight', type: 'Fight' },
    { name: 'Crime', type: 'Crime' },
    { name: 'Fire', type: 'Fire' },
    { name: 'Event cancel', type: 'Event cancel' },
  ];
  // console.log(props?.route?.params);
  const [params, setParams] = useState(props?.route?.params || {});
  const [toast, setToast] = useState('');
  const [user, setUser] = useState({});
  const [initial, setInitial] = useContext(Context);
  const [dropList, setDropList] = useState(dList);
  const [showDrop, setShowrop] = useState(false);
  const [dropValue, setDropValue] = useState('Fight');
  const [rate, setrate] = useState(0);
  const [filedCheck, setfiledCheck] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportObj, setreportObj] = useState({
    title: '',
    details: '',
    // report:''
  });
  const [img, setImg] = useState('');
  const [file, setFile] = useState({});

  useEffect(() => {
    AsyncStorage.getItem('userDetail').then(res => {
      // console.log('report props =============?', JSON.parse(res));
      setUser(JSON.parse(res));
    });

    getConfig();
  }, []);

  const getImageValue2 = image => {
    // console.log('getImageValue2======>', image);
    setImg(`data:${image.mime};base64,${image.data}`);
    setFile(image);
    // setImage(`data:${image.mime};base64,${image.data}`);
    // uploadFile(image);
  };

  const getDropValue = title => {
    setDropValue(title);
    setreportObj({ ...reportObj, title });
    setShowrop(false);
    setreportObj({ ...reportObj, title });
  };

  const getConfig = () => {
    setLoading(true);
    GetApi('user/config', { ...props, setInitial }).then(async res => {
      setLoading(false);
      // console.log(res);
      if (res.status) {
        setDropList(res.data.incidenceType);
      } else {
        setToast(res.message);
      }
    });
  };

  // const submit = () => {
  //   let {anyEmptyInputs} = checkForEmptyKeys(reportObj);
  //   setfiledCheck(anyEmptyInputs);

  //   if (anyEmptyInputs.length > 0) {
  //     // Toaster(errorString);
  //   } else {
  //     const data = {
  //       title: reportObj.title,
  //       details: reportObj.details,
  //       job_id: params._id,
  //     };
  //     console.log('data==========>', data);
  //     setLoading(true);
  //     Post('provider/incident', data).then(
  //       async res => {
  //         setLoading(false);
  //         console.log(res);
  //         if (res.status) {
  //           setToast(res.data.message);
  //           setreportObj({
  //             title: '',
  //             details: '',
  //           });
  //           props.navigation.navigate('ServiceProvider');
  //         } else {
  //           setToast(res.message);
  //         }
  //       },
  //       err => {
  //         setLoading(false);
  //         console.log(err);
  //       },
  //     );
  //   }
  // };

  const submit = async () => {
    try {
      let { anyEmptyInputs } = checkForEmptyKeys(reportObj);
      setfiledCheck(anyEmptyInputs);

      if (anyEmptyInputs.length > 0) {
        console.log(anyEmptyInputs);
      } else {
        let d = [
          {
            name: 'title',
            data: reportObj.title,
          },
          {
            name: 'details',
            data: reportObj.details,
          },
          {
            name: 'job_id',
            data: params._id,
          },
        ];

        if (file?.path) {
          d.push({
            name: 'file',
            filename: file.path.toString(),
            type: file.mime,
            data: RNFetchBlob.wrap(file.path),
          });
        }
        console.log(user.token);
        console.log(`${Constants.baseUrl}provider/incident`)
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        RNFetchBlob.fetch(
          'POST',
          `${Constants.baseUrl}provider/incident`,
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
              props.navigation.navigate('ServiceProvider');
              setToast(JSON.parse(resp.data).data.message);
            }
          })
          .catch(err => {
            setLoading(false);
            console.log(err);
          });
      }
    } catch (err) {
      console.log(err);
    }
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
      <ScrollView>
        <View style={[styles.postjobView3, { marginTop: 70 }]}>
          <View
            style={[
              styles.selectjobname,
              { flexDirection: 'row', padding: 10, justifyContent: 'flex-start' },
            ]}>
            {/* <Text style={styles.jobId}>Job id :-</Text> */}
            <Text
              style={[styles.jobId, { color: Constants.white, marginLeft: 5 }]}>
              {params?.title}
            </Text>
          </View>
          <View
            style={[styles.selectjobname, { flexDirection: 'row', padding: 10 }]}>
            <View style={{ flex: 7 }}>
              <Text style={[styles.jobname, { color: Constants.white }]}>
                {reportObj.title}
              </Text>
            </View>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'flex-end' }}
              onPress={() => setShowrop(true)}>
              <Ionicons
                name="chevron-down-outline"
                color={Constants.red}
                size={20}
              />
            </TouchableOpacity>
            <CoustomDropdown
              visible={showDrop}
              setVisible={setShowrop}
              getDropValue={getDropValue}
              data={dropList}
            />
          </View>
          {filedCheck.includes('TITLE') && (
            <Text style={{ color: 'red' }}> Title is required</Text>
          )}
          <View style={{ paddingHorizontal: 5 }}>
            <Text style={[styles.showAmount, { fontSize: 14 }]}>
              Incident Report
            </Text>
            <TextInput
              multiline={true}
              numberOfLines={5}
              value={reportObj.details}
              // maxLength={}
              placeholder="Description"
              placeholderTextColor={Constants.grey}
              textAlignVertical="top"
              style={{
                color: 'white',
                flex: 1,
                flexWrap: 'wrap',
                minHeight: 100,
              }}
              onChangeText={details => setreportObj({ ...reportObj, details })}
            />
            {filedCheck.includes('DETAILS') && (
              <Text style={{ color: 'red' }}> Detail is required</Text>
            )}
            {/* <Text style={styles.description}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s,
            </Text> */}
            <Text style={[styles.showAmount, { fontSize: 14 }]}>
              Incident Image
            </Text>
            {!!img && (
              <Image
                source={{ uri: img }}
                style={{
                  width: Dimensions.get('window').width - 90,
                  height: 200,
                  borderRadius: 5,
                }}
              />
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              // marginRight: 20,
            }}>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => {
                  selectionCamera.current?.show();
                }}
                style={[
                  styles.applyBtn,
                  {
                    width: '100%',
                    height: 40,
                    flexDirection: 'row',
                    backgroundColor: Constants.black,
                  },
                ]}>
                <FontAwesome5
                  name="cloud-upload-alt"
                  size={20}
                  color={Constants.white}
                />
                <Text
                  style={[
                    styles.applyBtnTxt,
                    {
                      fontSize: 14,
                      lineHeight: 25,
                      marginLeft: 5,
                      textAlign: 'center',
                    },
                  ]}>
                  Add Image
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              // marginRight: 20,
            }}>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => {
                  submit();
                }}
                style={[styles.applyBtn, { width: '100%', height: 50 }]}>
                <Text
                  style={[styles.applyBtnTxt, { fontSize: 22, lineHeight: 25 }]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <CameraGalleryPeacker
          refs={selectionCamera}
          backgroundColor={Constants.grey}
          titleColor={Constants.white}
          headerColor={Constants.red}
          cancelButtonColor={Constants.red}
          crop={false}
          getImageValue={getImageValue2}
          height={200}
          width={Dimensions.get('window').width - 40}
          quality={0.8}
          base64={true}
        />
      </ScrollView>
    </View>
  );
};

export default Report;
