import store from "../../store.js";
import create from "../../utils/create.js";

const app = getApp();

create(store, {
  data: {
    wxlogo: "../../public/images/微信登录.png",
    wxloginText: "微信登录",
    userInfo: {},
    hasUserInfo: false
    // canIUse: wx.canIUse("button.open-type.getUserInfo")
  },

  // 微信登录
  login: function(data) {
    let that = this;
    // return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        if (res.code) {
          console.log(res.code);

          console.log(app.ajax);
          app.ajax
            .userLogin({ code: res.code, userInfo: data })
            .then(res => {
              console.log(res);

              wx.setStorageSync("localToken", res.data.localToken); // 存储token
              that.store.data.hasUserInfo = true; // 登录成功
              that.update();

              console.log(that.store.data.ifLogin);
            })
            .catch(err => {
              console.log("登录失败", err);
            });
        }
      }
    });
    // });
  },

  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad: function() {
    if (this.store.data.ifLogin) {
      this.setData({
        userInfo: this.store.data.userInfo,
        hasUserInfo: this.store.data.ifLogin
      });
    }
    // else if (this.store.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     });
    //   };
    // }
    // else {
    // 在没有 open-type=getUserInfo 版本的兼容处理
    // wx.getUserInfo({
    //   success: res => {
    //     app.globalData.userInfo = res.userInfo;
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     });
    //   }
    // });
  },
  getUserInfo: function(e) {
    console.log(e);
    console.log("用户信息1", e.detail.userInfo);
    if (e.detail.userInfo) {
      // 用户按了允许授权按钮
      this.login(e.detail.userInfo);
      this.store.data.userInfo = e.detail.userInfo;
      this.update();
      // console.log("——————————————————————————————", this.store.data.userInfo);
      // console.log(this.store.data.ifLogin);
    } else {
      console.log("已拒绝");
      // 用户按下了拒绝按钮
      wx.showModal({
        title: "提示",
        content: "未授权登录可能会影响到您的使用体验，是否确定授权？",
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log("用户点击确定");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
  }
});
