/* eslint-disable prettier/prettier */
import axios from 'axios';
import Constants from './constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConnectionCheck from './ConnectionCheck';

const GetApi = async (url, props) => {
  return new Promise(function (resolve, reject) {
    ConnectionCheck.isConnected().then(
      async connected => {
        console.log(connected);
        if (connected) {
          const token = await AsyncStorage.getItem('token');
          // let userDetail = JSON.parse(user);
          console.log(Constants.baseUrl + url);
          console.log(`jwt ${token}`);

          axios
            .get(Constants.baseUrl + url, {
              headers: {
                Authorization: `jwt ${token}`,
              },
            })
            .then(res => {
              // console.log(res.data);
              resolve(res.data);
            })
            .catch(async err => {
              if (err.response) {
                console.log(err.response.status);
                if (err?.response?.status === 401) {
                  props?.setInitial('Signin');
                  await AsyncStorage.removeItem('userDetail');
                  props?.navigation?.navigate('Signin');
                }
                resolve(err.response.data);
              } else {
                reject(err);
              }
            });
        } else {
          reject('No internet connection');
        }
      },
      err => {
        reject(err);
      },
    );
  });
};

const Post = async (url, data, props) => {
  return new Promise(function (resolve, reject) {
    ConnectionCheck.isConnected().then(
      async connected => {
        console.log(connected);
        if (connected) {
          const token = await AsyncStorage.getItem('token');
          // let userDetail = JSON.parse(user);
          console.log('url===>', Constants.baseUrl + url);
          // console.log('token===>', `jwt ${userDetail?.token}`);
          // console.log('data=====>', data);
          axios
            .post(Constants.baseUrl + url, data, {
              headers: {
                Authorization: `jwt ${token}`,
              },
            })
            .then(res => {
              // console.log(res.data);
              resolve(res.data);
            })
            .catch(async err => {
              if (err.response) {
                console.log(err.response.status);
                if (err?.response?.status === 401) {
                  props?.setInitial('Signin');
                  await AsyncStorage.removeItem('userDetail');
                  props?.navigation?.navigate('Signin');
                }
                resolve(err.response.data);
              } else {
                reject(err);
              }
            });
        } else {
          reject('No internet connection');
        }
      },
      err => {
        reject(err);
      },
    );
  });
};

const Put = async (url, data, props) => {
  return new Promise(function (resolve, reject) {
    ConnectionCheck.isConnected().then(
      async connected => {
        console.log(connected);
        if (connected) {
          const token = await AsyncStorage.getItem('token');
          // let userDetail = JSON.parse(user);
          console.log(Constants.baseUrl + url);
          // console.log(`jwt ${userDetail?.token}`);
          axios
            .put(Constants.baseUrl + url, data, {
              headers: {
                Authorization: `jwt ${token}`,
              },
            })
            .then(res => {
              console.log(res.data);
              resolve(res.data);
            })
            .catch(async err => {
              if (err.response) {
                if (err?.response?.status === 401) {
                  props?.setInitial('Signin');
                  await AsyncStorage.removeItem('userDetail');
                  props?.navigation?.navigate('Signin');
                }
                resolve(err.response.data);
              } else {
                reject(err);
              }
            });
        } else {
          reject('No internet connection');
        }
      },
      err => {
        reject(err);
      },
    );
  });
};

const Delete = async (url, data, props) => {
  return new Promise(function (resolve, reject) {
    ConnectionCheck.isConnected().then(
      async connected => {
        console.log(connected);
        if (connected) {
          const token = await AsyncStorage.getItem('token');
          // let userDetail = JSON.parse(user);
          // console.log(Constants.baseUrl + url);
          // console.log(`jwt ${userDetail?.token}`);
          axios
            .delete(Constants.baseUrl + url, {
              headers: {
                Authorization: `jwt ${token}`,
              },
            })
            .then(res => {
              console.log(res.data);
              resolve(res.data);
            })
            .catch(async err => {
              if (err.response) {
                if (err?.response?.status === 401) {
                  props?.setInitial('Signin');
                  await AsyncStorage.removeItem('userDetail');
                  props?.navigation?.navigate('Signin');
                }
                resolve(err.response.data);
              } else {
                reject(err);
              }
            });
        } else {
          reject('No internet connection');
        }
      },
      err => {
        reject(err);
      },
    );
  });
};

// const Api = async (method, url, data) => {
//   return new Promise(function (resolve, reject) {
//     ConnectionCheck.isConnected().then(async connected => {
//       console.log(connected);
//       if (connected) {
//         const user = await AsyncStorage.getItem('userDetail');
//         let userDetail = JSON.parse(user);
//         axios({
//           method,
//           url: Constants.baseUrl + url,
//           data,
//           headers: {Authorization: `jwt ${userDetail?.token}`},
//         }).then(
//           res => {
//             resolve(res);
//           },
//           err => {
//             if (err.response) {
//               resolve(err.response.data);
//             } else {
//               resolve(err);
//             }
//           },
//         );
//       } else {
//         reject('No internet connection');
//       }
//     });
//   });
// };

// const Services = async (url, method, props, data) => {
//   return new Promise(function (resolve, reject) {
//     ConnectionCheck.isConnected().then(async connected => {
//       console.log(connected);
//       if (connected) {
//         const user = await AsyncStorage.getItem('userDetail');
//         let userDetail = JSON.parse(user);
//         console.log(Constants.baseUrl + url);
//         console.log(`jwt ${userDetail?.token}`);
//         axios[method](Constants.baseUrl + url, data, {
//           headers: {
//             Authorization: `jwt ${userDetail?.token}`,
//           },
//         })
//           .then(res => {
//             console.log(res.data);
//             resolve(res.data);
//           })
//           .catch(err => {
//             if (err.response) {
//               console.log(err.response.status);
//               if (err?.response?.status === 401) {
//                 props.setInitial('Signin');
//                 props?.navigation?.navigate('Signin');
//               }
//               resolve(err.response.data);
//             } else {
//               reject(err);
//             }
//           });
//       } else {
//         reject('No internet connection');
//       }
//     });
//   });
// };

export { Post, Put, GetApi, Delete };
