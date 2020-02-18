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
    businessName: String,
    address: String,

    _distance: Number
  },

  observers: {
    _distance: function() {
      let distance = "";
      if (this.data._distance >= 1000) {
        distance =
          Math.round((Math.round(this.data._distance) / 1000) * 100) / 100 +
          "km";
      } else {
        distance = Math.round(this.data._distance) + "m";
      }
      this.setData({
        distanceStr: distance
      });
    }
  },

  methods: {
    // showOrderType(type) {}
  }
});
