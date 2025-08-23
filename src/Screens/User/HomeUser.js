import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  BackHandler,
  Pressable,
  Image,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import styles from './StylesUser';
import Constants from '../../Helpers/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Post, GetApi, Delete, Services} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import NojobFound from '../../Component/NojobFound';
import CustomToaster from '../../Component/CustomToaster';
import {Badge} from 'react-native-paper';
import moment from 'moment';
import {Context} from '../../../App';


const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const HomeUser = props => {
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobList, setJobList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [jobfound, setJobfound] = useState(true);

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      getJobs();
    });
    setInitial('user');
    // const backAction = () => {
    //   console.log('called=======>');
    //   return true;
    // };

    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   backAction,
    // );

    return () => {
      willFocusSubscription;
      setJobfound(true);
      // backHandler.remove();
    };
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const DeletJobs = (id, index) => {
    setLoading(true);
    Delete(`jobs/${id}`, {...props, setInitial}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          if (index !== -1) jobList.splice(index, 1);
          console.log(jobList);
          setJobList(jobList);
          onRefresh();
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

  const getJobs = () => {
    setLoading(true);
    // Services('user/jobs', 'get', {...props}, '').then(
    GetApi('user/jobs', {...props, setInitial}).then(
      async res => {
        setLoading(false);
        console.log(res.data);
        if (res.status) {
          if (res.data.jobs.length == 0) {
            setJobfound(false);
          } else {
            setJobfound(true);
          }
          setJobList(res.data.jobs.reverse());
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

  const postJobs = (item, index) => (
    <Pressable
      style={styles.postjobView2}
      onPress={() => {
        // props.navigation.navigate('user', {
        //   screen: 'History',
        //   params: {screen: 'JobDetail', params: {job_id: item._id}},
        // });

        props.navigation.navigate('JobDetail', {
          job_id: item._id,
          from: 'userlist',
        });
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View style={styles.postjobTitleView}>
          <Text style={styles.postjobtitle}>{item.title}</Text>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={styles.amountTimeMainView}>
              <Image
                source={require('../../Assets/Images/Clandar.png')}
                style={{height: 20, width: 20}}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.amountTime,
                  {marginLeft: 5, fontSize: 10, lineHeight: 14},
                ]}>
                {'Start Date & Time'}
                {'\n'}
                {moment(item?.startDate).format('DD/MM/yyyy, HH:mm')}
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
                  {marginLeft: 5, fontSize: 10, lineHeight: 14},
                ]}>
                {'End Date & Time'}
                {'\n'}
                {moment(item?.endDate).format('DD/MM/yyyy, HH:mm')}
              </Text>
            </View>
          </View>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {(item.showDetail == undefined ||
            (item.showDetail != undefined && !item.showDetail)) && (
            <Text style={styles.showdetail}>Show{'\n'}Details</Text>
          )}
          {item.showDetail != undefined && item.showDetail && (
            <Text style={styles.showAmount}>£{item.amount}</Text>
          )}
        </View>
      </View>
      {item?.applicant.length > 0 && (
        <View style={{position: 'absolute', right: -2, top: -10, zIndex: 100}}>
          <Badge size={20} style={{backgroundColor: Constants.red}}>
            {item.applicant.length}
          </Badge>
        </View>
      )}
      {/* {item.showDetail != undefined && item.showDetail && (
        <View>
          <Text style={[styles.showAmount, {fontSize: 12}]}>
            Job Details....
          </Text>
          <Text style={styles.description}>{item.description}</Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              marginRight: 20,
            }}>
            <View style={{flex: 1}}>
              <TouchableOpacity
                style={styles.applyBtn1}
                onPress={() => {
                  props.navigation.navigate('EditJob', {
                    title: 'Edit Job',
                    jobId: item._id,
                  });
                }}>
                <Text style={styles.applyBtnTxt}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => DeletJobs(item._id, index)}>
                <Text style={styles.applyBtnTxt}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.iconView}
        onPress={() => {
          jobList[index].showDetail =
            jobList[index]?.showDetail == undefined ||
            jobList[index]?.showDetail == false
              ? true
              : false;
          setJobList(jobList);
          onRefresh();
        }}>
        <Ionicons
          name={
            item.showDetail != undefined && item.showDetail
              ? 'chevron-up-outline'
              : 'chevron-down-outline'
          }
          size={20}
          color={Constants.white}
        />
      </TouchableOpacity> */}
    </Pressable>
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
        <TouchableOpacity
          style={styles.postjobView}
          onPress={() => {
            props.navigation.navigate('EditJob', {title: 'Post New Job'});
          }}>
          <Text style={styles.postjobText}>Post Jobs</Text>
        </TouchableOpacity>
        {jobfound ? (
          <View
            style={{marginTop: 20}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {jobList.map((item, index) => (
              <View key={item._id}>{postJobs(item, index)}</View>
            ))}
          </View>
        ) : (
          <NojobFound header="No job posted yet" />
        )}
      </ScrollView>
    </View>
  );
};

export default HomeUser;
