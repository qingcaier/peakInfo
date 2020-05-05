// page_new/giftForm/giftForm.js
import store from "../../store.js";
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
    },
    getGiftData: {
      openid: "",
      giftID: "",
      receivedName: "",
      receivedSite: '',
      receivedPhoneNum: "",
      deliveryState: 0,
      // time
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({ userCount: store.data.localUserInfo.credit })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('giftData', function (data) {
      console.log(data);
      that.setData({
        gift: data
      })
    })
  },
  buyGift() {

    let that = this;

  },
  // 双向绑定输入框
  formInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`getGiftData.${field}`]: e.detail.value,
    });
    // console.log(e);
    // console.log(this.data.validateData);
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})