import store from "../../store.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [

    ]
  },

  // onLoad: function () {
  //   console.log("message onLoad");
  //   let that = this;
  //   that.checkMyOrder(store.data.localUserInfo.openid)
  // },

  onShow: function () {
    console.log("message show");
    let that = this;
    that.checkMyOrder(store.data.localUserInfo.openid)
  },
  checkMyOrder() {
    let that = this;
    // console.log(openid);
    try {
      app.ajax.checkMyOrder().then((res) => {

        let orderArr = [];
        if (res.data.state.status == 200
          && res.data.data.orderArr.init_order.order_0.length > 0) {
          orderArr = res.data.data.orderArr.init_order.order_0;
          if (res.data.data.orderArr.joined_order.order_0.length > 0) {
            orderArr = orderArr.concat(res.data.data.orderArr.joined_order.order_0);
          }
          if (res.data.data.orderArr.exit_order.order_0.length > 0) {
            orderArr = orderArr.concat(res.data.data.orderArr.exit_order.order_0);
          }

        }
        that.setData({ orderList: orderArr })
        console.log(that.data.orderList);
      })
    } catch (error) {
      console.log(error);
    }

  },



  goChat(e) {
    let that = this;
    var orderid = e.currentTarget.dataset["orderid"];
    // console.log(orderid);
    //这里的try catch 好像不能捕获错误
    try {
      app.ajax.getChatHome({ order_id: orderid }).then((res) => {
        if (res.data.state.status == 200) {
          let chatData = res.data.data;
          // console.log(chatData);
          wx.navigateTo({
            url: "../chat/chat",
            success: res => {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit("dataFormMessage", {
                data: {
                  chatData: chatData
                }
              });
            }
          })
        }
      })
    } catch (error) {
      console.log(error);
    }


  },

})