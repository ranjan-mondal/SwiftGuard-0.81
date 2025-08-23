import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Geocode from 'react-geocode';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from '../Helpers/constant';
import axios from 'axios';
import {
  request,
  PERMISSIONS,
  requestLocationAccuracy,
} from 'react-native-permissions';

// AIzaSyAshORpoR1zzvluMgps8NQXO8avnVLnsL4

const LocationDropdown = props => {
  const [showList, setShowList] = useState(false);
  const [prediction, setPredictions] = useState([]);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({});

  useEffect(() => {
    setAddress(props.value);
  }, [props.value]);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(async result => {
          console.log(result);
        });
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        console.log(PermissionsAndroid.RESULTS.GRANTED, granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the location');
        } else {
          console.log('location permission denied');
          // alert("Location permission denied");
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const GOOGLE_PACES_API_BASE_URL =
    'https://maps.googleapis.com/maps/api/place';

  const GooglePlacesInput = async text => {
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=AIzaSyDJCsROiNkizrJp-BfkiuxmTrwoh0lFgPk&input=${text}`;

    try {
      if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(async result => {
          console.log(result);
          if (result === 'granted') {
            setShowList(true);
            const result = await axios.request({
              method: 'post',
              url: apiUrl,
            });
            if (result) {
              const {
                data: {predictions},
              } = result;
              setPredictions(predictions);
              setShowList(true);
            }
          } else {
            getLocation();
          }
        });
      } else {
        const check = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (check) {
          setShowList(true);
          const result = await axios.request({
            method: 'post',
            url: apiUrl,
          });
          if (result) {
            const {
              data: {predictions},
            } = result;
            setPredictions(predictions);
            setShowList(true);
          }
        } else {
          getLocation();
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkLocation = async add => {
    try {
      Geocode.setApiKey('AIzaSyBPMRYD65oTZfenG4NS1YpX-v0TVbvg2wo');
      if (add) {
        Geocode.fromAddress(add).then(
          response => {
            const lat = response.results[0].geometry.location;
            setLocation(lat);
            props.getLocationVaue(lat, add);
          },
          error => {
            console.error(error);
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View
          style={[
            styles.amountTimeMainView,
            // filedCheck.includes('LOCATION') && styles.validateBorder,
          ]}>
          <Image
            source={require('../Assets/Images/location.png')}
            style={{height: 25, width: 25}}
            resizeMode="contain"
          />
          <View>
            <Text style={[styles.amountTime, {marginBottom: 7}]}>
              Work Location
            </Text>
            <TextInput
              value={address}
              placeholder="Work Location"
              placeholderTextColor={Constants.grey}
              numberOfLines={5}
              textAlignVertical="top"
              style={[
                styles.amountTime,
                styles.editjobinput,
                {marginLeft: 10, color: Constants.lightgrey},
              ]}
              onChangeText={location => {
                GooglePlacesInput(location);
                setAddress(location);
              }}
            />
          </View>
        </View>
      </View>
      {prediction != '' && showList && (
        <View style={prediction && styles.list}>
          {prediction.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: Constants.lightgrey,
              }}>
              <Ionicons
                name="location"
                size={18}
                color={Constants.red}
                style={{marginHorizontal: 5}}
              />
              <Text
                style={styles.item}
                onPress={() => {
                  console.log(item);
                  setAddress(item.description);
                  checkLocation(item.description);
                  setShowList(false);
                  // setJobInfo({...jobInfo, location: item.description});
                }}>
                {item.description}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  editjobinput: {
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    lineHeight: 12,
    marginLeft: 2,
  },
  amountTimeMainView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  amountTime: {
    color: Constants.white,
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 5,
    lineHeight: 18,
  },
  list: {
    marginVertical: 10,
    // marginHorizontal: 20,
    borderColor: Constants.lightgrey,
    borderWidth: 1,
    borderRadius: 5,
    // padding: 10,
  },
  item: {
    // padding: 10,
    fontSize: 13,
    height: 'auto',
    marginVertical: 5,
    // borderBottomWidth: 1,
    // borderBottomColor: 'lightgrey',
    // fontFamily: 'Mulish-SemiBold',
    width: Dimensions.get('window').width - 100,
    flexWrap: 'wrap',
    color: Constants.red,
  },
  validateBorder: {
    borderBottomColor: Constants.red,
    borderBottomWidth: 1,
    paddingBottom: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default LocationDropdown;
