import store from "../../store.js";
import create from "../../utils/create.js";

const Func = require("../../public/util/func");
const func = new Func();

const app = getApp();

create(store, {
  data: {
    // 当前选中建筑的详细信息
    building_detail: {
      // dataID: "5e5ec707d507a2c05e3ed5f2",
      // name: "霍芝庭公馆旧址",
      // type: "名人故旧居",
      // period: "中华民国",
      // site: "广州市越秀区解放北路22号",
      // introduction:
      //   "霍芝庭公馆旧址位于广东省广州市越秀区解放北路542号，曾为霍芝庭旧居以及他所开设的广东第一大赌馆。民国时期建筑，坐东朝西，宽约19米，深约31米，占地面积约为673平方米.",
      // picList: [
      //   "http://q5fehazdc.bkt.clouddn.com/GZ_01_0003_华南土特产展览交流大会旧址手工业馆/crop-建筑整体透视或立面2.jpg",
      //   "http://q5fehazdc.bkt.clouddn.com/GZ_01_0003_华南土特产展览交流大会旧址手工业馆/crop-细部1.jpg",
      //   "http://q5fehazdc.bkt.clouddn.com/GZ_01_0003_华南土特产展览交流大会旧址手工业馆/crop-细部3.jpg",
      //   "http://q5fehazdc.bkt.clouddn.com/GZ_01_0003_华南土特产展览交流大会旧址手工业馆/crop-周边环境1.jpg"
      // ],
      // icon:
      //   "http://q5fehazdc.bkt.clouddn.com/thumbnails/thumbnails_1517380760284.jpg",
      // location: [113.250794, 23.109609]
    },

    successTip: "**拼图成功，获得50点积分**",
    isShowSuccessTip: false,
  },
  onLoad: function () {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptDataFromOpenerPage", (data) => {
      console.log("参数参数", data);
      this.setData({
        building_detail: data.building_detail,
      });

      this.puzzle = this.selectComponent("#puzzle");

      let imagePath = data.building_detail.picList[1];
      this.puzzle.getImage(imagePath);
    });
  },
  onShow: function () {},
  onReady: function () {},

  onMyEvent(e) {
    console.log("拼图成功时触发", e);
    if (e.detail.isSuccess) {
      app.ajax
        .finishJigsaw({
          dataID: this.data.building_detail._id,
          credit: app.globalData.credit,
        })
        .then((res) => {
          console.log(res);
          let result = res.data.state;

          // let result = {
          //   status: 200,
          //   msg: "成功！"
          // };
          if (result.status === 200) {
            this.setData({
              isShowSuccessTip: true,
            });
          }
        });
    }
  },

  // debounceChange()
});
