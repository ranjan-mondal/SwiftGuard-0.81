import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Constants from '../../Helpers/constant';
import Styles from './Styles';
import {
  checkForEmptyKeys,
  checkNumber,
  checkEmail,
} from '../../Helpers/InputsNullChecker';
import {Post} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Context} from '../../../App';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomToaster from '../../Component/CustomToaster';


const ChangePassword = props => {
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const {email, token} = props?.route?.params;
  const [showPass, setShowPass] = useState(true);
  const [showConfirmPass, setShowConfirmPass] = useState(true);

  const [loading, setLoading] = useState(false);
  const [filedCheck, setfiledCheck] = useState([]);
  const [userDetail, setUserDetail] = useState({
    newpassword: '',
    confirmpassword: '',
  });

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => null,
    });
  }, []);

  const submit = () => {
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
        token,
      };
      console.log('data==========>', data);
      setLoading(true);
      Post('changePassword', data, {...props, setInitial}).then(
        async res => {
          setLoading(false);
          console.log(res);
          if (res.status) {
            setToast(res.data.message);
            props.navigation.navigate('Signin');
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
          <Text style={Styles.title}>
            Set New{'\n'}
            Password
          </Text>
          {/* <Text style={Styles.subtitle}>
          Please Enter Your Details Below to start Using the app
        </Text> */}

          <View style={[Styles.fieldView, {position: 'relative'}]}>
            <View style={Styles.iconView}>
              <Image
                source={require('../../Assets/Images/lock.png')}
                style={Styles.icon}
                resizeMode="contain"
              />
            </View>
            <TextInput
              style={Styles.input}
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
                Styles.iconView,
                {position: 'absolute', right: 0, borderRightWidth: 0},
              ]}>
              <Image
                source={
                  showPass
                    ? require('../../Assets/Images/eye-1.png')
                    : require('../../Assets/Images/eye.png')
                }
                style={{height: 22, width: 25}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={[Styles.fieldView, {position: 'relative'}]}>
            <View style={Styles.iconView}>
              <Image
                source={require('../../Assets/Images/lock.png')}
                style={Styles.icon}
                resizeMode="contain"
              />
            </View>
            <TextInput
              style={Styles.input}
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
                Styles.iconView,
                {position: 'absolute', right: 0, borderRightWidth: 0},
              ]}>
              <Image
                source={
                  showConfirmPass
                    ? require('../../Assets/Images/eye-1.png')
                    : require('../../Assets/Images/eye.png')
                }
                style={{height: 22, width: 25}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            {flexDirection: 'row', marginTop: 20},
            Platform.OS == 'ios' && {paddingHorizontal: 20},
          ]}>
          <View style={{flex: 2}}>
            {/* <Text style={[Styles.title, {fontSize: 25}]}>Set password</Text> */}
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <TouchableOpacity onPress={submit}>
              <Image
                source={require('../../Assets/Images/next.png')}
                style={{width: 40, height: 40}}
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
      </ScrollView>
    </View>
  );
};

export default ChangePassword;
