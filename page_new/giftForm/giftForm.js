// page_new/giftForm/giftForm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userCount: 0,

    gift: {
      // name: "xxxxx",
      // credit: "xxx",
      // inventory: "xx",
      // picture: "http://cdn.cdlshow.xyz/gift_3.png"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    that.setData({ userCount: store.data.localUserInfo.credit })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('giftData', function (data) {
      console.log(data);
      _this.setData({
        gift: data
      })
    })
  },
  buyGift() {

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

})