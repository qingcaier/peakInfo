Component({
  behaviors: [],

  options: {
    multipleSlots: true,
    pureDataPattern: /^_/
  },

  data: {
    // business_name: "以纯",
    // type: 0
    // orderType: ""
  },

  properties: {
    img: String,
    name: String,
    // type: String,

    // period: String,
    site: String,

    _point: Number,
    _state: Number
  },

  observers: {
    // _typeNumber: function() {
    //   let orderType = "";
    //   switch (this.data._typeNumber) {
    //     case 0:
    //       orderType = "拼件";
    //       break;
    //     case 1:
    //       orderType = "拼额";
    //       break;
    //     default:
    //       break;
    //   }
    //   this.setData({
    //     orderTypeStr: orderType
    //   });
    // }

    _point: function() {
      this.setData({
        point: `*${this.data._point}点积分*`
      });
    },

    _state: function() {
      let stateText = "",
        state = false;
      switch (this.data._state) {
        case 0:
          stateText = "未完成";
          state = false;
          break;
        case 1:
          stateText = "已完成";
          state = true;
          break;
        default:
          break;
      }

      this.setData({
        stateText,
        state
      });
    }
  },

  methods: {
    // 绑定点击事件
    onTap: function() {
      this.setData({
        isClicked: !this.data.isClicked
      });
      let myEventDetail = {};
      let myEventOption = {};
      this.triggerEvent("onClick", myEventDetail, myEventOption);
    }
  }
});
