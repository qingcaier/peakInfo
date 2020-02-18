import store from "../../store.js";
import create from "../../utils/create.js";

const app = getApp();

let mapContext;

// 将地图比例尺转化为手机屏幕大概距离
let scaleToDistance = function(scale) {
  switch (scale) {
    case 3:
      return 6000000;
    case 4:
      return 3000000;
    case 5:
      return 1200000;
    case 6:
      return 600000;
    case 7:
      return 300000;
    case 8:
      return 300000;
    case 9:
      return 120000;
    case 10:
      return 60000;
    case 11:
      return 30000;
    case 12:
      return 12000;
    case 13:
      return 6000;
    case 14:
      return 3000;
    case 15:
      return 1200;
    case 16:
      return 600;
    case 17:
      return 300;
    case 18:
      return 300;
    case 19:
      return 120;
    case 20:
      return 60;
    default:
      return 20000000;
  }
};

// 生成marker对象
let createMarker = function(obj) {
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
    // isSelected: false,
    iconPath: "../../public/images/position.png",
    latitude: obj.location.lat,
    longitude: obj.location.lng,
    width: 1,
    height: 1,
    // zIndex: 1000,
    callout: {
      content: calloutContent,
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

// 距离截取(保留两位小数)
let showDistance = function(distance) {
  if (distance >= 1000) {
    return Math.round((Math.round(distance) / 1000) * 100) / 100 + "km";
  } else {
    return Math.round(distance) + "m";
  }
};

create(store, {
  data: {
    location: {},
    markers: [],
    mapScale: 17,

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
      },
      {
        img: "../../public/images/store.png",
        title: "缺200，满500减200！！！",
        detail: "走过路过千万别错过，以纯满500减200，现差200，求拼单！！！",

        _typeNumber: 1,
        _remainCount: 200,
        _validTime: 1582939162423
      },
      {
        img: "../../public/images/store.png",
        title: "缺200，满500减200！！！",
        detail: "走过路过千万别错过，以纯满500减200，现差200，求拼单！！！",

        _typeNumber: 1,
        _remainCount: 200,
        _validTime: 1582939162423
      },
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
  onLoad: function() {
    // this.getUserLocation();
    mapContext = wx.createMapContext("map");
    // mapContext.getScale({
    //   success: res => {
    //     console.log("地图比例", res);
    //   },
    //   fail: res => {
    //     console.log("地图比例失败", res);
    //   }
    // });
    // console.log(this.data);
    // console.log(this.data.location);
    // app.ajax
    //   .checkNeightAct({
    //     location: this.data.location,
    //     distance: scaleToDistance()
    //   })
    //   .then(res => {
    //     console.log("附近的商家活动", res.data);
    //   });
  },
  onShow: function() {
    this.getUserLocation();
  },
  onReady: function() {},

  // 获取当前定位并请求附近的商家活动
  getUserLocation: function() {
    // wx.getLocation({
    //   type: "gcj02",
    //   success: response => {
    //     console.log("为什么没有");
    //     var latitude = response.latitude;
    //     var longitude = response.longitude;

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

        this.setData({
          location: {
            lat: res.result.location.lat,
            lng: res.result.location.lng
          }
        });

        // 请求附近的商家活动
        app.ajax
          .checkNeightAct({
            location: {
              lng: res.result.location.lng,
              lat: res.result.location.lat
            },
            distance: scaleToDistance()
          })
          .then(res => {
            console.log("附近的商家活动", res.data.data);
            let NeightAct = res.data.data;
            let markersList = [];

            for (let i in NeightAct) {
              let marker = {};
              marker = createMarker(NeightAct[i]);
              marker.id = Number(i);
              markersList.push(marker);
            }
            console.log(markersList);
            this.setData({
              markers: markersList
            });
          });
      },
      fail: res => {
        console.log(res.status, res.message);
      },
      complete: res => {
        console.log(res.status, res.message);
      }
    });

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
  },

  // 发起拼单跳转
  toCreateOrder: function() {
    wx.navigateTo({
      url: "../createOrder/createOrder"
    });
  },

  // 关闭拼单列表
  closeOrderTap() {
    console.log(this.data.currentCallout);
    let a = this.data.currentCallout;
    if (this.data.isSelected) {
      this.setData({
        [`markers[${a}].callout.content`]: this.data.markers[
          a
        ].callout.content.split(" ")[0],
        [`markers[${a}].callout.color`]: "#ffffff",
        isSelected: false
      });
      // this.setData({});
    }
  },

  callouttap(e) {
    console.log(e);
    let targetAct = this.data.markers.filter(item => item.id === e.markerId)[0];
    let calloutContent = this.data.markers[e.markerId].callout.content;
    if (!this.data.isSelected) {
      this.setData({
        [`markers[${e.markerId}].callout.content`]:
          calloutContent + " " + showDistance(targetAct._distance),
        [`markers[${e.markerId}].callout.color`]: "#000000",
        isSelected: true,
        currentCallout: e.markerId
      });
      console.log(this.data.currentCallout);

      app.ajax
        .checkActOrder({
          act_id: targetAct.act_id,
          order_state: 0 // 有效拼单
        })
        .then(res => {
          console.log(res.data);
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

  markertap(e) {
    console.log(e);
    // let targetAct = this.data.markers.filter(item => item.id === e.markerId)[0];
    // let calloutContent = this.data.markers[e.markerId].callout.content;
    // if (!this.data.isSelected) {
    //   this.setData({
    //     [`markers[${e.markerId}].callout.content`]:
    //       calloutContent + " " + showDistance(targetAct._distance),
    //     isSelected: true
    //   });

    //   app.ajax
    //     .checkActOrder({
    //       act_id: targetAct.act_id,
    //       order_state: 0 // 有效拼单
    //     })
    //     .then(res => {
    //       console.log(res.data);
    //     });
    // } else {
    //   this.setData({
    //     [`markers[${e.markerId}].callout.content`]: calloutContent.split(
    //       " "
    //     )[0],
    //     isSelected: false
    //   });
    // }
    // this.setData({
    //   selected: false,
    //   distance: targetAct._distance + "米",
    //   calloutStyle: "top: 12rpx;left: 12rpx"
    // });
    // console.log(this.data.markers);
    // console.log(targetAct);
  },

  // 地图视野变化事件
  regionchange(e) {
    console.log(e);
    // const mapContext = wx.createMapContext("map", this);
    mapContext.getCenterLocation({
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
      // complete: response => {
      //   console.log(response);
      // }
    });
  }
});
