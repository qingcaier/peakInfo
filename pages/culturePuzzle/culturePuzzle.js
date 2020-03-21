import store from "../../store.js";
import create from "../../utils/create.js";

const Func = require("../../public/util/func");
const func = new Func();

const app = getApp();

let mapContext; // 地图对象

// 地图气泡
const callout = {
  content: " 拼图 ",
  color: "#ffffff",
  fontSize: 15,
  borderRadius: 8,

  bgColor: "#990033",
  display: "ALWAYS",
  padding: 10,
  textAlign: "center"
};

// 生成markers
let createMarkers = function(objArr) {
  let markers = [];
  for (let i in objArr) {
    let marker = {};
    marker.id = Number(i);
    marker.dataID = objArr[i].dataID;
    // marker.iconPath = objArr[i].icon;
    marker.icon = objArr[i].icon; // 原始icon
    marker.latitude = objArr[i].location[1];
    marker.longitude = objArr[i].location[0];
    marker.width = 40;
    marker.height = 40;

    marker.callout = callout;

    markers.push(marker);
  }

  return markers;
};

create(store, {
  data: {
    location: {
      lng: 113.250794,
      lat: 23.109609
    }, // 地图中心定位
    userLocation: {}, // 用户定位
    markers: [],

    mapScale: 17, // 地图比例
    effectDistance: 50, // 有效距离

    currentBuildingId: "", // 当前选中建筑的标识id

    isMarkerTap: false, // 当前是否通过icon点击选中建筑景点
    isCalloutTap: false, // 当前是否通过点击气泡选中建筑景点

    // 当前选中建筑的详细信息
    building_detail: {}
  },
  onLoad: async function() {
    mapContext = wx.createMapContext("map");

    let mapLocation = await this.getUserLocation(); // 获取任务建筑群中心经纬度

    await this.getMarkers(mapLocation);
  },
  onShow: function() {
    let currentIndex = this.data.currentBuilding;
    if (currentIndex > -1) {
      let tempMarker = this.data.markers[currentIndex];
      this.setData({
        [`markers[${currentIndex}].width`]: 40,
        [`markers[${currentIndex}].height`]: 40,
        [`markers[${currentIndex}].iconPath`]: tempMarker.nativeIcon,
        isMarkerTap: false,
        isCalloutTap: false,
        currentBuilding: -1,
        currentBuildingId: ""
      });
    }
    this.refreshMap();
  },
  onReady: function() {},

  // 刷新地图
  refreshMap: function() {
    mapContext.getScale({
      success: res => {
        console.log(res);

        mapContext.getCenterLocation({
          success: async response => {
            console.log(response);

            let centerLocation = {
                lng: response.longitude,
                lat: response.latitude
              },
              scale = res.scale;
            if (res.scale === 18 && res.scale === 3) {
              return;
            }

            let markersList = await this.getMarkers(centerLocation, scale);

            if (this.data.isMarkerTap || this.data.isCalloutTap) {
              // console.log("什么鬼");
              // console.log(markersList);
              // 地图视野变化但当前选中的建筑详情不变
              let currentBuild = markersList.findIndex(
                item => item.dataID === this.data.currentBuildingId
              );
              // console.log("当前id", currentBuild);
              if (this.data.isMarkerTap) {
                // console.log("什么鬼2");
                this.getBuildingDetail(currentBuild, "markertap");
              }
              if (this.data.isCalloutTap) {
                // console.log("什么鬼3");
                this.getBuildingDetail(currentBuild, "callouttap");
              }
            }
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
  },

  // 渲染地图上markers
  getMarkers: async function(location, scale) {
    let markersList = await this.getNeightBuildings(location, scale); // 请求周围建筑

    let dataIDList = markersList.map(item => item.dataID);
    console.log(dataIDList);

    let completeBuildingsList = await this.getCompleteBuildings(dataIDList); // 获取任务建筑信息
    console.log(completeBuildingsList);

    // let otherMarkers = markersList.filter(item => {
    //   let objIndex = data.findIndex(item1 => item1.dataID === item.dataID);
    //   if (objIndex === -1) {
    //     return item;
    //   }
    // });

    // let totalMarkers = data.concat(otherMarkers);
    let markers = createMarkers(markersList);
    console.log(markers);
    for (let i in markers) {
      if (completeBuildingsList.includes(markers[i].dataID)) {
        // 已拼图的建筑图标样式
        markers[i].iconPath = func.handlePictureWatermark(
          markers[i].icon,
          "hs"
        );

        // 记住默认图标样式
        markers[i].nativeIcon = func.handlePictureWatermark(
          markers[i].icon,
          "hs"
        );
      } else {
        // 普通建筑图标样式
        markers[i].iconPath = func.handlePictureWatermark(
          markers[i].icon,
          "bs"
        );

        // 记住默认图标样式
        markers[i].nativeIcon = func.handlePictureWatermark(
          markers[i].icon,
          "bs"
        );
      }
    }

    this.setData({
      location: location,
      markers: markers
    });
    return markers;
  },

  // 获取用户当前位置的经纬度
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
          let defaultLocation = this.data.location;

          console.log(
            "当前距离广州市中心距离",
            func.getDistance(currentLocation, defaultLocation)
          );

          this.setData({
            userLocation: currentLocation
          });

          if (func.getDistance(currentLocation, defaultLocation) < 100000) {
            // 如果用户在距离建筑群不远，则以用户为地图中心显示用户周围建筑
            resolve(currentLocation);
          } else {
            resolve(defaultLocation);
          }
        },
        fail: res => {
          console.log(res.status, res.message);
          reject(res);
        },
        complete: res => {
          console.log(res.status, res.message);
        }
      });
    });
  },

  // 获取符合指定位置与距离的附近的建筑景点
  getNeightBuildings(currentLocation, scale) {
    return new Promise((resolve, reject) => {
      // app.ajax
      //   .checkMap({
      //     location: currentLocation,
      //     distance: func.scaleToDistance(scale)
      //   })
      //   .then(res => {
      //     console.log("附近的建筑景点", res.data);
      //     let NeightBuildings = res.data.data;
      let NeightBuildings = [
        {
          dataID: "5e6baece6332a87c83a47569",
          location: [113.250794, 23.109609],
          icon: "http://cdn.cdlshow.xyz/thumbnails/thumbnails_1517380760284.jpg"
        },
        {
          dataID: "5e6baece6332a87c83a4756a",
          location: [113.24992, 23.110121],
          icon: "http://cdn.cdlshow.xyz/thumbnails/thumbnails_1517381296606.jpg"
        },
        {
          dataID: "5e6baed06332a87c83a47593",
          location: [113.251311306424, 23.110179578994],
          icon: "http://cdn.cdlshow.xyz/thumbnails/thumbnails_1517380286101.jpg"
        }
      ];

      resolve(NeightBuildings);
    });
    // .catch(err => {
    //   reject(err)
    // })
    // });
  },

  // 获取用户已拼图的建筑
  getCompleteBuildings(dataIDList) {
    return new Promise((resolve, reject) => {
      //   app.ajax.XXXX({
      //     dataIDList
      //   }).then(res => {
      //     console.log(res);
      //     let result = res.data.data;

      let result = ["5e6baece6332a87c83a47569", "5e6baece6332a87c83a4756a"];

      resolve(result);
      // });
    });
    // .catch(err => {
    //   reject(err);
    // });
  },

  // 打开我的拼图浮窗
  setMyPuzzle: function() {
    // 请求我的拼图列表
    // app.ajax.XXXX().then(res => {
    //   console.log(res.data);
    //   let result = res.data.data;

    let result = [
      {
        dataID: "5e6baece6332a87c83a47569",
        name: "告诉我而沃尔特华南土特产展览交流大会旧址手工业馆",
        type: "重要历史事件及人物活动纪念地",
        period: "1950-1970年代(1950-1979)",
        site: "广州市荔湾区西堤二马路37号文化公园第七展馆",
        icon: "http://cdn.cdlshow.xyz/thumbnails/thumbnails_1517380760284.jpg"
      },
      {
        dataID: "5e6baece6332a87c83a47569",
        name: "华南土特产展览交流大会旧址手工业馆",
        type: "重要历史事件及人物活动纪念地",
        period: "1950-1970年代(1950-1979)",
        site: "广州市荔湾区西堤二马路37号文化公园第七展馆",
        icon: "http://cdn.cdlshow.xyz/thumbnails/thumbnails_1517380760284.jpg"
      }
    ];

    let newPuzzlesList = [];
    for (let i in result) {
      let arr = result[i];

      arr.icon = func.handlePictureWatermark(result[i].icon, "hs");

      newPuzzlesList.push(arr);
    }

    this.setData({
      isSelectedMyPuzzle: true,
      myPuzzle: newPuzzlesList
    });

    // });
  },

  // 关闭我的拼图浮窗
  closeMyPuzzleTap: function() {
    this.setData({
      isSelectedMyPuzzle: false
    });
  },

  // 我的拼图跳转到对应建筑详情
  toDetail: function(e) {
    console.log(e);

    wx.navigateTo({
      // url: `../../pages/cultureMap/cultureMap?buildingID=${e.currentTarget.dataset.buildingid}`,
      url: "../../pages/cultureMap/cultureMap",
      success: res => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit("acceptDataFromOpenerPage", {
          data: {
            _id: e.currentTarget.dataset.buildingid
          }
        });
      }
    });
  },

  // 关闭详情浮窗
  closeBuildingDetailTap: function() {
    // this.refreshMap();
    let currentIndex = this.data.currentBuilding;
    let tempMarker = this.data.markers[currentIndex];
    this.setData({
      [`markers[${currentIndex}].width`]: 40,
      [`markers[${currentIndex}].height`]: 40,
      [`markers[${currentIndex}].iconPath`]: tempMarker.nativeIcon,
      isMarkerTap: false,
      isCalloutTap: false,
      currentBuilding: -1,
      currentBuildingId: ""
    });
  },

  // 查看建筑详情
  async getBuildingDetail(idx, type) {
    // 判断由哪种事件触发
    let isSelected = "";
    switch (type) {
      case "markertap":
        isSelected = "isMarkerTap";
        break;
      case "callouttap":
        isSelected = "isCalloutTap";
        break;
      default:
        break;
    }

    // 获取缓存里的建筑详情
    let localBuildingDetailList = wx.getStorageSync("localBuildingDetailList");
    if (!localBuildingDetailList) {
      wx.setStorageSync("localBuildingDetailList", []);
      localBuildingDetailList = wx.getStorageSync("localBuildingDetailList");
    }
    console.log("缓存", localBuildingDetailList);

    // 获取当前建筑在markers中的对象
    let targetBuilding = this.data.markers.filter(item => item.id === idx)[0];

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
        dataID: targetBuilding.dataID,
        name: "华南土特产展览交流大会旧址手工业馆",
        type: "重要历史事件及人物活动纪念地",
        period: "1950-1970年代(1950-1979)",
        site: "广州市荔湾区西堤二马路37号文化公园第七展馆",
        introduction:
          "华南土特产展览交流大会手工业馆是该展会的第七展馆， 建筑师为铁路局工程师郭尚德先生。展馆为一层，建筑面积 1470 平方米 . 平面采用中轴对称的“十字形”旋转 45 度布局，主入 口朝东面向广场，南、北、西侧均设有次出入口。由一个环形空 间统领四个矩形展览空间，展览路线流畅不重复，争取最大的展 览面积。环形大厅中央设有圆形庭院，利于展厅的采光通风、美 化环境，又可用作室外临时展场。手工业馆的立面造型朴素、简 洁大方，外墙刷米黄色石灰。环形大厅采用长条的高窗，矩形展 厅设水平带形高窗，入口出挑雨篷以纤细的柱子支撑，亲切自然。.",
        picList: [
          "http://cdn.cdlshow.xyz/GZ_01_0003_华南土特产展览交流大会旧址手工业馆/crop-建筑整体透视或立面2.jpg",
          "http://cdn.cdlshow.xyz/GZ_01_0003_华南土特产展览交流大会旧址手工业馆/crop-细部1.jpg",
          "http://cdn.cdlshow.xyz/GZ_01_0003_华南土特产展览交流大会旧址手工业馆/crop-细部3.jpg",
          "http://cdn.cdlshow.xyz/GZ_01_0003_华南土特产展览交流大会旧址手工业馆/crop-周边环境1.jpg"
        ],
        icon: targetBuilding.iconPath,
        // location: [113.250794, 23.109609]
        location: [116.30527, 23.61248],
        question: [
          {
            title: "您所在的建筑名字是？",
            choices: ["霍芝庭公馆旧址", "纸行路42号居民", "礼兴街10号居民"],
            answer: "霍芝庭公馆旧址"
          },
          {
            title: "您所在的位置是？讲故事的就投入公婆的加热片我建个",
            choices: [
              "广州市越秀区解放北路22号 爱搜ID发窘阿伟斧头哥雄趣味·",
              "广州市番禺区解放北路22号",
              "广州市天河区解放北路22号"
            ],
            answer: "广州市番禺区解放北路22号"
          },
          {
            title: "该地址是哪个时期的？",
            choices: [
              "中华民国（1911-1949）",
              "清（1644-1911）",
              "1950-1970年代"
            ],
            answer: "1950-1970年代"
          }
        ]
      };

      console.log("*****啊啊啊啊");

      localBuildingDetailList.push(currentBuild_detail);
      wx.setStorageSync("localBuildingDetailList", localBuildingDetailList);

      this.setData({
        building_detail: currentBuild_detail,
        [`markers[${idx}].width`]: 60,
        [`markers[${idx}].height`]: 60,
        [`markers[${idx}].iconPath`]: func.handlePictureWatermark(
          targetBuilding.iconPath,
          "zs"
        ),
        [isSelected]: true,
        currentBuilding: idx,
        currentBuildingId: targetBuilding.dataID
        // location: {
        //   lat: targetBuilding.latitude,
        //   lng: targetBuilding.longitude
        // }
      });
      // console.log("1", this.data.building_detail);
      // });
      return;
    } else {
      // 缓存存在当前建筑详情
      let currentBuild_detail = localBuildingDetailList[buildingHasExist];
      console.log("*****啊啊啊啊1");
      this.setData({
        building_detail: currentBuild_detail,
        [`markers[${idx}].width`]: 60,
        [`markers[${idx}].height`]: 60,
        [`markers[${idx}].iconPath`]: func.handlePictureWatermark(
          targetBuilding.iconPath,
          "zs"
        ),
        [isSelected]: true,
        currentBuilding: idx,
        currentBuildingId: targetBuilding.dataID
        // location: {
        //   lat: targetBuilding.latitude,
        //   lng: targetBuilding.longitude
        // }
      });
      // console.log("2", this.data.building_detail);
      return;
    }
  },

  // 点击icon
  async markertap(e) {
    if (this.data.currentBuilding === e.markerId) {
      // 避免用户重复点同一建筑，重复拉取详情
      return;
    } else {
      if (this.data.currentBuilding > -1) {
        let temp = this.data.markers[this.data.currentBuilding];
        let tempIconPath = temp.nativeIcon;
        console.log(temp);
        this.setData({
          [`markers[${this.data.currentBuilding}].width`]: 40,
          [`markers[${this.data.currentBuilding}].height`]: 40,
          [`markers[${this.data.currentBuilding}].iconPath`]: tempIconPath
        });
        // this.refreshMap();
      }
    }

    await this.getBuildingDetail(e.markerId, e.type);
  },

  // 点击气泡
  async callouttap(e) {
    // if (this.data.currentBuilding === e.markerId) {
    //   // 避免用户重复点同一建筑，重复拉取详情
    //   return;
    // }

    await this.getBuildingDetail(e.markerId, e.type);

    wx.navigateTo({
      url: "../puzzlePage/puzzlePage",
      // url: "../cultureMap/cultureMap?buildingId=sadfgrg"
      success: res => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit("acceptDataFromOpenerPage", {
          building_detail: this.data.building_detail
        });
      }
    });
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

    this.refreshMap();
  }
});
