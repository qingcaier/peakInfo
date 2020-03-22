import store from "../../store.js";
import create from "../../utils/create.js";

const Func = require("../../public/util/func");
const func = new Func();

const app = getApp();

let mapContext; // 地图对象

// 地图气泡
const callout = {
  content: " 寻 ",
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
    marker.point = objArr[i].point;
    marker.state = objArr[i].state;

    marker.callout = callout;

    markers.push(marker);
  }

  return markers;
};

// // 生成marker对象
// let createMarker = function(obj) {
//   return {
//     // id: 0,
//     dataID: obj.dataID,
//     // _distance: obj._distance,
//     // isSelected: false,
//     iconPath: obj.icon,
//     latitude: obj.location[1],
//     longitude: obj.location[0],
//     width: 40,
//     height: 40
//     // zIndex: 1000,
//     // callout: {
//     //   content: "打卡",
//     //   color: "#ffffff",
//     //   fontSize: 15,
//     //   borderRadius: 10,
//     //   bgColor: "#ff0033",
//     //   display: "ALWAYS",
//     //   padding: 5,
//     //   textAlign: "center"
//     // }
//     // label: {
//     //   content: obj.business_name,
//     //   color: "#000000",
//     //   fontSize: 16,
//     //   anchorX: -(obj, (obj.business_name.length * 16) / 2),
//     //   // anchorY: 0,
//     //   textAlign: "center"
//     // }
//   };
// };

create(store, {
  data: {
    location: {}, // 地图中心定位
    userLocation: {}, // 用户定位
    markers: [],

    mapScale: 17, // 地图比例
    effectDistance: 50, // 有效距离

    currentBuildingId: "", // 当前选中建筑的标识id

    isMarkerTap: false, // 当前是否通过icon点击选中建筑景点
    isCalloutTap: false, // 当前是否通过点击气泡选中建筑景点
    showQuestion: false, // 展示问题
    isAnswerQuestion: false, // 是否完成答题

    isSelectedMyTask: false, // 是否点击我的任务

    answerToBoolean: [], // 将用户打卡答题答案转化成boolean数组

    // 当前选中建筑的详细信息
    building_detail: {}
  },
  onLoad: async function() {
    mapContext = wx.createMapContext("map");

    let tasksLocation = await this.getTasksLocation(); // 获取任务建筑群中心经纬度

    await this.getMarkers(tasksLocation);

    // 开启实时位置监听
    wx.startLocationUpdate({
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    });

    // 监听位置变化
    wx.onLocationChange(res => {
      console.log(res);
      let userCurrentLocation = {
        lat: res.latitude,
        lng: res.longitude
      };

      let mapMarkers = this.data.markers;

      for (let i in mapMarkers) {
        if (i.state && i.point) {
          let targetBuildingLocation = {
            lat: mapMarkers[i].latitude,
            lng: mapMarkers[i].longitude
          };

          if (
            func.getDistance(userCurrentLocation, targetBuildingLocation) <=
            this.data.effectDistance
          ) {
            this.setData({
              userLocation: userCurrentLocation,
              [`markers[${i}].callout`]: callout
            });
          } else {
            this.setData({
              userLocation: userCurrentLocation,
              [`markers[${i}].callout`]: null
            });
          }
        }
      }
    });
  },
  onShow: function() {},
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
                await this.getBuildingDetail(currentBuild, "markertap");
              }
              if (this.data.isCalloutTap) {
                // console.log("什么鬼3");
                await this.getBuildingDetail(currentBuild, "callouttap");
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

    let taskBuildingsData = await this.getTaskBuildings(); // 获取任务建筑信息
    let data = taskBuildingsData.buildingData;

    let otherMarkers = markersList.filter(item => {
      let objIndex = data.findIndex(item1 => item1.dataID === item.dataID);
      if (objIndex === -1) {
        return item;
      }
    });

    console.log("是是是", otherMarkers);

    let totalMarkers = data.concat(otherMarkers);
    console.log(totalMarkers);
    let markers = createMarkers(totalMarkers);
    console.log(markers);
    for (let i in markers) {
      if (i < data.length) {
        // 任务建筑图标样式
        markers[i].iconPath = func.handlePictureWatermark(
          markers[i].icon,
          markers[i].state === 0 ? "bs" : "yes",
          markers[i].state === 0 ? Number(i) + 1 : ""
        );

        // 记住默认图标样式
        markers[i].nativeIcon = func.handlePictureWatermark(
          markers[i].icon,
          markers[i].state === 0 ? "bs" : "yes",
          markers[i].state === 0 ? Number(i) + 1 : ""
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
      tasks: taskBuildingsData,
      location: location,
      markers: markers
    });
    return markers;
  },

  // 获取任务建筑群的中心经纬度
  getTasksLocation: function() {
    return new Promise((resolve, reject) => {
      // app.ajax
      //   .XXXX()
      //   .then(res => {
      //     console.log(res);
      //     let result = res.data.location;
      let result = [113.251311306424, 23.110179578994];
      let taskLocation = {
        lng: result[0],
        lat: result[1]
      };

      resolve(taskLocation);
    });
    // .catch(err => {
    //   reject(err);
    // });
    // });
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

  // 获取用户任务建筑信息
  getTaskBuildings() {
    return new Promise((resolve, reject) => {
      // app.ajax.XXXX().then(res => {
      //   console.log(res);
      //   let result = res.data.data;

      let result = {
        taskInfor:
          "到任务点寻找照片中的位置，拍摄照片进行定向匹配完成探寻，完成答题获得积分，兑换精美小礼品！！",
        extraPoint: 50,
        buildingData: [
          {
            dataID: "5e6baece6332a87c83a47569",
            icon:
              "http://cdn.cdlshow.xyz/thumbnails/thumbnails_1517380760284.jpg",
            name: "华南土特产展览交流大会旧址手工业馆",
            site: "广州市荔湾区西堤二马路37号文化公园第七展馆",
            point: 20,
            location: [113.250794, 23.109609],
            state: 0
          },
          {
            dataID: "5e6baece6332a87c83a4756a",
            icon:
              "http://cdn.cdlshow.xyz/thumbnails/thumbnails_1517381296606.jpg",
            name: "华南土特产展览交流大会旧址水果蔬菜馆",
            site: "广州市荔湾区西堤二马路37号文化公园第四展馆",
            point: 30,
            location: [113.24992, 23.110121],
            state: 1
          }
        ]
      };

      resolve(result);
      // });
    });
    // .catch(err => {
    //   reject(err);
    // });
  },

  // 打开我的任务浮窗
  setMyTasks: function() {
    // 请求我的打卡列表
    // app.ajax.getPunchList().then(res => {
    //   console.log(res.data);
    //   let result = res.data.data;

    let tasksList = this.data.tasks.buildingData;
    console.log(tasksList);

    let newTasksList = [];
    for (let i in tasksList) {
      let arr = tasksList[i];

      arr.icon =
        tasksList[i].state === 0
          ? func.handlePictureWatermark(tasksList[i].icon, "bs", Number(i) + 1)
          : func.handlePictureWatermark(tasksList[i].icon, "yes");

      newTasksList.push(arr);
    }

    this.setData({
      [`tasks.buildingData`]: newTasksList,
      isSelectedMyClock: true
    });

    // });
  },

  // 关闭我的打卡浮窗
  closeMyClockTap: function() {
    this.setData({
      isSelectedMyClock: false
    });
  },

  // 我的打卡跳转到对应建筑详情
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
        name: targetBuilding.dataID + "华南土特产展览交流大会旧址手工业馆",
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
          [`markers[${this.data.currentBuilding}].iconPath`]: tempIconPath,
          isCalloutTap: false
        });
        // this.refreshMap();
      }
    }

    await this.getBuildingDetail(e.markerId, e.type);
  },

  // 点击气泡
  async callouttap(e) {
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
          [`markers[${this.data.currentBuilding}].iconPath`]: tempIconPath,
          isMarkerTap: false
        });
        // this.refreshMap();
      }
    }

    await this.getBuildingDetail(e.markerId, e.type);

    // app.ajax.XXXX({
    //   dataID: targetBuilding.dataID,
    // }).then(res => {
    //   console.log(res);

    //   let result = res.data.data;
    let result =
      "http://cdn.cdlshow.xyz/GZ_01_0004_华南土特产展览交流大会旧址水果蔬菜馆/crop-细部1.jpg";

    this.setData({
      matchPhoto: result
    });

    // })
    // .catch(err => {
    //   console.log(err)
    // })

    console.log(e);
    await this.getBuildingDetail(e.markerId, e.type);
  },

  // 打开匹配照片画廊
  showGallery() {
    this.setData({
      isShowGallery: true
    });
  },

  // 调用相机拍照上传匹配
  submitPhoto() {
    wx.chooseImage({
      count: 3,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: async res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        // console.log(tempFilePaths);
        // console.log(res, tempFilePaths);

        let upToken = (await app.ajax.getQiniuyun()).data.upToken;

        wx.showLoading({
          title: "",
          mask: true
        });
        let imgPath = (await func.updateImg(tempFilePaths, upToken)).imageURL;

        // app.ajax
        //   .XXXX({
        //     picture: imgPath
        //   })
        //   .then(res => {
        //     console.log(res);

        //     let result = res.data.state;
        let result = 200;
        if (result === 200) {
          wx.showToast({
            title: "照片地点正确",
            success: res => {
              console.log(res);
              setTimeout(() => this.getQuestion(), 2000);
            }
          });
        } else if (result === 404) {
          wx.showToast({
            title: "照片地点不匹配",
            image: "../../public/images/avator.png"
            // success: res => {

            // }
          });
        }
        // });

        console.log(imgPath);
      }
    });
  },

  // closeMatchPhotoTap(){
  //   this.setData({
  //     isCalloutTap: false
  //   })
  // },

  // 打卡问题
  getQuestion() {
    this.setData({
      showQuestion: true
      // isCalloutTap: false
    });
  },

  // 答题返回
  backTap() {
    this.setData({
      showQuestion: false,
      isAnswerQuestion: false,

      answerToBoolean: [],
      isAnswerRight: false
    });
  },

  // 用户答题
  getUserAnswer(e) {
    console.log(e);
    let userAnswer = this.data.answerToBoolean;
    userAnswer[e.currentTarget.dataset.index] = e.detail.isRight;
    this.setData({
      answerToBoolean: userAnswer
    });

    if (this.data.answerToBoolean.length < 3) {
      this.setData({
        isAnswerRight: false
      });
    } else {
      let isAnswerRight = true;
      let finialAnswer = this.data.answerToBoolean;
      for (let i of finialAnswer) {
        isAnswerRight = isAnswerRight && i;
      }

      this.setData({
        isAnswerRight
      });
    }
  },

  // 完成答题后打卡
  submitClock(e) {
    let obj = {
      dataID: this.data.currentBuildingId,
      RorWType: this.data.answerToBoolean,
      credit: this.data.markers[this.data.currentBuilding].point
    };
    console.log(obj);
    // app.ajax.XXXX(obj).then(res => {
    //   console.log(res);

    //   let result = res.data.state;

    let result = {
      status: 200,
      msg: "成功！"
    };
    if (result.status === 200) {
      this.setData({
        isAnswerQuestion: true
      });
      setTimeout(async () => {
        await this.onLoad();
        console.log("刷新");
        this.setData({
          // 重置页面
          showQuestion: false,
          isCalloutTap: false,
          isMarkerTap: false,
          isAnswerQuestion: false,
          answerToBoolean: []
        });
      }, 2000);
    }

    // });
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
