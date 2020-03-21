import store from "../../store.js";
import create from "../../utils/create.js";

const Func = require("../../public/util/func");
const func = new Func();

const app = getApp();

let mapContext; // 地图对象

// 生成marker对象
let createMarker = function(obj) {
  return {
    // id: 0,
    dataID: obj.dataID,
    // _distance: obj._distance,
    // isSelected: false,
    iconPath: obj.icon,
    latitude: obj.location[1],
    longitude: obj.location[0],
    width: 40,
    height: 40
    // zIndex: 1000,
    // callout: {
    //   content: "打卡",
    //   color: "#ffffff",
    //   fontSize: 15,
    //   borderRadius: 8,

    //   bgColor: "#990033",
    //   display: "ALWAYS",
    //   padding: 10,
    //   textAlign: "center"
    // }
    // label: {
    //   content: "打卡",
    //   color: "#ffffff",
    //   fontSize: 15,
    //   borderRadius: 8,

    //   bgColor: "#990033",
    //   padding: 10,
    //   // anchorX:
    //   // anchorY: 0,
    //   textAlign: "center",
    //   anchorX: -70,
    //   anchorY: -35
    // }
  };
};

create(store, {
  data: {
    location: {
      lng: 113.27,
      lat: 23.13
    }, // 地图中心定位
    userLocation: {}, // 用户定位
    markers: [],
    mapScale: 17,

    isSelected: false, // 当前是否有选中商家

    currentBuildingId: "", // 当前选中建筑的标识id

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
    }
  },
  onLoad: async function(option) {
    mapContext = wx.createMapContext("map");
    // console.log(111);
    // mapContext.setCenterOffset({
    //   offset: [0.3, 0.75],
    //   success: res => {
    //     console.log(res);
    //   },
    //   fail: err => {
    //     console.log(err);
    //   }
    // });
    // console.log(22222);

    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptDataFromOpenerPage", data => {
      console.log("参数参数", data);
      if (data.data._id) {
        // 记录从哪个建筑进入地图
        this.setData({
          currentBuildingId: data.data._id
        });
      }
    });

    await this.getUserLocation();

    // 模拟点击请求建筑详情
    if (this.data.currentBuildingId) {
      let targetBuildingIndex = this.data.markers.findIndex(
        item => item.dataID === this.data.currentBuildingId
      );

      this.getBuildingDetail(targetBuildingIndex);
    }
  },
  onShow: function() {},
  onReady: function() {},

  // 获取当前定位并请求附近的历史建筑
  getUserLocation: function() {
    // 获取自身位置（地址逆解析）
    return new Promise((resolve, reject) => {
      app.qqMap.reverseGeocoder({
        // location: {
        //   latitude,
        //   longitude
        // },
        ger_poi: 1,
        success: res => {
          console.log(res.status, res.message);
          console.log(res.result);

          let currentLocation = res.result.location;

          this.setData({
            userLocation: currentLocation
          });

          // this.store.data.userLocation = { latitude, longitude }; // 将当前位置存在westore
          // this.update();

          console.log(
            "当前距离广州市中心距离",
            func.getDistance(currentLocation, this.data.location)
          );

          if (func.getDistance(currentLocation, this.data.location) < 100000) {
            // 如果用户在距离建筑群不远，则以用户为地图中心显示用户周围建筑
            this.setData({
              location: currentLocation
            });

            // 请求附近的建筑景点
            // app.ajax
            //   .checkMap({
            //     location: currentLocation,
            //     // distance: scaleToDistance()
            //     distance: func.scaleToDistance()
            //   })
            //   .then(res => {
            //     console.log("附近的建筑景点", res.data);
            //     let NeightBuildings = res.data.data;
            let NeightBuildings = [
              {
                dataID: "5e672353ac7fc1aed18a3d9e",
                // location: [113.250794, 23.109609],
                location: [116.30527, 23.61248],
                icon: "thumbnails/thumbnails_1517380760284.jpg"
              }
            ];
            let markersList = [];

            for (let i in NeightBuildings) {
              let marker = {};
              marker = createMarker(NeightBuildings[i]);
              marker.id = Number(i);
              markersList.push(marker);
            }

            console.log(markersList);
            this.setData({
              markers: markersList
            });

            resolve();
            // });
          } else {
            // // 请求市中心附近的建筑景点
            // app.ajax
            //   .checkMap({
            //     location: this.data.location,
            //     // distance: scaleToDistance()
            //     distance: func.scaleToDistance()
            //   })
            //   .then(res => {
            //     console.log("附近的建筑景点", res.data);
            //     let NeightBuildings = res.data.data;
            let NeightBuildings = [
              {
                dataID: "5e672353ac7fc1aed18a3d9e",
                // location: [113.250794, 23.109609],
                location: [116.30527, 23.61248],
                icon: "thumbnails/thumbnails_1517380760284.jpg"
              }
            ];
            let markersList = [];

            for (let i in NeightBuildings) {
              let marker = {};
              marker = createMarker(NeightBuildings[i]);
              marker.id = Number(i);
              markersList.push(marker);
            }

            console.log(markersList);
            this.setData({
              markers: markersList
            });

            resolve();
            // });
          }
        },
        fail: res => {
          console.log(res.status, res.message);
        },
        complete: res => {
          console.log(res.status, res.message);
        }
      });
    });
  },

  // 关闭详情浮窗
  closeBuildingDetailTap() {
    this.setData({
      [`markers[${this.data.currentBuilding}].width`]: 40,
      [`markers[${this.data.currentBuilding}].height`]: 40,
      // [`markers[${e.markerId}].iconPath`]:
      isSelected: false,
      currentBuilding: -1,
      currentBuildingId: ""
    });
  },

  // 查看建筑详情
  getBuildingDetail(idx) {
    // 获取缓存里的建筑详情
    let localBuildingDetailList = wx.getStorageSync("localBuildingDetailList");
    if (!localBuildingDetailList) {
      wx.setStorageSync("localBuildingDetailList", []);
      localBuildingDetailList = wx.getStorageSync("localBuildingDetailList");
    }

    // 获取当前建筑在markers中的对象
    let targetBuilding = this.data.markers.filter(item => item.id === idx)[0];

    console.log("缓存", localBuildingDetailList);
    console.log("emmm", targetBuilding);

    // 判断localStorage中是否有该建筑的详情缓存
    let buildingHasExist = localBuildingDetailList.findIndex(
      item => item.dataID === targetBuilding.dataID
    );

    if (buildingHasExist === -1) {
      // // 如果没有缓存该建筑详情
      // // 发起详情请求
      // app.ajax
      //   .getSingleDetail({
      //     act_id: targetBuilding.dataID
      //   })
      //   .then(res => {
      //     console.log(res.data);
      //     let result = res.data.data;
      // let currentBuild_detail = {
      //   // 建筑详情
      // };
      let currentBuild_detail = {
        dataID: "5e672353ac7fc1aed18a3d9e",
        name: "华南土特产展览交流大会旧址手工业馆",
        type: "重要历史事件及人物活动纪念地",
        period: "1950-1970年代(1950-1979)",
        site: "广州市荔湾区西堤二马路37号文化公园第七展馆",
        introduction:
          "华南土特产展览交流大会手工业馆是该展会的第七展馆， 建筑师为铁路局工程师郭尚德先生。展馆为一层，建筑面积 1470 平方米 . 平面采用中轴对称的“十字形”旋转 45 度布局，主入 口朝东面向广场，南、北、西侧均设有次出入口。由一个环形空 间统领四个矩形展览空间，展览路线流畅不重复，争取最大的展 览面积。环形大厅中央设有圆形庭院，利于展厅的采光通风、美 化环境，又可用作室外临时展场。手工业馆的立面造型朴素、简 洁大方，外墙刷米黄色石灰。环形大厅采用长条的高窗，矩形展 厅设水平带形高窗，入口出挑雨篷以纤细的柱子支撑，亲切自然。.",
        picList: [
          "GZ_01_0003_华南土特产展览交流大会旧址手工业馆/crop-建筑整体透视或立面2.jpg",
          "GZ_01_0003_华南土特产展览交流大会旧址手工业馆/crop-细部1.jpg",
          "GZ_01_0003_华南土特产展览交流大会旧址手工业馆/crop-细部3.jpg",
          "GZ_01_0003_华南土特产展览交流大会旧址手工业馆/crop-周边环境1.jpg"
        ],
        icon: "thumbnails/thumbnails_1517380760284.jpg",
        // location: [113.250794, 23.109609]
        location: [116.30527, 23.61248]
      };

      localBuildingDetailList.push(currentBuild_detail);
      wx.setStorageSync("localBuildingDetailList", localBuildingDetailList);

      this.setData({
        building_detail: currentBuild_detail,
        [`markers[${idx}].width`]: 60,
        [`markers[${idx}].height`]: 60,
        [`markers[${idx}].iconPath`]: currentBuild_detail.icon,
        isSelected: true,
        currentBuilding: idx,
        currentBuildingId: currentBuild_detail.dataID
        // location: {
        //   lat: targetBuilding.latitude,
        //   lng: targetBuilding.longitude
        // }
      });
      // });
    } else {
      // 缓存存在当前建筑详情
      let currentBuild_detail = localBuildingDetailList[buildingHasExist];
      this.setData({
        building_detail: currentBuild_detail,
        [`markers[${idx}].width`]: 60,
        [`markers[${idx}].height`]: 60,
        [`markers[${idx}].iconPath`]: currentBuild_detail.icon,
        isSelected: true,
        currentBuilding: idx,
        currentBuildingId: currentBuild_detail.dataID
        // location: {
        //   lat: targetBuilding.latitude,
        //   lng: targetBuilding.longitude
        // }
      });
    }
  },

  // 点击icon
  markertap(e) {
    console.log(e);
    if (this.data.currentBuilding === e.markerId) {
      // 避免用户重复点同一建筑，重复拉取详情
      return;
    }

    this.getBuildingDetail(e.markerId);
  },

  // 地图视野变化事件
  regionchange(e) {
    console.log(e);
    if (e.type !== "end") {
      return;
    }
    if (e.causedBy === "update") {
      return;
    }
    // const mapContext = wx.createMapContext("map", this);
    mapContext.getScale({
      success: res => {
        console.log(res);

        mapContext.getCenterLocation({
          success: response => {
            console.log(response);
            if (res.scale === 18 && res.scale === 3) {
              return;
            }

            // this.setData({
            //   location: {
            //     lng: response.longitude,
            //     lat: response.latitude
            //   }
            // })

            // app.ajax
            //   .checkMap({
            //     location: {
            //       lng: response.longitude,
            //       lat: response.latitude
            //     },
            //     distance: func.scaleToDistance(res.scale)
            //   })
            //   .then(resp => {
            //     console.log(resp);
            //     console.log("附近的商家活动", resp.data);
            //     let NeightBuildings = resp.data.data;
            let NeightBuildings = [
              {
                dataID: "5e672353ac7fc1aed18a3d9e",
                // location: [113.250794, 23.109609],
                location: [116.30527, 23.61248],
                icon: "thumbnails/thumbnails_1517380760284.jpg"
              }
            ];

            let markersList = [];

            for (let i in NeightBuildings) {
              let marker = {};
              marker = createMarker(NeightBuildings[i]);
              marker.id = Number(i);
              markersList.push(marker);
            }
            console.log(markersList);
            this.setData({
              markers: markersList
            });

            if (this.data.isSelected) {
              // 地图视野变化但当前选中的建筑详情不变
              let currentBuild = markersList.findIndex(
                item => item.dataID === this.data.currentBuildingId
              );
              this.getBuildingDetail(currentBuild);
            }

            // });
            // });
          },
          fail: err => {
            console.log(err);
          }
        });
      },
      fail: err => {
        console.log(err);
      }
      // complete: response => {
      //   console.log(response);
      // }
    });
  }

  // debounceChange()
});
