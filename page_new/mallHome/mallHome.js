const app = getApp(); import store from "../../store.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      name: "小行家",
      count: "2000",
    },
    giftData: [
      // {
      //   title: "指南针拼图",
      //   price: "2000",
      //   inventory: "20",
      //   url: "http://cdn.cdlshow.xyz/gift_1.png"
      // },
      // {
      //   title: "小鹿公仔 ",
      //   price: "2000",
      //   inventory: "20",
      //   url: "http://cdn.cdlshow.xyz/gift_2.png"
      // },
      // {
      //   title: "乔巴公仔 ",
      //   price: "2000",
      //   inventory: "20",
      //   url: "http://cdn.cdlshow.xyz/gift_3.png"
      // }, {
      //   title: "五羊公仔 ",
      //   price: "2000",
      //   inventory: "20",
      //   url: "http://cdn.cdlshow.xyz/gift_4.png"
      // }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({ userInfo: store.data.localUserInfo })
    app.ajax.getGiftList().then(
      res => {
        // console.log(res.data.data)
        if (!res.data.data) {
          console.log("找不到")
        } else {
          that.setData({
            giftData: res.data.data
          })
        }
      }).catch(err => { console.log(err) });
  },
  onShow: function () {
    let that = this;
    this.getUserData(store.data.localUserInfo.openid).then(res => {
      console.log("onshow UserData:", res);
      that.setData({ userInfo: res });
      store.data.localUserInfo = res;
    }).catch(err => {
      console.log("错误", err);
    })
    app.ajax.getGiftList().then(
      res => {
        // console.log(res.data.data)
        if (!res.data.data) {
          console.log("找不到")
        } else {
          that.setData({
            giftData: res.data.data
          })
        }
      }).catch(err => { console.log(err) });
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
  * @method getUserData 
  * @description 获取拼单发起者的信息 
  * @param { String } openid 用户的openid
  * @return { Object } makerData
  */
  getUserData(openid) {
    return new Promise((resolve, reject) => {
      var makerObj = {};
      app.ajax.getUserData({ user_openid: openid })
        .then(
          res => {
            makerObj = res.data.data;
            resolve(makerObj);
          }
        ).catch(
          err => {
            reject(err);
          }
        )
    })
  },
})