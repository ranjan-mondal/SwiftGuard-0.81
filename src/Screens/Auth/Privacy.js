import {View, Text, Image, ScrollView} from 'react-native';
import React, {useState} from 'react';
import styles from '../Provider/StyleProvider';
import Spinner from '../../Component/Spinner';
import CustomToaster from '../../Component/CustomToaster';
import Constants from '../../Helpers/constant';


const Privacy = props => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
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
        <View style={styles.notificationSetingView}>
          <View
            style={[
              styles.notificationtitle,
              {
                borderBottomWidth: 1,
                borderBottomColor: Constants.grey,
              },
            ]}>
            <View style={[styles.iconView, {height: 35, borderRightWidth: 2}]}>
              <Image
                source={require('../../Assets/Images/privacy.png')}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <Text
              style={[
                styles.settingstext,
                {color: Constants.red, fontSize: 20},
              ]}>
              Privacy Policy
            </Text>
          </View>

          <View style={{padding: 20}}>
            <Text style={{color: Constants.white}}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam
              erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci
              tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
              consequat. Duis autem vel eum iriure dolor in hendrerit in
              vulputate velit esse molestie consequat, vel illum dolore eu
              feugiat nulla facilisis at vero eros et accumsan et iusto odio
              dignissim qui blandit praesent luptatum zzril delenit augue duis
              dolore te feugait nulla facilisi.
            </Text>
            <Text style={{color: Constants.white, marginTop: 10}}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam
              erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci
              tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
              consequat. Duis autem vel eum iriure dolor in hendrerit in
              vulputate velit esse molestie consequat, vel illum dolore eu
              feugiat nulla facilisis at vero eros et accumsan et iusto odio
              dignissim qui blandit praesent luptatum zzril delenit augue duis
              dolore te feugait nulla facilisi.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Privacy;
