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
    running_order: [],
    end_order: [],
    cansel_order: [],
    over_ddl_order: [],
    canIUse: wx.canIUse("button.open-type.getUserInfo")
  },


  //事件处理函数
  bindViewTap: function () {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },

  onLoad: function () {
    console.log(store);
    let that = this;

    this.setData({
      userInfo: store.data.localUserInfo
    });
    console.log("用户", store.data.localUserInfo);
    if (store.data.localUserInfo) {
      that.checkMyOrder(store.data.localUserInfo.openid)
    }

  },
  checkMyOrder(openid) {
    let that = this;
    // console.log(openid);
    try {
      app.ajax.checkMyOrder({ openid: openid, myOrder: 0 }).then((res) => {
        that.setData({ running_order: res.data.data.order_0 })
        that.setData({ end_order: res.data.data.order_1 })
        that.setData({ cansel_order: res.data.data.order_2 })
        that.setData({ over_ddl_order: res.data.data.order_3 })
      })
    } catch (error) {
      console.log(error);
    }

  },

  goMyOrder: function (e) {
    let that = this;
    // console.log(e);
    let sign = e.currentTarget.dataset["index"];
    // console.log(sign);
    let orderArr = [that.data.running_order, that.data.end_order,
    that.data.cansel_order, that.data.over_ddl_order
    ];
    // console.log(orderArr);
    wx.navigateTo({
      url: "../myOrder/myOrder",
      success: res => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit("dataFormPerson", {
          data: {
            orderArr: orderArr[sign]
          }
        });
      }
    });
  }
});
