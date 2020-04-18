// page_new/home/home.js
import store from "../../store.js";
import create from "../../utils/create.js";

const app = getApp();
create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    bg: ".",
    wxlogo: "../../public/images/weixin_logo.png",
    wxloginText: "微信登录"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  // 微信登录
  login: function(data) {
    // return new Promise((resolve, reject) => {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          if (res.code) {
            console.log(res.code);
            // wx.request({
            //   url: "http://localhost:3000/miniprogram/userLogin",
            //   method: "POST",
            //   data: {
            //     code: res.code,
            //     userInfo: data
            //   },
            //   success(res) {
            //     console.log(res);
            //     //
            //     // wx.setStorage({
            //     //   key: ''
            //     // })
            //     wx.setStorageSync("localToken", res.data.localToken); // 存储token
            //     that.store.data.hasUserInfo = true; // 登录成功
            //     that.update();

            //     console.log(that.store.data.ifLogin);
            //   },
            //   fail() {
            //     // reject();
            //     console.log("登录失败！");
            //   }
            // });

            app.ajax
              .userLogin({ code: res.code, userInfo: data })
              .then(res => {
                console.log(res);

                wx.setStorageSync("localToken", res.data.localToken); // 存储token

                wx.showToast({
                  title: "登录成功！"
                });

                // console.log(wx.getStorageSync("localToken"));
                // this.store.data.hasUserInfo = true; // 登录成功
                // this.update();

                // console.log(this.store.data.ifLogin);
                resolve();
              })
              .catch(err => {
                reject(err);
              });
          }
        }
      });
    });
    // });
  },

  getUserInfo: async function(e) {
    console.log(e);
    console.log("用户信息1", e.detail.userInfo);
    if (e.detail.userInfo) {
      let userInfo = e.detail.userInfo;
      // 用户按了允许授权按钮
      await this.login(userInfo);
      // this.store.data.userInfo = e.detail.userInfo;
      // this.update();
      // console.log("——————————————————————————————", this.store.data.userInfo);
      // console.log(this.store.data.ifLogin);
      app.globalData.userInfo = userInfo;

      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
      console.log(app.globalData.userInfo);
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
    // app.globalData.userInfo = e.detail.userInfo;
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
