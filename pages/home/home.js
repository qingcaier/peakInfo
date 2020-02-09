import store from "../../store.js";
import create from "../../utils/create.js";

const app = getApp();

create(store, {
  data: {
    location: {},
    markers: []
  },
  onLoad: function() {
    // this.getUserLocation();
  },
  onShow: function() {
    this.getUserLocation();
  },
  onReady: function() {},
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
            latitude: res.result.location.lat,
            longitude: res.result.location.lng
          },
          markers: [
            {
              id: 0,
              iconPath: "../../public/images/活动.png",
              latitude: res.result.location.lat,
              longitude: res.result.location.lng,
              width: 25,
              height: 25
            }
          ]
        });
      },
      fail: res => {
        console.log(res.status, res.message);
      },
      complete: res => {
        console.log(res.status, res.message);
      }
    });

    // 获取周围商店
    app.qqMap.search({
      keyword: "购物",
      // filter: "category=购物",
      address_format: "short",
      page_size: 20,
      // page_index: 2,

      location: { longitude: 113.269852, latitude: 23.11841 },
      success: function(res) {
        console.log(res.status, res.message);
        console.log(res.data);
      },
      fail: function(res) {
        console.log(res.status, res.message);
      },
      complete: function(res) {
        console.log(res.status, res.message);
      }
    });

    // 地址解析
    app.qqMap.geocoder({
      address: "北京路",
      region: "广州市",
      success: res => {
        console.log(res.status, res.message);
        console.log(res.result);
      },
      fail: res => {
        console.log(res);
      },
      complete: res => {
        console.log(res);
      }
    });
    // }
    // });
  }
});
