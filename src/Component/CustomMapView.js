import {View, Text} from 'react-native';
import React from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

const CustomMapView = props => {
  // console.log('MAPS props=====>', props);
  return (
    <>
      {props?.locationArray.length > 0 ? (
        <MapView
          region={{
            latitude: props.locationArray[0].lat,
            longitude: props.locationArray[0].lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
          followUserLocation={true}
          zoomEnabled={true}
          provider={PROVIDER_GOOGLE}
          style={props.style}>
          {props.locationArray.map((mark, index) => (
            <View key={index}>
              {mark?.job_id !== undefined && (
                <Marker
                  onPress={() =>
                    props?.selectLocation !== undefined
                      ? props?.selectLocation(mark)
                      : {}
                  }
                  coordinate={{
                    latitude: mark.lat,
                    longitude: mark.lng,
                  }}
                />
              )}
            </View>
          ))}
        </MapView>
      ) : null}
    </>
  );
};

export default CustomMapView;
