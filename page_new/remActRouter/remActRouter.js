// page_new/remActRouter/remActRouter.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    router: [
      {
        id: 0,
        routerName: "文化点打卡",
        routerPath: "../../page_new/cultureClock/cultureClock",
        pic: "../../public/picture/daka.jpg"
      },
      {
        id: 1,
        routerName: "密探寻宝",
        routerPath: "../../page_new/cultureTask/cultureTask",
        pic: "../../public/picture/mitan.png"
      },
      {
        id: 2,
        routerName: "文化拼图",
        routerPath: "../../page_new/culturePuzzle/culturePuzzle",
        pic: "../../public/picture/pintu.jpg"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  // 点击路由跳转到相应页面
  routeTo(e) {
    console.log(e);
    let url = e.currentTarget.dataset.routerpath;
    console.log(url);

    wx.navigateTo({
      url,
      success: res => {
        console.log(res);
        // // 通过eventChannel向被打开页面传送数据
        // res.eventChannel.emit("acceptDataFromOpenerPage", {
        //   data: this.data.building_detail
        // });
      },
      fail: err => {
        console.log(err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { }
});
