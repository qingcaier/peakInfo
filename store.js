const app = getApp();
export default {
  data: {
    userInfo: {},
    hasUserInfo: false, // 是否获得授权用户信息
    canIUse: wx.canIUse("button.open-type.getUserInfo"),

    // 是否登录
    ifLogin: function() {
      return this.hasUserInfo && this.canIUse;
    }

    // 用户定位
    // userLocation: {}

    //   logs: [],
    //   b: {
    //     arr: [{ name: '数值项目1' }] ,
    //     //深层节点也支持函数属性
    //     fnTest:function(){
    //       return this.motto.split('').reverse().join('')
    //     }
    //   },
    //   firstName: 'dnt',
    //   lastName: 'zhang',
    //   fullName: function () {
    //     return this.firstName + this.lastName
    //   },
    //   pureProp: 'pureProp',
    //   globalPropTest: 'abc', //更改我会刷新所有页面,不需要再组件和页面声明data依赖
    //   ccc: { ddd: 1 } //更改我会刷新所有页面,不需要再组件和页面声明data依赖
  },
  globalData: [],

  // 判断是否有定位权限
  getUserLocation: function() {
    // let that = this;
    wx.getSetting({
      success: res => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        console.log("授权情况", res);

        if (res.authSetting["scope.userLocation"] === undefined) {
          // 初始化进入小程序，未授权
          this.getLocation(res);
        } else if (res.authSetting["scope.userLocation"] === true) {
          // 已授权
          this.getLocation(res);
        } else if (res.authSetting["scope.userLocation"] === false) {
          // 非初始化进入且未授权（拒绝授权）
          wx.showModal({
            title: "",
            content: "【锋汇】需要获取您的地理位置，请确认授权",
            success: response => {
              if (response.cancel) {
                wx.showToast({
                  title: "拒绝授权2",
                  icon: "none"
                });
                setTimeout(() => {
                  wx.navigateBack();
                }, 1000);
              } else if (response.confirm) {
                console.log("再次授权");
                // 拒绝授权后再次重新授权
                wx.openSetting({
                  success: dataAu => {
                    console.log("dataAu: success", dataAu);
                    if (dataAu.authSetting["scope.userLocation"] === true) {
                      //再次授权，调用wx.getLocation的API
                      this.getLocation(dataAu);
                    } else {
                      wx.showToast({
                        title: "授权失败",
                        icon: "none"
                      });
                      // setTimeout(() => {
                      //   wx.navigateBack();
                      // }, 1500);
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
  },

  // 微信获得经纬度
  getLocation: function(userLocation) {
    wx.getLocation({
      type: "gcj02",
      success: res => {
        // console.log("getLocation:success", res);
        // let latitude = res.latitude;
        // let longitude = res.longitude;
        // this.data.userLocation = {
        //   latitude,
        //   longitude
        // };
        // // app.ajax
        // console.log("westore里存的位置", this.data.userLocation);
      },
      fail: res => {
        console.log("getLocation:fail", res);
        if (res.errMsg === "getLocation:fail auth deny") {
          wx.showModal({
            title: "",
            content: "【锋汇】需要获取您的地理位置，请确认授权",
            success: response => {
              if (response.cancel) {
                wx.showToast({
                  title: "拒绝授权2",
                  icon: "none"
                });
                setTimeout(() => {
                  wx.navigateBack();
                }, 1000);
              } else if (response.confirm) {
                console.log("再次授权");
                // 拒绝授权后再次重新授权
                wx.openSetting({
                  success: dataAu => {
                    console.log("dataAu: success", dataAu);
                    if (dataAu.authSetting["scope.userLocation"] === true) {
                      //再次授权，调用wx.getLocation的API
                      this.getLocation(dataAu);
                    } else {
                      wx.showToast({
                        title: "授权失败",
                        icon: "none"
                      });
                      setTimeout(() => {
                        wx.navigateBack();
                      }, 1500);
                    }
                  }
                });
              }
            }
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
          return;
        }
        if (!userLocation || !userLocation.authSetting["scope.userLocation"]) {
          this.getUserLocation();
        } else if (userLocation.authSetting["scope.userLocation"]) {
          wx.showModal({
            title: "",
            content: "请在系统设置中打开定位服务",
            showCancel: false,
            success: result => {
              if (result.confirm) {
                wx.navigateBack();
              }
            }
          });
        } else {
          wx.showToast({
            title: "授权失败",
            icon: "none"
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }
    });
  }

  // logMotto: function() {
  //   console.log(this.data.motto);
  // }
  //默认 false，为 true 会无脑更新所有实例
  // updateAll: true
};
