import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import styles from './StylesUser';
import Constants from '../../Helpers/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Post, GetApi} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import {Badge} from 'react-native-paper';
import {Context} from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import moment from 'moment';


const Notification = props => {
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [notilist, setNotiList] = useState([]);

  useEffect(() => {
    getNoification();
  }, []);

  const getNoification = () => {
    setLoading(true);
    GetApi('notification', {...props, setInitial}).then(
      async res => {
        setLoading(false);
        console.log(res.data);
        if (res.status) {
          setNotiList(res.data.notifications);
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

  const notificationHistory = item => (
    <View style={[styles.postjobView2, {paddingLeft: 0}]}>
      <View
        style={[
          {
            flexDirection: 'row',
            padding: 10,
          },
          showDetail && {
            borderBottomWidth: 1,
            borderBottomColor: Constants.grey,
          },
        ]}>
        <View style={styles.postjobTitleView}>
          <Text style={[styles.postjobtitle, {marginLeft: 10}]}>
            {item?.message}
          </Text>
        </View>
        {!showDetail && (
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.showdetail}>Show{'\n'}Details</Text>
          </View>
        )}
        {showDetail && (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={[styles.showAmount, {fontSize: 30}]}>£50</Text>
          </View>
        )}
      </View>

      {showDetail && (
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
          }}>
          <View
            style={[
              styles.postjobTitleView,
              {position: 'relative', borderRightWidth: 0},
            ]}>
            <Text
              style={[
                styles.postjobtitle,
                {color: Constants.red, fontWeight: '700', fontSize: 16},
              ]}>
              Marriage Security Guard
            </Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={styles.amountTimeMainView}>
                <Image
                  source={require('../../Assets/Images/Clandar.png')}
                  style={{height: 20, width: 20}}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.amountTime,
                    {marginLeft: 5, fontSize: 10, lineHeight: 12},
                  ]}>
                  {'Start Date & Time'}
                  {'\n'}
                  {moment(new Date()).format('DD/MM/yyyy, HH:00')}
                </Text>
              </View>
              <View style={styles.amountTimeMainView}>
                <Image
                  source={require('../../Assets/Images/Clandar.png')}
                  style={{height: 20, width: 20}}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.amountTime,
                    {marginLeft: 5, fontSize: 10, lineHeight: 12},
                  ]}>
                  {'End Date & Time'}
                  {'\n'}
                  {moment(new Date()).format('DD/MM/yyyy, HH:00')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
      {showDetail && (
        <View style={{paddingHorizontal: 20}}>
          <Text style={[styles.showAmount, {fontSize: 14}]}>
            Job Details....
          </Text>
          <Text style={styles.description}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s,
          </Text>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowDetail(!showDetail);
                }}
                style={[
                  styles.applyBtn,
                  {
                    height: 50,
                    width: '100%',
                  },
                ]}>
                <Text
                  style={[styles.applyBtnTxt, {fontSize: 22, lineHeight: 25}]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={{position: 'absolute', right: 10, top: 10}}>
        <Badge size={10} style={{backgroundColor: Constants.red}}></Badge>
      </View>

      <TouchableOpacity
        style={styles.iconView}
        onPress={() => {
          setShowDetail(!showDetail);
        }}>
        <Ionicons
          name={showDetail ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={20}
          color={Constants.white}
        />
      </TouchableOpacity>
    </View>
  );
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
        <View style={[styles.fieldView2]}>
          <View style={styles.iconView2}>
            <Ionicons
              name={'search-outline'}
              size={25}
              color={Constants.white}
            />
          </View>
          <TextInput
            style={styles.input2}
            placeholder="Search job notifcation"
            placeholderTextColor={Constants.white}
            value={searchVal}
            onChangeText={text => setSearchVal(text)}
          />
        </View>

        <View>
          {/* <View>
            <Text style={[styles.listtypeName, {marginTop: 10}]}>Today</Text>
          </View> */}
          {notilist.map(item => (
            <View key={item._id}>{notificationHistory(item)}</View>
          ))}

          {/* <View>
            <Text style={[styles.listtypeName, {marginTop: 10}]}>
              Yesterday
            </Text>
          </View>
          {notificationHistory()}
          {notificationHistory()}
          {notificationHistory()}
          <View>
            <Text style={[styles.listtypeName, {marginTop: 10}]}>
              Last Week
            </Text>
          </View>
          {notificationHistory()}
          {notificationHistory()} */}
        </View>
      </ScrollView>
    </View>
  );
};

export default Notification;
