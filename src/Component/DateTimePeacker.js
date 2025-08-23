import {
  View, Text, Modal,
  Pressable,
  Button,
  Platform
} from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
// import DatePicker from 'react-native-date-picker';

const DateTimePeacker = props => {
  console.log(props);
  // const [openTime, setOpenTime] = useState(props.open)
  return (
    <View>
      <Modal
        animationType="fade" // or "slide"
        transparent={true}
        visible={props.open}
        onRequestClose={() => props.setOpenTime(false)} // For Android back button
      >
        <Pressable style={styles.centeredView} onPress={() => props.setOpenTime(false)}>
          <View style={styles.modalView} onStartShouldSetResponder={() => true}>


            {props.type === 'start' ? (
              // <DatePicker
              //   modal
              //   open={props.open}
              //   date={props.datepeack}
              //   mode={props.mode}
              //   // mode="datetime"
              //   androidVariant={'nativeAndroid'}
              //   confirmText="Done"
              //   maximumDate={props?.maxdate}
              //   minimumDate={new Date()}
              //   onConfirm={date => {
              //     console.log(date);
              //     props.timeselect(date);
              //   }}
              //   onCancel={() => {
              //     props.setOpenTime(false);
              //   }}
              // />
              <DateTimePicker
                testID="dateTimePicker" // Good practice for testing
                value={props.datepeack} // The currently selected date/time
                mode={props.mode} // 'date' or 'time'
                is24Hour={false} // Use 24-hour format if true, otherwise 12-hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'} // 'default' for pop-up, 'spinner' for inline, 'calendar', 'clock' on Android
                // onChange={onChange} // Callback when date/time is changed
                onChange={(event, selectedDate) => {
                  const d = event.nativeEvent.timestamp
                  console.log(event.nativeEvent.timestamp, selectedDate)

                  console.log(new Date(d))
                  props.timeselect(d);
                  // timeselect(d);
                }}
                themeVariant='dark'
                textColor='black'
                maximumDate={props?.maxdate}
                minimumDate={new Date()}
              />
            ) : (
              // <DatePicker
              //   modal
              //   open={props.open}
              //   date={props.datepeack}
              //   mode={props.mode}
              //   androidVariant={'nativeAndroid'}
              //   confirmText="Done"
              //   minimumDate={props?.mindate || new Date()}
              //   maximumDate={props.maxdate}
              //   onConfirm={date => {
              //     console.log(date);
              //     props.timeselect(date);
              //   }}
              //   onCancel={() => {
              //     props.setOpenTime(false);
              //   }}
              // />

              <DateTimePicker
                testID="dateTimePicker" // Good practice for testing
                value={props.datepeack}// The currently selected date/time
                mode={props.mode}  // 'date' or 'time'
                is24Hour={false} // Use 24-hour format if true, otherwise 12-hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'} // 'default' for pop-up, 'spinner' for inline, 'calendar', 'clock' on Android
                // onChange={onChange} // Callback when date/time is changed
                onChange={(event, selectedDate) => {
                  const d = event.nativeEvent.timestamp
                  console.log(event.nativeEvent.timestamp, selectedDate)

                  console.log(new Date(d))
                  props.timeselect(d);
                }}
                themeVariant='dark'
                textColor='black'
                minimumDate={props?.mindate || new Date()}
                maximumDate={props.maxdate}
              />
            )}
            {Platform.OS === 'ios' && (
              <Button title="Done" onPress={() => props.setOpenTime(false)} />
            )}
          </View>
        </Pressable>
      </Modal>

    </View>
  );
};

export default DateTimePeacker;
