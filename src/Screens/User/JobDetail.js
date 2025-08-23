import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import styles from './StylesUser';
import Constants from '../../Helpers/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Post, GetApi, Put, Delete} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import CoustomDropdown from '../../Component/CoustomDropdown';
import moment from 'moment';
import {Avatar} from 'react-native-paper';
import RateView from '../../Component/RateView';
import {Context} from '../../../App';
import CustomToaster from '../../Component/CustomToaster';


const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const JobDetail = props => {
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const {job_id} = props?.route?.params;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [jobDetail, setJobDetail] = React.useState({});
  const [rate, setrate] = useState(0);
  const [reviewObj, setReviewObj] = useState({});
  const [reviewTitle, setReviewTitle] = useState('Add Review');
  const [filedCheck, setfiledCheck] = useState([]);

  const getRateValue = (review, index) => {
    // setrate(review.rate);
    // setReviewObj({...reviewObj, rating: review.rate, title: review.type});
    // if (!!jobDetail.applicant[index].review) {
    setReviewObj({...reviewObj, [index]: {...[index], ...review}});
    setReviewTitle(review.type);
    console.log(review, index);
    jobDetail.applicant[index] = {
      ...jobDetail.applicant[index],
      review: {
        ...jobDetail.applicant[index].review,
        rating: review.rate,
        title: review.type,
      },
    };
    setJobDetail(jobDetail);

    // jobDetail.applicant[index].review.rating = review.rate;
    // jobDetail.applicant[index].review.title = review.type;
    // console.log(jobDetail?.applicant[index]);
    // setJobDetail(jobDetail);
    onRefresh();
    // }
  };

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      console.log(job_id);
      if (job_id !== undefined) {
        getHistory(`user/jobs/${job_id}`);
      }
    });
    return () => {
      willFocusSubscription;
    };
  }, []);

  useEffect(() => {
    onRefresh();
  }, [jobDetail]);

  const getHistory = url => {
    setLoading(true);
    GetApi(url, {...props, setInitial}).then(
      async res => {
        setLoading(false);
        console.log(res.data);
        console.log(res.data.job.applicant);
        if (res.status) {
          // res?.data?.job?.applicant?;
          setJobDetail(res.data.job);
          // onRefresh();
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

  const submit = index => {
    // let {anyEmptyInputs} = checkForEmptyKeys(reviewObj);
    // setfiledCheck(anyEmptyInputs);

    // if (anyEmptyInputs.length > 0) {
    //   // Toaster(errorString);
    // } else {
    const data = {
      title: jobDetail.applicant[index].review.title,
      details:
        reviewObj[index]?.details === undefined
          ? jobDetail.applicant[index].review.details
          : reviewObj[index]?.details,
      job_id,
      rating: jobDetail.applicant[index].review.rating,
      for: jobDetail.applicant[index]._id,
    };
    console.log('data==========>', data);
    setLoading(true);
    Put(`user/review/${jobDetail?.applicant[index]?.review?._id || ''}`, data, {
      ...props,
      setInitial,
    }).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setToast(res.data.message);
          setReviewObj({
            title: '',
            details: '',
            rating: '',
          });
          // getHistory();
          setReviewTitle('Add Review');
          // props.navigation.navigate('HistoryList');
        } else {
          setToast(res.message);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
    // }
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const DeletJobs = () => {
    setLoading(true);
    Delete(`jobs/${job_id}`, {...props, setInitial}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          // props.navigation.navigate('user', {
          //   screen: 'Home',
          //   params: {
          //     screen: 'HomeUser',
          //   },
          // });
          setToast(res?.data?.message);
          props.navigation.goBack();
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

  const jobHistory = () => (
    <>
      <View style={styles.postjobView2}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View style={styles.postjobTitleView}>
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
                    {marginLeft: 5, fontSize: 10, lineHeight: 12},
                  ]}>
                  {'Start Date & Time'}
                  {'\n'}
                  {moment(new Date(jobDetail.startDate)).format(
                    'DD/MM/yyyy, HH:mm',
                  )}
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
                  {moment(new Date(jobDetail.endDate)).format(
                    'DD/MM/yyyy, HH:mm',
                  )}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={[styles.showAmount, {fontSize: 16}]}>
              £{jobDetail.amount}/hr
            </Text>
          </View>
        </View>

        <View>
          <Text style={[styles.showAmount, {fontSize: 14, marginTop: 10}]}>
            Job Details....
          </Text>
          <Text style={styles.description}>{jobDetail.description}</Text>

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
                  props.navigation.navigate('user', {
                    screen: 'Home',
                    params: {
                      screen: 'EditJob',
                      params: {title: 'Edit Job', jobId: job_id},
                    },
                  });
                }}>
                <Text style={styles.applyBtnTxt}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => DeletJobs()}>
                <Text style={styles.applyBtnTxt}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>

          {jobDetail?.applicant !== undefined &&
            jobDetail?.applicant.map((rate, index) => (
              <View
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                style={[styles.postjobView3, {marginRight: 20}]}
                key={rate._id}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View>
                    <View style={styles.reviewAvatar}>
                      <Avatar.Image
                        size={40}
                        source={require('../../Assets/Images/images.png')}
                      />
                    </View>
                  </View>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <View style={{paddingHorizontal: 15}}>
                      <Text
                        style={[
                          styles.description,
                          {fontSize: 14, marginTop: 0},
                        ]}>
                        {rate.username}
                      </Text>
                      {props?.route?.params?.from === 'history' && (
                        <Text
                          style={[
                            styles.description,
                            {fontSize: 14, marginTop: 10},
                          ]}>
                          {rate?.review?.title || 'Add Review'}
                        </Text>
                      )}
                      {props?.route?.params?.from === 'history' && (
                        <View style={{marginTop: 5}}>
                          <RateView
                            index={index}
                            rate={rate?.review?.rating || 0}
                            getRateValue={getRateValue}
                            checkedColor={Constants.red}
                            uncheckedColor={Constants.lightgrey}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                {props?.route?.params?.from === 'history' && (
                  <View style={{marginTop: 10}}>
                    <Text style={[styles.showAmount, {fontSize: 14}]}>
                      Details....
                    </Text>
                    <TextInput
                      multiline={true}
                      numberOfLines={2}
                      value={
                        reviewObj[index]?.details === undefined
                          ? rate?.review?.details
                          : reviewObj[index]?.details
                      }
                      placeholder="Description"
                      placeholderTextColor={Constants.grey}
                      textAlignVertical="top"
                      style={{color: 'white', flex: 1, flexWrap: 'wrap'}}
                      maxLength={150}
                      onChangeText={details => {
                        setReviewObj({
                          ...reviewObj,
                          [index]: {...[index], details},
                        });
                        // rate = {
                        //   ...rate,
                        //   review: {
                        //     ...rate.review,
                        //     details,
                        //   },
                        // };
                        // jobDetail.applicant[index] = rate;
                        // setJobDetail(jobDetail);
                        setReviewTitle('');
                        onRefresh();
                      }}
                    />
                  </View>
                )}

                {reviewTitle !== 'Add Review' && (
                  <TouchableOpacity
                    onPress={() => {
                      submit(index);
                    }}
                    style={{position: 'absolute', top: 5, right: 15}}>
                    <Text
                      style={[
                        styles.description,
                        {color: Constants.red, fontSize: 14},
                      ]}>
                      Post
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
        </View>
      </View>
    </>
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
      <ScrollView style={{paddingVertical: 20}}>
        <Text style={[styles.postjobtitle, {fontSize: 20, lineHeight: 25}]}>
          {[jobDetail.title]}
        </Text>
        {jobDetail !== null && (
          <View
            style={{marginTop: 10}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {jobHistory()}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default JobDetail;
