import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useContext} from 'react';
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
import {Context} from '../../../App';
import CustomToaster from '../../Component/CustomToaster';


const ForgotPassword = props => {
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [filedCheck, setfiledCheck] = useState([]);
  const [userDetail, setUserDetail] = useState({
    email: '',
  });

  const submit = () => {
    // props.navigation.navigate('OtpVerify', {email: userDetail.email}); // temparary solution
    // return;
    let {errorString, anyEmptyInputs} = checkForEmptyKeys(userDetail);
    setfiledCheck(anyEmptyInputs);

    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
    } else {
      const emailcheck = checkEmail(userDetail.email);
      if (!emailcheck) {
        setToast('Your email id is invalid');
        return;
      }

      const d = {
        email: userDetail.email.toLowerCase(),
      };
      console.log('data==========>', d);
      setLoading(true);

      Post('sendOTP', d, {...props, setInitial}).then(async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setToast(res.data.message);
          const data = {
            email: userDetail.email.toLowerCase(),
            token: res.data.token,
          };
          props.navigation.navigate('OtpVerify', {data});
          setUserDetail({
            email: '',
          });
        } else {
          setToast(res.message);
        }
      });
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
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={Styles.logoView}>
          <Image
            source={require('../../Assets/Images/logo2.png')}
            style={Styles.logoImg}
          />
        </View>
        <View style={Platform.OS == 'ios' && {paddingLeft: 20}}>
          <Text style={Styles.title}>Forgot{'\n'}Password</Text>
          <Text style={Styles.subtitle}>
            We will send you a message to reset your password.
          </Text>
          <View style={[Styles.fieldView, {marginTop: 50}]}>
            <View style={Styles.iconView}>
              <Image
                source={require('../../Assets/Images/Email.png')}
                style={Styles.icon}
                resizeMode="contain"
              />
            </View>
            <TextInput
              style={Styles.input}
              placeholder="Email"
              placeholderTextColor={Constants.lightgrey}
              value={userDetail.email}
              onChangeText={email => setUserDetail({...userDetail, email})}
            />
          </View>
          {filedCheck.includes('EMAIL') && (
            <Text style={{color: 'red'}}> Email id is required</Text>
          )}
        </View>

        <View
          style={[
            {flexDirection: 'row', marginTop: 50},
            Platform.OS == 'ios' && {paddingHorizontal: 20},
          ]}>
          <View style={{flex: 1}}>
            <Text style={[Styles.title, {fontSize: 25}]}>Send Code</Text>
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
export default ForgotPassword;
