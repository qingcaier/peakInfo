// page_new/mallHome/mallHome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      name: "小行家",
      count: "2000",
    },
    giftData: [
      {
        title: "指南针拼图",
        price: "2000",
        inventory: "20",
        url: "http://cdn.cdlshow.xyz/gift_1.png"
      },
      {
        title: "小鹿公仔 ",
        price: "2000",
        inventory: "20",
        url: "http://cdn.cdlshow.xyz/gift_2.png"
      },
      {
        title: "乔巴公仔 ",
        price: "2000",
        inventory: "20",
        url: "http://cdn.cdlshow.xyz/gift_3.png"
      }, {
        title: "五羊公仔 ",
        price: "2000",
        inventory: "20",
        url: "http://cdn.cdlshow.xyz/gift_4.png"
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getGift(e) {
    let num = e.currentTarget.dataset['index'];
    let _this = this;
    console.log(num)

    wx.navigateTo({
      url: '/page_new/giftForm/giftForm',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('giftData', { data: _this.data.giftData[num] })
      }
    })
  },
  goMyGift() {
    wx.navigateTo({
      url: "/page_new/giftHistory/giftHistory"
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