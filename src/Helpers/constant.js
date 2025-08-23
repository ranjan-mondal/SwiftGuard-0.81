const prodUrl = 'https://apis.jjowen.co.uk/v1/api/';
// const prodUrl = 'http://192.168.0.187:3000/v1/api/';
// const prodUrl = 'http://10.80.19.68:3000/v1/api/';
const devUrl = 'http://192.168.0.107:3000/v1/api/';
// const devUrl = 'http://192.168.1.11:3000/v1/api/';

let apiUrl = prodUrl;

const Constants = {
  baseUrl: prodUrl,
  lightgrey: '#757575',
  grey: '#333333',
  yellow: '#FFE600',
  black: '#000000',
  green: '#07A404',
  white: '#FFFFFF',
  red: '#E71126',
  newBlack: '#1A1A1A',
  constant_appLaunched: 'appLaunched',
  HAS_ACCOUNT: 'HASACCOUNT',
  LANGUAGE_SELECTED: 'LANGUAGE_SELECTED',
  header_back_middle_right: 'header_back_middle_right',
  header_back: 'header_back',
  keyUserToken: 'token',
  isOnboarded: 'isOnboarded',
  authToken: '',
  keysocailLoggedIn: 'isSocialLoggedIn',
  isProfileCreated: 'isProfileCreated',
  userInfoObj: 'userInfoObj',
  lastUserType: 'lastUserType',
  isDeviceRegistered: 'isDeviceRegistered',
  canResetPass: 'canResetPass',
  fcmToken: 'fcmToken',
  productionUrl: prodUrl,
  developmentUrl: devUrl,

  emailValidationRegx:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  numberValidationRegx: /^\d+$/,
  passwordValidation: /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
};

export default Constants;
