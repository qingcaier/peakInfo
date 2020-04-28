
import store from "../../store.js";
Component({

  properties: {//父组件传过来的
    orderData: {
      type: Object,
      value: {}
    },
    shopData: {
      type: Object,
      value: {}
    },
    makerData: {
      type: Object,
      value: {}
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    // orderData: {
    //   title: "", // 拼单标题
    //   act_type: 1, //拼单类型
    //   total_count: 5, // 拼单总额
    //   initiator: {
    //     openid: "",
    //     count: 0
    //   },
    //   detail:
    //     "", // 拼单详情
    //   valid_time: {
    //     // 拼单有效时长
    //     day: 0,
    //     hour: 0,
    //     minute: 10
    //   },
    //   // joinNumber: "1", //参与拼单的人数
    //   init_time: "2020-04-26T12:46:00.718Z",
    //   update_time: "2020-04-26T12:46:00.718Z",
    //   end_time: 1588251360718,
    //   picture: [
    //     "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
    //     "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
    //     "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
    //   ],
    //   business_act_id: "",
    //   state: 0,
    //   _id: "",
    // },
    // shopData: {
    //   "_id": "5ea5828867f8fa1b24d7155a",
    //   "act_id": "4413037398733196038",
    //   "business_name": "至能保险柜",
    //   "address": "北门街86号附近",
    //   "ad_info": {
    //     "adcode": 450921,
    //     "province": "广西壮族自治区",
    //     "city": "玉林市",
    //     "district": "容县"
    //   },
    //   "tel": " ",
    //   "loc": [
    //     110.557722,
    //     22.857187
    //   ],
    //   "__v": 0
    // },
    // makerData: {
    //   "_id": "5ea581c77fc60a49507b6dc2",
    //   "init_order": [
    //     "5ea5828867f8fa1b24d7155b",
    //     "5ea662b5c31d1828c0e58663"
    //   ],
    //   "joined_order": [],
    //   "exit_order": [],
    //   "openid": "ozQwo43V5q50SIBHDu-s4P7Gy_Ds",
    //   "nickName": "蔡东林",
    //   "avatarUrl": "",
    //   "gender": 1,
    //   "province": "Guangdong",
    //   "city": "Guangzhou",
    //   "country": "China",
    //   "credit": 0,
    //   "token": "",
    //   "state": 0,
    //   "__v": 0
    // },
    distance: 0,//距离
    endTime: '',//计算出的时间
    update_time: ""//剪切好的时间
  },
  lifetimes: {
    // 组件生命周期声明对象，将组件的生命周期收归到该字段进行声明，
    // 原有声明方式仍旧有效，如同时存在两种声明方式，则lifetimes字段内声明方式优先级最高
    attached() {
      this.initData()
    },
  },

  //数值监听
  observers: {
    'orderData': function () {
      this.initData()
    },
    'shopData': function () {
      this.initData()
    }
  },
  ready: function () {
  },

  methods: {
    /**
     * @method initData 
     * @description 页面数据初始化的修改 
     */
    initData() {
      let that = this;
      if (that.data.orderData.update_time && that.data.orderData.end_time) {
        var update_t = that.butyTime(that.data.orderData.update_time);
        console.log(222, update_t);
        that.setData({ update_time: update_t });
        var endT = that.makeTime(that.data.orderData.end_time);
        console.log(333, endT);
        that.setData({ endTime: endT });
      }
      if (that.data.shopData.loc) {
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
      }
    },
    /**
     * @method  makeTime
     * @description  毫秒的时间转化为正常时间
     * @param { String }  
     * @return { String } 
     */
    //时间格式化
    makeTime(strDate) {
      // console.log(strDate);
      var end_time = new Date(strDate);
      var year = end_time.getFullYear();//年
      var month = end_time.getMonth() + 1;//月  莫名少了一个月
      var day = end_time.getDate();//日
      var hours = end_time.getHours();//时
      var min = end_time.getMinutes();//分
      var second = end_time.getSeconds();//秒
      return year + "-" + month + "-" + day + " " + hours + ":" + min + ":" + second;
    },
    /**
     * @method butyTime 
     * @description 时间字符串美化 
     * @param { String } timeStr 
     * @return { String } 
     */
    butyTime(timeStr) {
      try {
        let arr = timeStr.split(/T|\./);
        if (arr.length == 1) {
          return arr[0]
        }
        return arr[0] + arr[1]
      } catch (error) {
        return null
      }

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


  }
});
