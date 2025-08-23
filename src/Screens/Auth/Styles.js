/* eslint-disable prettier/prettier */
import { StyleSheet, Dimensions, Platform } from 'react-native';
import Constants from '../../Helpers/constant';

const Styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    backgroundColor: Constants.black,
    padding: 20,
  },
  logoView: {
    width:
      Platform.OS === 'ios'
        ? Dimensions.get('window').width
        : Dimensions.get('window').width - 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  logoImg: {
    height: 200,
    width: 200,
    borderRadius: 5,
    marginTop: 15,
  },
  title: {
    fontSize: 30,
    color: Constants.white,
    fontWeight: '700',
    fontFamily: 'Helvetica',
  },
  subtitle: {
    fontSize: 12,
    color: Constants.red,
    fontWeight: '400',
    fontFamily: 'Helvetica',
    marginTop: 5,
    marginBottom: 10,
  },
  fieldView: {
    backgroundColor: Constants.grey,
    width: Dimensions.get('window').width - 40,
    minHeight: 55,
    marginTop: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    // paddingVertical: 5,
  },
  iconView: {
    height: 45,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 4,
    borderRightColor: Constants.black,
  },
  icon: {
    height: 25,
    // width: 18,
  },
  input: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Helvetica',
    color: Constants.red,
    flex: 1,
  },
  labeStyle: {
    fontSize: 16,
    // fontFamily: 'Mulish-Bold',
    // color: Constants.lightgrey,
  },
  radioView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // flexWrap: 'wrap',
    width: 240,
  },

  acountBtn: {
    alignItems: 'center',
    // marginTop: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    marginLeft: Platform.OS === 'ios' ? 20 : 0,
    marginTop: 30,
  },
  Already: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    color: Constants.white,
    // fontFamily: 'Mulish-Regular',
  },
  signin: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    color: Constants.red,
    //   fontFamily: 'Mulish-Regular',
  },
  forgot: {
    color: Constants.red,
    fontSize: 14,
    marginTop: 10,
  },
  codeFieldRoot2: { width: Dimensions.get('window').width - 40 },
  cell: {
    width: 70,
    height: 70,
    lineHeight: 68,
    fontSize: 30,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    // borderWidth: 2,
    // borderColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    color: Constants.red,
    backgroundColor: Constants.grey,
  },

  cell2: {
    width: 40,
    height: 40,
    lineHeight: 40,
    fontSize: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    color: '#fff',
  },
  focusCell: {
    borderColor: '#E98607',
  },

  applyBtn: {
    backgroundColor: Constants.red,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
    // borderColor: 'rgba(51, 51, 51, 0.6)',
    // borderWidth: 3,
    marginTop: 20,
  },
  applyBtnTxt: {
    color: Constants.white,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    fontSize: 12,

    lineHeight: 25,
  },

  termsheader: {
    color: Constants.white,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    fontSize: 18,
    lineHeight: 25,
    marginVertical: 10,
  },

  termstext: {
    color: Constants.white,
    fontWeight: '400',
    fontFamily: 'Helvetica',
    fontSize: 14,
    lineHeight: 16,
    marginBottom: 5,
  },
});

export default Styles;
