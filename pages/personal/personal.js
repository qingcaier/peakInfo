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

  onLoad: function () {
    // console.log(store);
    let that = this;

    this.setData({
      userInfo: store.data.localUserInfo
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
            orderArr: orderArr
          }
        });
      }
    });
  }
});
