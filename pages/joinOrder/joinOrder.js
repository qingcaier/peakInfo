import store from "../../store.js";
import create from "../../utils/create.js";
const app = getApp();

create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    orderId: "",
    count: 0,
    orderData: {

    },
    shopData: {

    },
    makerData: {

    },
    canJoin: false,
    //operation，父组件传过来的判别条件
    // 0 是参与拼单, 1是可以退出拼单, 2是可以修改、完成、取消
    operation: 0,
    dialogShow: false, //显示 参与拼单的输入
    // buttons: [{ text: '取消' }, { text: '确定' }],
    buttons: [
      {
        type: "default",
        className: "",
        text: "取消",
        value: 0,
      },
      {
        type: "primary",
        className: "",
        text: "确认",
        value: 1,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let that = this;
    //	获取所有打开的EventChannel事件
    const eventChannel = this.getOpenerEventChannel();
    // 监听
    eventChannel.on("dataFormFather", (res) => {
      that.setData({ orderId: res.data.order_id });

      that.setData({ canJoin: res.data.canJoin });
      that.setData({ operation: res.data.operation });
      //如果是从用户信息那边进来，就不显示参加按钮吧

      // console.log(res.data.order_id)
      that.getOrderData(that.data.orderId).then((data_o) => {
        console.log(data_o);
        that.setData({ orderData: data_o });

        that.getShopData(that.data.orderData.business_act_id).then((data_s) => {
          console.log(data_s);
          that.setData({ shopData: data_s });
        });

        that
          .getmakerData(that.data.orderData.initiator.openid)
          .then((data_u) => {
            console.log(data_u);
            that.setData({ makerData: data_u });
          });
      });
    });
  },
  joinOrder() {
    let that = this;
    let obj = { order_id: that.data.orderId, count: that.data.count };
    console.log(obj);
    app.ajax.joinOrder(obj).then((res) => {
      if (res.data.state.status == 200) {
        wx.showModal({
          title: "成功参加拼单",
          showCancel: false,
          success: function (res) {
            // if (res.confirm) {
            //   that.goHome();
            // }
          },
        });

        store.data.localUserInfo.joined_order.push(that.data.orderId);
        store.update();
      }
    });
  },
  // 双向绑定输入框
  formInputChange(e) {
    this.setData({
      count: parseInt(e.detail.value),
    });
  },
  tapDialogButton(e) {
    if (e.detail.index) {
      this.joinOrder();
    }
    this.setData({
      dialogShow: false,
    });
  },
  //先判断是否参加了
  open: function () {
    let that = this;
    let hasJoin = false;
    for (let item of store.data.localUserInfo.init_order) {
      if (item == that.data.orderId) {
        hasJoin = true;
      }
    }
    for (let item of store.data.localUserInfo.joined_order) {
      if (item == that.data.orderId) {
        hasJoin = true;
      }
    }
    if (hasJoin) {
      wx.showModal({
        title: "不能重复参加拼单",
        showCancel: false,
        success: function (res) { },
      });
    } else {
      this.setData({
        dialogShow: true,
      });
    }
  },
  //参与者 退出拼单
  quitOrder() {
    let that = this;
    app.ajax.exitOrder({ order_id: that.data.orderId }).then((res) => {
      if (res.data.state.status == 200) {
        wx.showModal({
          title: "退出成功",
          showCancel: false,
          success: function (res) {
            console.log("*******");
            wx.switchTab({
              url: "/pages/personal/personal", //此处跳转无返回
            });
          },
        });
      }
    })
      .catch((err) => {
        wx.showModal({
          title: "出问题了",
          showCancel: false,
          success: function (res) {

          },
        });
      });
  },
  //创建者 完成拼单
  endOrder() {
    let that = this;
    app.ajax.manageOrder(
      {
        order_id: that.data.orderId,
        order_state: 1,
      }
    ).then((res) => {
      if (res.data.state.status == 200) {
        wx.showModal({
          title: "拼单已完成",
          showCancel: false,
          success: function (res) {
            console.log("*******");
            wx.switchTab({
              url: "/pages/personal/personal", //此处跳转无返回
            });
          },
        });
      }
    })
      .catch((err) => {
        wx.showModal({
          title: "出问题了",
          showCancel: false,
          success: function (res) {

          },
        });
      });
  },
  //创建者 修改拼单 跳转到专用修改页
  modifyOrder() {
    let that = this;
    wx.navigateTo({
      url: "../modifyOrder/modifyOrder",
      success: res => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit("modifyOrderFunction", {
          data: {
            orderDATA: that.data.orderData
          }
        });
      }
    });
  },
  //创建者 取消拼单
  // 这里取消拼单 是直接把拼单状态改为3
  cancelOrder() {
    let that = this;
    app.ajax.manageOrder(
      {
        order_id: that.data.orderId,
        order_state: 2,
      }
    ).then((res) => {
      if (res.data.state.status == 200) {
        wx.showModal({
          title: "拼单已取消",
          showCancel: false,
          success: function (res) {
            console.log("*******");
            wx.switchTab({
              url: "/pages/personal/personal", //此处跳转无返回
            });
          },
        });
      }
    })
      .catch((err) => {
        wx.showModal({
          title: "出问题了",
          showCancel: false,
          success: function (res) {

          },
        });
      });
  },
  /**
   * @method getOrderData
   * @description 获取订单详细数据
   * @param { String } orderId 订单id
   * @return { Promise } orderObj
   */
  getOrderData(orderId) {
    return new Promise((resolve, reject) => {
      var orderObj = {};
      app.ajax
        .getOrderData({ order_id: orderId })
        .then((res) => {
          orderObj = res.data.data;
          resolve(orderObj[0]); //后台改成返回数组了
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  /**
   * @method getShopData
   * @description 获取商家信息
   * @param { String } shopId 商家id
   * @return { Promise } shopObj
   */
  getShopData(shopId) {
    return new Promise((resolve, reject) => {
      var shopObj = {};
      app.ajax
        .getShopData({ business_act_id: shopId })
        .then((res) => {
          shopObj = res.data.data;
          resolve(shopObj);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  /**
   * @method getmakerData
   * @description 获取拼单发起者的信息
   * @param { String } openid 用户的openid
   * @return { Object } makerData
   */
  getmakerData(openid) {
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
