import store from "../../store.js";
const app = getApp();
Page({
  data: {
    wxlogo: "../../public/images/weixin_logo.png",
    boy: "../../public/images/boy.png",
    girl: "../../public/images/girl.png",
    // wxloginText: "微信登录",
    userInfo: {
    },
    allOrderData: {
      init_order: {
        all: [],
        order_0: [],
        order_1: [],
        order_2: [],
        order_3: [],
      },
      joined_order: {
        ll: [],
        order_0: [],
        order_1: [],
        order_2: [],
        order_3: [],
      },
      exit_order: {
        ll: [],
        order_0: [],
        order_1: [],
        order_2: [],
        order_3: [],
      },


    },
    canIUse: wx.canIUse("button.open-type.getUserInfo")
  },


  //事件处理函数
  bindViewTap: function () {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },

  onShow: function () {
    // console.log(store);
    let that = this;

    this.setData({
      userInfo: store.data.localUserInfo
    });
    //重新获得用户数据
    that.getUserData(store.data.localUserInfo.openid)
      .then((data) => {
        store.data.localUserInfo = data;
        store.update();
        this.setData({
          userInfo: data
        });
      });
    // console.log("用户", store.data.localUserInfo);
    if (store.data.localUserInfo) {
      that.checkMyOrder(store.data.localUserInfo.openid)
    }
  },
  checkMyOrder(openid) {
    let that = this;
    // console.log(openid);
    try {
      app.ajax.checkMyOrder().then((res) => {
        that.setData({ allOrderData: res.data.data.orderArr })
        // console.log(res.data.data.orderArr);
      })
    } catch (error) {
      console.log(error);
    }

  },

  goMyOrder: function (e) {
    let that = this;
    // console.log(e);
    let sign = e.currentTarget.dataset["obj"];
    let type = e.currentTarget.dataset["objtype"];//小写
    //这里是为了给后面的订单详情页面提供功能区别的判断
    // 0 是参与拼单, 1是可以退出拼单, 2是可以修改、完成、取消
    let operation = 0;
    if (sign == "init_order" && type == "order_0") {
      operation = 2;
    } else if (sign == "joined_order" && type == "order_0") {
      operation = 1;
    }
    // console.log(sign, type);
    let orderArr = that.data.allOrderData[sign][type];
    // console.log(orderArr);
    // console.log(orderArr);
    wx.navigateTo({
      url: "../myOrder/myOrder",
      success: res => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit("dataFormPerson", {
          data: {
            orderArr: orderArr,
            operation: operation
          }
        });
      }
    });
  },

  /**
  * @method getUserData
  * @description 获取拼单发起者的信息
  * @param { String } openid 用户的openid
  * @return { Object } makerData
  */
  getUserData(openid) {
    return new Promise((resolve, reject) => {
      var makerObj = {};
      app.ajax
        .getUserData({ user_openid: openid })
        .then((res) => {
          makerObj = res.data.data;
          resolve(makerObj);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
});
