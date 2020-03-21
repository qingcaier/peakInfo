const Puzzle = require("./puzzle.class");
Component({
  behaviors: [],

  options: {
    // multipleSlots: true,
    // pureDataPattern: /^_/
  },

  data: {
    imgPoints: [],
    // imgArr: [
    //   "https://rattenking.gitee.io/stone/images/wx/images/quanyecha.jpg",
    //   "https://rattenking.gitee.io/stone/images/wx/images/haidao.jpg",
    //   "https://rattenking.gitee.io/stone/images/wx/images/mingren1.jpg",
    //   "https://rattenking.gitee.io/stone/images/wx/images/qilongzhu1.jpg",
    //   "https://rattenking.gitee.io/stone/images/wx/images/quanye.jpg"
    // ],
    imgUrl: "",

    isSuccess: false,

    WIDTH: 0,
    HEIGHT: 0,
    width: 0,
    height: 0,
    status: false,
    trans: 0,
    currentX: 0,
    currentY: 0,
    currentPX: 0,
    currentPY: 0
    // type: {
    //   typeX: 3,
    //   typeY: 4
    // }
  },

  properties: {
    // img: String,
    // title: String,
    // detail: String,
    // _typeNumber: Number,
    // _remainCount: Number,
    // _validTime: Number
    // contain: {
    //   title: String
    // }
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      // this.getImage(imgPath);
      new Puzzle(this);
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
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
    isSuccess: function() {
      // if (this.data.isSuccess) {
      var myEventDetail = { isSuccess: this.data.isSuccess }; // detail对象，提供给事件监听函数
      var myEventOption = {}; // 触发事件的选项
      this.triggerEvent("myevent", myEventDetail, myEventOption);
      // }
    }
  },

  methods: {
    // getType(e) {
    //   this.setData({
    //     trans: -this.data.WIDTH,
    //     type0: e.currentTarget.dataset.type
    //   });
    //   this.puzzle = new Puzzle(this, {
    //     type: e.currentTarget.dataset.type
    //   });
    // },
    // getUrl(e) {
    //   this.setData({
    //     trans: -this.data.WIDTH * 2,
    //     imgUrl: e.currentTarget.dataset.url
    //   });
    // },
    getImage(imagePath) {
      this.setData({
        imgUrl: imagePath
      });
    }
  }
});
