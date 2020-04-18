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
    title: String,
    detail: String,

    _typeNumber: Number,
    _remainCount: Number,
    _validTime: Number

    // contain: {
    //   title: String
    // }
  },

  observers: {
    _typeNumber: function() {
      let orderType = "";
      switch (this.data._typeNumber) {
        case 0:
          orderType = "拼件";
          break;
        case 1:
          orderType = "拼额";
          break;
        default:
          break;
      }

      this.setData({
        orderTypeStr: orderType
      });
    },

    _remainCount: function() {
      let remainCountStr = "";
      switch (this.data._typeNumber) {
        case 0:
          remainCountStr = `差${this.data._remainCount}件`;
          break;
        case 1:
          remainCountStr = `差${this.data._remainCount}元`;
          break;
        default:
          break;
      }
      if (this.data._remainCount === 0) {
        remainCountStr = "已满";
      }
      this.setData({
        remainCountStr: remainCountStr
      });
    },

    _validTime: function() {
      let validTime = this.data._validTime / 1000 / 3600 / 24;
      let timeStr = "";
      if (validTime > 1) {
        timeStr = `${Math.ceil(validTime)}天内`;
      } else {
        timeStr = `${Math.ceil(validTime * 24)}小时内`;
      }
      this.setData({
        validTimeStr: timeStr
      });
    }
  },

  methods: {
    // showOrderType(type) {}
    onClick: function() {
      let myEventDetail = {};
      let myEventOption = {};
      this.triggerEvent("onClick", myEventDetail, myEventOption);
    }
  }
});
