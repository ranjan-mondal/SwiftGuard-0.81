import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const RateView = props => {
  const [rateList, setrateList] = useState([
    {rate: 1, type: 'Very bad'},
    {rate: 2, type: 'Bad'},
    {rate: 3, type: 'Average'},
    {rate: 4, type: 'Good'},
    {rate: 5, type: 'Excellent'},
  ]);
  return (
    <View
      style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
      {rateList.map(item => (
        <TouchableOpacity
          key={item.rate}
          onPress={() => {
            props.getRateValue(item, props.index);
          }}>
          <FontAwesome
            name="star"
            color={
              props.rate === item.rate || props.rate > item.rate
                ? props.checkedColor
                : props.uncheckedColor
            }
            size={20}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RateView;
