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
      // title: "", // 拼单标题
      // act_type: 1, //拼单类型
      // total_count: 5, // 拼单总额
      // initiator: {
      //   openid: "",
      //   count: 0
      // },
      // detail:
      //   "", // 拼单详情
      // valid_time: {
      //   // 拼单有效时长
      //   day: 0,
      //   hour: 0,
      //   minute: 10
      // },
      // // joinNumber: "1", //参与拼单的人数
      // init_time: "2020-04-26T12:46:00.718Z",
      // update_time: "2020-04-26T12:46:00.718Z",
      // end_time: 1588251360718,
      // picture: [
      //   "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
      //   "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
      //   "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
      // ],
      // business_act_id: "",
      // state: 0,
      // _id: "",
    },
    shopData: {
      // "_id": "5ea5828867f8fa1b24d7155a",
      // "act_id": "4413037398733196038",
      // "business_name": "至能保险柜",
      // "address": "北门街86号附近",
      // "ad_info": {
      //   "adcode": 450921,
      //   "province": "广西壮族自治区",
      //   "city": "玉林市",
      //   "district": "容县"
      // },
      // "tel": " ",
      // "loc": [
      //   110.557722,
      //   22.857187
      // ],
      // "__v": 0
    },
    makerData: {
      // "_id": "5ea581c77fc60a49507b6dc2",
      // "init_order": [
      //   "5ea5828867f8fa1b24d7155b",
      //   "5ea662b5c31d1828c0e58663"
      // ],
      // "joined_order": [],
      // "exit_order": [],
      // "openid": "ozQwo43V5q50SIBHDu-s4P7Gy_Ds",
      // "nickName": "蔡东林",
      // "avatarUrl": "",
      // "gender": 1,
      // "province": "Guangdong",
      // "city": "Guangzhou",
      // "country": "China",
      // "credit": 0,
      // "token": "",
      // "state": 0,
      // "__v": 0
    },
    canJoin: true, //显示拼单按钮,
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
  onLoad: function (options) {
    let that = this;
    //	获取所有打开的EventChannel事件
    const eventChannel = this.getOpenerEventChannel();
    // 监听
    eventChannel.on("dataFormFather", (res) => {
      that.setData({ orderId: res.data.order_id });

      that.setData({ canJoin: res.data.canJoin });
      // console.log(888, that.data.canJoin, res.data.canJoin);
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
        success: function (res) {},
      });
    } else {
      this.setData({
        dialogShow: true,
      });
    }
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
