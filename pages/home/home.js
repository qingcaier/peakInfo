import store from "../../store.js";
import create from "../../utils/create.js";

const app = getApp();

create(store, {
  data: {
    longitude: 113.32452,
    latitude: 23.099994,
    markers: [
      {
        id: 0,
        iconPath: "../../images/icon_cur_position.png",
        latitude: 23.099994,
        longitude: 113.32452,
        width: 50,
        height: 50
      }
    ]
  },
  onLoad: function() {
    var that = this;
    wx.getLocation({
      type: "wgs84",
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        //console.log(res.latitude);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [
            {
              latitude: res.latitude,
              longitude: res.longitude
            }
          ]
        });
      }
    });
  },
  onReady: function() {}
});
