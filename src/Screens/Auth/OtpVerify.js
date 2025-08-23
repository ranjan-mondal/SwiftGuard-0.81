import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import Constants from '../../Helpers/constant';
import Styles from './Styles';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {
  checkForEmptyKeys,
  checkNumber,
  checkEmail,
} from '../../Helpers/InputsNullChecker';
import {Post} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import {Context} from '../../../App';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomToaster from '../../Component/CustomToaster';


const CELL_COUNT = 4;
const OtpVerify = props => {
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const {email, token} = props?.route?.params?.data;
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [property, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [otptoken, setToken] = useState(token);

  const [filedCheck, setfiledCheck] = useState([]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => null,
    });
  }, []);

  const submit = () => {
    const data = {
      otp: value,
    };
    let {errorString, anyEmptyInputs} = checkForEmptyKeys(data);
    setfiledCheck(anyEmptyInputs);
    if (anyEmptyInputs.length > 0) {
    } else {
      data.token = otptoken;
      console.log('data==========>', data);
      setLoading(true);
      Post('verifyOTP', data, {...props, setInitial}).then(
        async res => {
          setLoading(false);
          console.log('err =======>', res);
          if (res.status) {
            setToast(res.data.message);
            props.navigation.navigate('ChangePassword', {
              email: props?.route?.params?.email,
              token: res.data.token,
            });
          } else {
            setToast(res.message);
          }
        },
        err => {
          setLoading(false);
          // console.log('err =======>', err);
        },
      );
    }
  };

  const resendOtp = () => {
    setLoading(true);
    Post('sendOTP', {email}, {...props}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setToast(res.data.message);
          setToken(res.data.token);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
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
      <TouchableOpacity
        style={{position: 'absolute', top: 10, left: 10, height: 30, width: 30}}
        onPress={() => {
          props.navigation.goBack();
        }}>
        <Ionicons name="arrow-back-outline" size={25} color={Constants.white} />
      </TouchableOpacity>
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={Styles.logoView}>
          <Image
            source={require('../../Assets/Images/logo2.png')}
            style={Styles.logoImg}
          />
        </View>
        <View style={Platform.OS == 'ios' && {paddingLeft: 20}}>
          <Text style={Styles.title}>Enter{'\n'}Code</Text>
          <Text style={[Styles.subtitle, {fontSize: 18}]}>
            We have sent you mail at
          </Text>
          <Text style={[Styles.subtitle, {fontSize: 18, color: '#FFFFFF'}]}>
            {props?.route?.params?.data?.email}
          </Text>
          <CodeField
            ref={ref}
            {...property}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={Styles.codeFieldRoot2}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[Styles.cell, isFocused && Styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol ||
                  (isFocused ? (
                    <Cursor />
                  ) : (
                    <Text style={{color: Constants.red}}>_</Text>
                  ))}
              </Text>
            )}
          />

          {filedCheck.includes('OTP') && (
            <Text style={{color: 'red'}}> OTP is required</Text>
          )}
        </View>

        <View style={{flexDirection: 'row', marginTop: 30}}>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <TouchableOpacity onPress={submit}>
              <Image
                source={require('../../Assets/Images/next.png')}
                style={{width: 50, height: 50}}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[Styles.acountBtn, {justifyContent: 'flex-start'}]}>
          <Text
            style={[
              Styles.Already,
              Platform.OS == 'ios' && {paddingHorizontal: 20},
            ]}>
            If you did not get the code?
          </Text>
          <TouchableOpacity
            onPress={() => {
              resendOtp();
            }}>
            <Text style={[Styles.signin]}> Resend code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
export default OtpVerify;
