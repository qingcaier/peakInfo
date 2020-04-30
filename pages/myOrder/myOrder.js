// pages/myOrder/myOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [
      // {
      //   img: "../../public/images/store.png",
      //   title: "缺200，满500减200！！！",
      //   detail: "走过路过千万别错过，以纯满500减200，现差200，求拼单！！！",

      //   _typeNumber: 1,
      //   _remainCount: 200,
      //   _validTime: 1582939162423
      // },
      // {
      //   img: "../../public/images/store.png",
      //   title: "缺200，满500减200！！！",
      //   detail: "走过路过千万别错过，以纯满500减200，现差200，求拼单！！！",

      //   _typeNumber: 1,
      //   _remainCount: 200,
      //   _validTime: 1582939162423
      // },
      // {
      //   img: "../../public/images/store.png",
      //   title: "缺200，满500减200！！！",
      //   detail: "走过路过千万别错过，以纯满500减200，现差200，求拼单！！！",

      //   _typeNumber: 1,
      //   _remainCount: 200,
      //   _validTime: 1582939162423
      // },
      // {
      //   img: "../../public/images/store.png",
      //   title: "缺200，满500减200！！！",
      //   detail: "走过路过千万别错过，以纯满500减200，现差200，求拼单！！！",

      //   _typeNumber: 1,
      //   _remainCount: 200,
      //   _validTime: 1582939162423
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //	获取所有打开的EventChannel事件
    const eventChannel = this.getOpenerEventChannel();
    // 监听 
    eventChannel.on('dataFormPerson', (res) => {
      that.setData({ orderList: res.data.orderArr })
      console.log(that.data.orderList)
    })
  },
  goMsg(e) {
    console.log(e);
    let order_id = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: "../joinOrder/joinOrder",
      success: res => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit("dataFormFather", {
          data: {
            order_id: order_id,
            canJoin: false
          }
        });
      }
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