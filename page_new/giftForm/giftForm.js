// page_new/giftForm/giftForm.js
import store from "../../store.js"; const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userCount: 0,

    gift: {
      // {
      //   title: "指南针拼图",
      //   price: "2000",
      //   inventory: "20",
      //   url: "http://cdn.cdlshow.xyz/gift_1.png"
      // }
    },
    getGiftData: {
      receivedName: "",
      receivedSite: '',
      receivedPhoneNum: ""
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
      console.log(data.data);
      that.setData({
        gift: data.data
      })
    })
  },
  buyGift() {
    let that = this;
    if (that.data.userCount >= that.data.gift.price) {
      let that = this;
      let obj = {
        openid: store.data.localUserInfo.openid,
        sumCredit: that.data.userCount,
        giftID: that.data.gift._id,
        giftCredit: that.data.gift.price,
        receivedName: that.data.getGiftData.receivedName,
        receivedPhoneNum: that.data.getGiftData.receivedPhoneNum,
        receivedSite: that.data.getGiftData.receivedSite,
      }
      app.ajax.exchangeGift(obj).then(res => {
        if (res.data.state.status == 200) {
          // console.log(res.data);
          wx.showModal({
            title: "兑换成功",
            showCancel: false,
            success: function (res) {
              wx.navigateTo({ url: "/page_new/mallHome/mallHome" })
            }
          });
        }
      })
    } else {
      wx.showModal({
        title: "积分不足",
        showCancel: false,
        success: function (res) {
        }
      });
    }
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