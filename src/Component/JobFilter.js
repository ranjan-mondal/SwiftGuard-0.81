import {View, Text} from 'react-native';
import React from 'react';
import moment from 'moment';

const JobFilter = (data, hour, type) => {
  return new Promise(function (resolve, reject) {
    const newArray = [];
    data.forEach((element, index) => {
      const startdate = moment(element.startDate).format('MMM DD, YYYY');
      const starttime = element.startTime;
      // moment(element.startTime, 'HH:mm').format('h:mm:ss');
      var countDownDate = new Date(element.startDate).getTime();
      var now = new Date().getTime();
      var distance = (countDownDate - now) / 1000;
      // console.log('distance======>', distance);
      const check = Math.sign(distance);
      // console.log('check======>', check);
      if (check === 1) {
        distance /= 60 * 60;
        var hours = Math.abs(distance);
      } else {
        var hours = 0;
      }

      // var hours = Math.floor((distance % (1000 * 60 * 60)) / (60 * 60));
      // console.log('hours======>', hours);
      if (type === 'down') {
        if (hours <= hour) {
          newArray.push(element);
        }
      } else {
        if (hours > hour) {
          newArray.push(element);
        }
      }

      if (data.length === index + 1) {
        resolve(newArray);
      }
    });
  });
};

export default JobFilter;

// var diff =(dt2.getTime() - dt1.getTime()) / 1000;
// diff /= (60 * 60);
// return Math.abs(Math.round(diff));
