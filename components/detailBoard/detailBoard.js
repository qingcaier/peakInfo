Component({
  behaviors: [],

  // options: {
  //   multipleSlots: true,
  //   pureDataPattern: /^_/
  // },

  data: {
    isShowGallery: false
  },

  properties: {
    name: String,
    type: String,
    period: String,
    site: String,
    introduction: String,
    picList: Array,
    icon: String,
    location: Array,
    isNeedWrap: {
      type: Boolean,
      default: false
    }
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

  methods: {
    showGallery() {
      this.setData({
        isShowGallery: true
      });
    }
  }
});
