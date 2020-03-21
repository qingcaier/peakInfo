Component({
  behaviors: [],

  // options: {
  //   multipleSlots: true,
  //   pureDataPattern: /^_/
  // },

  data: {},

  properties: {
    name: String,
    type: String,
    period: String,
    site: String
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
    // },
  },

  methods: {}
});
