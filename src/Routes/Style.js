import {StyleSheet} from 'react-native';
import Constants from '../Helpers/constant';
const styles = StyleSheet.create({
  headerRightView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerAvtarView: {
    height: 45,
    width: 45,
    // borderColor: 'Constants.white',
    borderWidth: 2,
    borderRadius: 100,
  },
  headerTitle: {
    color: Constants.white,
    fontSize: 20,
    fontWeight: '700',
    // fontFamily: 'Mulish-Medium',
  },
  tabBarLabelStyle: {
    fontSize: 12,
    // marginTop: 10,
    fontWeight: '700',
    // fontFamily: 'Mulish-Regular',
  },

  tabBarStyle: {
    height: 60,
    backgroundColor: Constants.grey,
    paddingBottom: 10,
    fontSize: 16,
  },
});

export default styles;
