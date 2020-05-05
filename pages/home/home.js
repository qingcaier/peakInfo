import store from "../../store.js";
import create from "../../utils/create.js";

const Func = require("../../public/util/func");
const func = new Func();

const app = getApp();

let mapContext;

// 生成marker对象
let createMarker = function (obj) {
  let calloutContent = "";
  if (obj.total_count) {
    switch (obj.act_type) {
      case 0:
        calloutContent = obj.total_count + "件";
        break;
      case 1:
        calloutContent = obj.total_count + "元";
      default:
        break;
    }
  } else {
    calloutContent = "暂无拼单";
  }
  return {
    // id: 0,
    act_id: obj._id,
    _distance: obj._distance,
    actLocation: {
      lng: obj.loc[0],
      lat: obj.loc[1]
    },
    calloutContent: calloutContent,
    // calloutContent_select: `${calloutContent} ${showDistance(obj._distance)}`,
    // isSelected: false,
    iconPath: "../../public/images/position.png",

    latitude: obj.loc[1],
    longitude: obj.loc[0],
    width: 1,
    height: 1,
    // zIndex: 1000,
    callout: {
      content: ` ${calloutContent} `,
      color: "#ffffff",
      fontSize: 15,
      borderRadius: 10,

      bgColor: "#ffaa33",

      display: "ALWAYS",
      padding: 5,
      textAlign: "center"
    }
    // label: {
    //   content: obj.business_name,
    //   color: "#000000",
    //   fontSize: 16,
    //   anchorX: -(obj, (obj.business_name.length * 16) / 2),
    //   // anchorY: 0,
    //   textAlign: "center"
    // }
  };
};

// // 生成markers
// let createMarkers = function(objArr){
//   let markers = [];
//   for(let i in objArr){

//   }
// };

// 距离截取(保留两位小数)
let showDistance = function (distance) {
  if (distance >= 1000) {
    return Math.round((Math.round(distance) / 1000) * 100) / 100 + "km";
  } else {
    return Math.round(distance) + "m";
  }
};

create(store, {
  data: {
    location: {}, // 地图中心定位
    userLocation: {}, // 用户定位
    markers: [],
    mapScale: 17,
    mapSize: 100, // 地图尺寸（百分比）

    isSelected: false, // 当前是否有选中商家
    // currentCallout: -1,
    // distance: "",
    // calloutStyle: {}

    // contain: {
    //   img: "../../public/images/store.png",
    //   title: "缺200，满500减200！！！",
    //   detail: "走过路过千万别错过，以纯满500减200，现差200，求拼单！！！",

    //   _typeNumber: 1,
    //   _remainCount: 200,
    //   _validTime: 1582939162423
    // },

    orderList: [
      {
        img: "../../public/images/store.png",
        title: "缺200，满500减200！！！",
        detail: "走过路过千万别错过，以纯满500减200，现差200，求拼单！！！",

        _typeNumber: 1,
        _remainCount: 200,
        _validTime: 1582939162423
      }
    ]
  },
  onLoad: async function () {
    // onLoad: function() {
    // this.getUserLocation();
    mapContext = wx.createMapContext("map");

    let userLocation = await this.getUserLocation();
    this.setData({
      userLocation: userLocation
    });

    let markers = await this.getNeightAct(userLocation);

    console.log(markers);

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
    wx.onLocationChange(async res => {
      console.log(res);
      let userCurrentLocation = {
        lat: res.latitude,
        lng: res.longitude
      };

      let preLocation = this.data.userCurrentLocation;
      let preScale = this.data.mapScale;

      if (func.getDistance(userCurrentLocation, preLocation) > 50) {
        await this.getNeightAct(userCurrentLocation, preScale);
      }

      // let mapMarkers = this.data.markers;

      // for (let i in mapMarkers) {
      //   if (i.state && i.point) {
      //     let targetBuildingLocation = {
      //       lat: mapMarkers[i].latitude,
      //       lng: mapMarkers[i].longitude
      //     };

      //     if (
      //       func.getDistance(userCurrentLocation, targetBuildingLocation) <=
      //       this.data.effectDistance
      //     ) {
      //       this.setData({
      //         userLocation: userCurrentLocation,
      //         [`markers[${i}].callout`]: callout
      //       });
      //     } else {
      //       this.setData({
      //         userLocation: userCurrentLocation,
      //         [`markers[${i}].callout`]: null
      //       });
      //     }
      //   }
      // }
    });
  },
  onShow: async function () {
    console.log("home onshow");
    // this.getUserLocation();
    // let userLocation = await this.getUserLocation();

    // let markers = await this.getNeightAct(userLocation);

    // console.log(markers);

    // this.setData({
    //   userLocation: userLocation
    // });
    this.refreshMap();
  },
  onReady: function () { },

  onHide: function () {
    this.setData({
      isSelected: false,
      mapSize: 100,
      currentCallout: -1
    });
  },

  // 刷新地图
  refreshMap: function (causedType) {
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
            if (causedType === "scale") {
              if (scale === 18 || scale === 3) {
                return;
              }
            }
            let markers = await this.getNeightAct(centerLocation, scale);

            console.log("region", markers);

            // this.setData({
            //   markers: markers,
            //   // location: centerLocation,
            //   mapScale: scale
            // });

            // let markersList = await this.getMarkers(centerLocation, scale);
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

  // 获取用户当前位置经纬度
  getUserLocation: function () {
    return new Promise((resolve, reject) => {
      // 获取自身位置（地址逆解析）
      app.qqMap.reverseGeocoder({
        // location: {
        //   latitude,
        //   longitude
        // },
        ger_poi: 1,
        success: res => {
          console.log(res.status, res.message);
          console.log(res.result);

          // this.store.data.userLocation = { latitude, longitude }; // 将当前位置存在westore
          // this.update();

          let currentLocation = res.result.location;

          resolve(currentLocation);
        },
        fail: err => {
          console.log(err.status, err.message);
          reject(err);
        },
        complete: res => {
          // console.log(res.status, res.message);
        }
      });
    });
  },

  // 获取附近的商家活动
  getNeightAct(currentLocation, scale) {
    return new Promise((resolve, reject) => {
      // 请求附近的商家活动
      app.ajax
        .checkNeightAct({
          location: currentLocation,
          distance: func.scaleToDistance(scale)
        })
        .then(res => {
          console.log("附近的商家活动", res.data);
          let NeightAct = res.data.data;
          console.log(NeightAct);

          let markersList = [];

          for (let i in NeightAct) {
            let marker = {};
            marker = createMarker(NeightAct[i]);
            marker.id = Number(i);
            marker.distance = func.getDistance(
              this.data.userLocation,
              marker.actLocation
            );
            markersList.push(marker);
          }
          console.log(markersList);
          this.setData({
            markers: markersList,
            location: currentLocation
            // mapScale: scale // 添加会触发regionchange死循环
          });
          resolve(markersList);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  // 返回小程序首页
  backToIndex(e) {
    console.log(e);
    console.log("2111");
    wx.redirectTo({
      url: "/page_new/home/home"
    });
  },

  // 参与拼单
  goJoin(e) {
    console.log(e);
    let order_id = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: "../joinOrder/joinOrder",
      success: res => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit("dataFormFather", {
          data: {
            order_id: order_id,
            canJoin: true
          }
        });
      }
    });
  },

  // // 获取周围商店
  // app.qqMap.search({
  //   keyword: "购物",
  //   // filter: "category=购物",
  //   address_format: "short",
  //   page_size: 20,
  //   // page_index: 2,

  //   location: { longitude: 113.269852, latitude: 23.11841 },
  //   success: function(res) {
  //     console.log(res.status, res.message);
  //     console.log(res.data);
  //   },
  //   fail: function(res) {
  //     console.log(res.status, res.message);
  //   },
  //   complete: function(res) {
  //     console.log(res.status, res.message);
  //   }
  // });

  // // 地址解析
  // app.qqMap.geocoder({
  //   address: "北京路",
  //   region: "广州市",
  //   success: res => {
  //     console.log(res.status, res.message);
  //     console.log(res.result);
  //   },
  //   fail: res => {
  //     console.log(res);
  //   },
  //   complete: res => {
  //     console.log(res);
  //   }
  // });
  // }
  // });
  // },

  // 发起拼单跳转
  toCreateOrder: function () {
    wx.navigateTo({
      url: "../createOrder/createOrder"
    });
  },

  // 关闭拼单列表
  closeOrderTap() {
    console.log(this.data.currentCallout);
    let a = this.data.currentCallout; // 取出地图气泡里的内容
    let targetAct = this.data.markers[a];
    if (this.data.isSelected) {
      this.setData({
        mapSize: 100,
        [`markers[${a}].callout.content`]: ` ${targetAct.calloutContent} `,
        // this.data.markers[
        //   a
        // ].callout.content.split(" ")[0], // 关闭拼单列表去掉距离
        [`markers[${a}].callout.color`]: "#ffffff",
        isSelected: false,
        currentCallout: -1
      });
      // this.setData({});
    }
  },

  callouttap(e) {
    let idx = e.markerId;
    let targetAct = this.data.markers.filter(item => item.id === idx)[0];
    let preIdx = this.data.currentCallout;
    if (preIdx === idx) {
      return;
    }
    console.log(e);
    // let calloutContent = this.data.markers[e.markerId].callout.content;
    if (!this.data.isSelected) {
      this.setData({
        [`markers[${idx}].callout.content`]: ` ${
          targetAct.calloutContent
          }  ${showDistance(targetAct.distance)} `,
        // calloutContent + " " + showDistance(targetAct._distance),
        [`markers[${idx}].callout.color`]: "#000000",
        isSelected: true,
        currentCallout: idx,
        mapSize: 50,

        location: targetAct.actLocation
      });
      console.log(this.data.currentCallout);

      // wx.chooseLocation({
      //   longitude: targetAct.longitude,
      //   latitude: targetAct.latitude,
      //   success: res => {
      //     console.log(res);
      //     // mapContext.
      //   },
      //   fail: err => {
      //     console.log(err);
      //   }
      // });

      // mapContext.moveToLocation({
      //   longitude: targetAct.longitude,
      //   latitude: targetAct.latitude,
      //   success: res => {
      //     console.log(res);
      //     // mapContext.
      //   },
      //   fail: err => {
      //     console.log(err);
      //   }
      // });
      // mapContext.translateMarker({
      //   markerId: e.markerId,
      //   destination: {
      //     longitude: this.data.location.lng,
      //     latitude: this.data.location.lat
      //   },
      //   success: res => {
      //     console.log(res);
      //   },
      //   fail: err => {
      //     console.log(err);
      //   }
      // });

      app.ajax
        .checkActOrder({
          act_id: targetAct.act_id,
          order_state: 0, // 有效拼单
          firstOrder: false
        })
        .then(res => {
          console.log(res.data);
          let orderList = [];
          for (let i of res.data.data) {
            let orderItem = {};
            orderItem.order_id = i._id;
            orderItem.img = i.picture[0] || "../../public/images/store.png";
            orderItem.title = i.title;
            orderItem.detail = i.detail;
            orderItem._typeNumber = i.act_type;
            orderItem._remainCount =
              i.total_count - i.participant_id.current_count;
            orderItem._validTime = i.remain_time;

            orderList.push(orderItem);
          }

          this.setData({
            orderList: orderList
          });
        });
    }
    // else {
    //   this.setData({
    //     [`markers[${e.markerId}].callout.content`]: calloutContent.split(
    //       " "
    //     )[0],
    //     [`markers[${e.markerId}].callout.color`]: "#ffffff",

    //     currentCallout: e.markerId
    //   });
    // }
  },

  // 地图视野变化事件
  regionchange(e) {
    // console.log(e);
    if (e.type !== "end") {
      return;
    }
    if (e.causedBy === "update") {
      return;
    }

    this.refreshMap(e.causedBy);
  }

  // debounceChange()
});
