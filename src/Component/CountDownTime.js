/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import Constants from '../Helpers/constant';
import moment from 'moment';

const CountDownTime = props => {
  const [timer, setTimer] = useState(20);
  const [getTimer, setGetTimer] = useState({
    day: '00',
    hour: '00',
    min: '00',
    sec: '00',
  });

  useEffect(() => {
    count();
  }, []);

  const count = () => {
    var x = setInterval(() => {
      var countDownDate = new Date(
        props.show ? props.startDate : props.endDate,
      ).getTime();
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setGetTimer({
        day: days,
        hour: hours,
        min: minutes,
        sec: seconds,
      });
      if (distance < 0) {
        clearInterval(x);
        setGetTimer({
          day: '00',
          hour: '00',
          min: '00',
          sec: '00',
        });
        if (props?.startNow !== undefined) {
          props?.startNow(props);
        }
      }
    }, 1000);
  };

  let formattedNumber = myNumber => {
    return ('0' + myNumber).slice(-2);
  };

  return (
    <View>
      {props.show ? (
        <View>
          {getTimer.day < 1 && getTimer.hour < 24 ? (
            <Text
              style={{
                color: Constants.red,
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Job Starts in : {'\n'}
              {`${formattedNumber(getTimer.hour)} : ${formattedNumber(
                getTimer.min,
              )}: ${formattedNumber(getTimer.sec)}`}
            </Text>
          ) : (
            <Text
              style={{
                color: Constants.red,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              {props.title}
              {/* Start Soon... */}
              {/* {moment(props.startDate).format('DD/MM/yyyy, HH:mm')} */}
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
};

export default CountDownTime;
