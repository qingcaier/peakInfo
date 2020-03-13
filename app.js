import store from "./store";
import ajax from "./api/ports"; // 引入接口

// 引入SDK核心类
let QQMapWX = require("./map/qqmap-wx-jssdk.min");
let qqmapsdk = new QQMapWX({
  key: "TFRBZ-KZZCX-GQ54B-T22GL-HDDES-ESFWM"
});

//app.js
App({
  // onLaunch: function() {
  //   console.log(wx.getStorageSync("localToken"));
  //   // console.log("11111111111");

  //   // 获取本地储存token
  //   let localToken = wx.getStorageSync("localToken");

  //   // 获取用户信息
  //   if (Boolean(localToken)) {
  //     wx.getSetting({
  //       success: res => {
  //         if (res.authSetting["scope.userInfo"]) {
  //           // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //           wx.getUserInfo({
  //             success: res => {
  //               wx.login({
  //                 success: response => {
  //                   if (response.code) {
  //                     console.log(response.code);
  //                     ajax
  //                       .userLogin({
  //                         code: response.code,
  //                         userInfo: res.userInfo
  //                       })
  //                       .then(resp => {
  //                         // console.log(resp);

  //                         wx.setStorageSync("localToken", resp.data.localToken); // 存储token
  //                         store.data.hasUserInfo = true; // 登录成功
  //                         store.update();

  //                         // console.log(store.data.ifLogin);
  //                       })
  //                       .catch(err => {
  //                         console.log("登录失败", err);
  //                       });
  //                   }
  //                 }
  //               });

  //               // 可以将 res 发送给后台解码出 unionId
  //               store.data.userInfo = res.userInfo;

  //               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //               // 所以此处加入 callback 以防止这种情况
  //               if (this.userInfoReadyCallback) {
  //                 this.userInfoReadyCallback(res);
  //               }

  //               store.update();
  //               // console.log(store.data.userInfo);
  //             }
  //           });
  //         }
  //       }
  //     });
  //   }

  //   // 进入小程序地理位置授权
  //   store.getUserLocation();
  // },
  globalData: {
    userInfo: null
  },

  // 引入请求接口
  ajax,

  // 腾讯地图
  qqMap: qqmapsdk
});
