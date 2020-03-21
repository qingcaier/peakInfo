// pages/culture/culture.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    building_detail: {
      _id: "5e5ec707d507a2c05e3ed5f2"
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  // 发起拼单跳转
  toCreateOrder: function() {
    wx.navigateTo({
      url: "../cultureMap/cultureMap",
      // url: "../cultureMap/cultureMap?buildingId=sadfgrg"
      success: res => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit("acceptDataFromOpenerPage", {
          data: this.data.building_detail
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
