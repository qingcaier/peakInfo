Component({
  //传参，暂时为空
  properties: {
    someData: {
      type: String,
      value: "dafault value"
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    orderData: {
      title: "缺200，满500减200！！！", // 拼单标题
      act_type: "1", //拼单类型
      total_count: "500", // 拼单总额
      current_count: "300", // 目前（发起者）的拼额
      detail:
        "我已经买了300块的衣服，还差200块达到满减的条件，我们在店里面等待10分钟，想来的从速", // 拼单详情
      time: {
        // 拼单有效时长
        day: 0,
        hour: 0,
        minute: 10
      },
      joinNumber: "1", //参与拼单的人数
      set_time: "xxxx.xx.xx xx:xx",
      end_time: "xxxx.xx.xx xx:xx",
      picture: [
        "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
        "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
        "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
      ]
    },
    storeData: {
      name: "以纯",
      position: "广州大学城",
      distance: "5km"
    },
    makerData: {
      icon: "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
      name: "程序员",
      success_order: "12"
    }
  },

  ready: function() {
    var getTime = this.makeTime();
    // console.log(this.properties.someData)
    this.setData({ "orderData.set_time": getTime.start });
    this.setData({ "orderData.end_time": getTime.end });
  },

  methods: {
    //时间格式化
    makeTime() {
      var curren_time = new Date();
      var start_time = curren_time.toLocaleString();
      //时间限度，转化为毫秒
      var millisec_offset =
        parseInt(this.data.orderData.time.day) * 24 * 60 * 60 * 1000 +
        parseInt(this.data.orderData.time.hour) * 60 * 60 * 1000 +
        parseInt(this.data.orderData.time.minute) * 60 * 1000;
      //将毫秒数转化成下一个时间
      curren_time.setTime(parseInt(curren_time.getTime()) + millisec_offset);
      var end_time = curren_time.toLocaleString();
      return { start: start_time, end: end_time };
    }
  }
});
