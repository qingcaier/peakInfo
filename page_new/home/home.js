// page_new/home/home.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bg: ".",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  goPage: function (e) {
    let sign = e.currentTarget.dataset["index"];

    console.log(sign);
    app.ajax
      .checkLogin()
      .then((res) => {
        console.log(res);
        if (res.data.state) {
          switch (sign) {
            case "0":
              wx.navigateTo({
                url: "/page_new/buildingList/buildingList",
              });
              break;
            case "1":
              wx.navigateTo({
                url: "/pages/remActRouter/remActRouter",
              });
              break;
            case "2":
              wx.switchTab({
                url: "/pages/home/home", //此处跳转无返回
              });
              break;
            case "3":
              wx.navigateTo({
                url: "/page_new/mallHome/mallHome",
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
