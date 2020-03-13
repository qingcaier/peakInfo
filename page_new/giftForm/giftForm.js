// page_new/giftForm/giftForm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      count: "3888"
    },
    gift: {
      title: "xxxxx",
      price: "xxx",
      inventory: "xx",
      url: "http://cdn.cdlshow.xyz/gift_3.png"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('giftData', function (data) {
      console.log(data);
      _this.setData({
        gift: data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})