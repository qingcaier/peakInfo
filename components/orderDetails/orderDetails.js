const app = getApp();
import store from "../../store.js";
Component({

  properties: {//父组件传过来的拼单id
    orderId: {
      type: String,
      value: ""
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    orderData: {
      title: "缺200，满500减200！！！", // 拼单标题
      act_type: 1, //拼单类型
      total_count: 5, // 拼单总额
      initiator: {
        openid: "",
        count: 0
      },
      detail:
        "", // 拼单详情
      valid_time: {
        // 拼单有效时长
        day: 0,
        hour: 0,
        minute: 10
      },
      // joinNumber: "1", //参与拼单的人数
      init_time: "2020-04-26T12:46:00.718Z",
      update_time: "2020-04-26T12:46:00.718Z",
      end_time: 1588251360718,
      picture: [
        "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
        "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
        "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
      ],
      business_act_id: "",
      state: 0,
      _id: "",
    },
    shopData: {
      "_id": "5ea5828867f8fa1b24d7155a",
      "act_id": "4413037398733196038",
      "business_name": "至能保险柜",
      "address": "北门街86号附近",
      "ad_info": {
        "adcode": 450921,
        "province": "广西壮族自治区",
        "city": "玉林市",
        "district": "容县"
      },
      "tel": " ",
      "loc": [
        110.557722,
        22.857187
      ],
      "__v": 0
    },
    makerData: {
      "_id": "5ea581c77fc60a49507b6dc2",
      "init_order": [
        "5ea5828867f8fa1b24d7155b",
        "5ea662b5c31d1828c0e58663"
      ],
      "joined_order": [],
      "exit_order": [],
      "openid": "ozQwo43V5q50SIBHDu-s4P7Gy_Ds",
      "nickName": "蔡东林",
      "avatarUrl": "",
      "gender": 1,
      "province": "Guangdong",
      "city": "Guangzhou",
      "country": "China",
      "credit": 0,
      "token": "",
      "state": 0,
      "__v": 0
    },
    distance: 0
  },

  ready: function () {
    // console.log(this.data.orderId);
    let that = this;
    that.getOrderData(that.data.orderId).then(data_o => {
      console.log(data_o);
      that.setData({ orderData: data_o });
      // console.log(that.data.orderData.business_act_id);

      that.getShopData(that.data.orderData.business_act_id).then(data_s => {
        console.log(data_s);
        that.setData({ shopData: data_s });
        let dis = that.computeDistance(
          {
            longitude: that.data.shopData.loc[0],
            latitude: that.data.shopData.loc[1]
          },
          {
            longitude: store.data.userLocation.longitude,
            latitude: store.data.userLocation.latitude
          });
        that.setData({ distance: dis });
      })

      that.getmakerData(that.data.orderData.initiator.openid).then(data_u => {
        console.log(data_u);
        that.setData({ makerData: data_u });
      })


    })


    // var getTime = this.makeTime();
    // console.log(this.properties.someData)
    // this.setData({ "orderData.set_time": getTime.start });
    // this.setData({ "orderData.end_time": getTime.end });
  },

  methods: {
    //时间格式化
    makeTime() {
      var curren_time = new Date();
      var start_time = curren_time.toLocaleString();
      //时间限度，转化为毫秒
      var millisec_offset =
        parseInt(this.data.orderData.valid_time.day) * 24 * 60 * 60 * 1000 +
        parseInt(this.data.orderData.valid_time.hour) * 60 * 60 * 1000 +
        parseInt(this.data.orderData.valid_time.minute) * 60 * 1000;
      //将毫秒数转化成下一个时间
      curren_time.setTime(parseInt(curren_time.getTime()) + millisec_offset);
      var end_time = curren_time.toLocaleString();
      return { start: start_time, end: end_time };
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
        app.ajax.getOrderData({ order_id: orderId })
          .then(
            res => {
              orderObj = res.data.data;
              resolve(orderObj);
            }
          ).catch(
            err => {
              reject(err);
            }
          )
      })
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
        app.ajax.getShopData({ business_act_id: shopId })
          .then(
            res => {
              shopObj = res.data.data;
              resolve(shopObj);
            }
          ).catch(
            err => {
              reject(err);
            }
          )
      })
    },
    /**
     * @method computeDistance      
     * @description  计算距离
     * @param { object,object }  shopLoc userLoc
     * @return { NUmber } distanec
     */
    computeDistance(shopLoc, userLoc) {
      // console.log(shopLoc, userLoc);
      var La1 = shopLoc.latitude * Math.PI / 180.0;
      var La2 = userLoc.latitude * Math.PI / 180.0;
      var La3 = La1 - La2;
      var Lb3 = shopLoc.longitude * Math.PI / 180.0 - userLoc.longitude * Math.PI / 180.0;

      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));

      s = s * 6378.137;//地球半径

      s = Math.round(s * 10000) / 10;//米

      return s
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
        app.ajax.getUserData({ user_openid: openid })
          .then(
            res => {
              makerObj = res.data.data;
              resolve(makerObj);
            }
          ).catch(
            err => {
              reject(err);
            }
          )
      })
    }
  }
});
