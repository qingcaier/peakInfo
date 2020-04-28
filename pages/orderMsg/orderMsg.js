import store from "../../store";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isComplete: false, //完成
    isCancel: false, //取消
    formData: {},
    orderData: {},
    shopData: {},
    makerData: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //	获取所有打开的EventChannel事件
    const eventChannel = this.getOpenerEventChannel();
    // 监听 
    eventChannel.on('dataFormCreate', (res) => {
      that.setData({ formData: res.data.form })
      //填充三个主要对象数据
      that.putDataToObj(res.data.form);
      // console.log(res.data.form)
    })
  },
  //填充要给子组件的三个对象
  putDataToObj(form) {

    let shop = form.business_act;
    let shopObj = {};
    shopObj.business_name = shop.title;
    shopObj.address = shop.address;
    shopObj.ad_info = shop.ad_info;
    shopObj.tel = shop.tel;
    shopObj.loc = [shop.location.lng, shop.location.lat];
    this.setData({ shopData: shopObj });

    let orderObj = {};
    orderObj.title = form.title;
    orderObj.act_type = form.orderType.value;
    orderObj.total_count = form.total_count;
    orderObj.initiator = { count: form.current_count };
    orderObj.detail = form.detail;
    orderObj.valid_time = form.time;//这个对象里面数值不一定是number
    let currenTime = new Date();
    orderObj.update_time = currenTime.toLocaleString();
    let offet = parseInt(form.time.day) * 60 * 60 * 1000 * 24 +
      parseInt(form.time.hour) * 60 * 60 * 1000 * +
      parseInt(form.time.minute) * 60 * 1000
    orderObj.end_time = parseInt(currenTime.getTime()) + offet;
    orderObj.picture = form.picture;
    this.setData({ orderData: orderObj });

    this.setData({ makerData: store.data.localUserInfo })

  },

  //完成拼单
  complete() {
    let that = this;
    wx.showModal({
      title: "完成拼单，是否确认？",
      // content: '完成拼单，是否确认？',
      success: function (res) {
        if (res.confirm) {

          try {
            app.ajax.createOrder(that.data.formData).then((res) => {

              // console.log("订单入库：", res);
              that.setData({
                isComplete: true
              });
            });
          } catch (err) {
            console.log(err);
            wx.showToast({
              title: err.data.state.msg,
              icon: "none",
            });
          }


        } else {
          console.log("点击取消回调");
        }
      }
    });
  },
  //修改拼单
  modify() {

    wx.navigateBack({
      delta: 1, // 返回上一级页面。
      success: function () {
        console.log("成功！");
      }
    });
  },
  //取消拼单
  cancel() {
    let that = this;
    wx.showModal({
      title: "取消拼单，是否确认？",
      // content: '完成拼单，是否确认？',
      success: function (res) {
        if (res.confirm) {
          console.log("点击确认回调");
          //**这里进行api请求 */
          that.setData({
            isCancel: true
          });
        } else {
          console.log("点击取消回调");
        }
      }
    });
  },
  /**
     * @method goHome 
     * @description 拼单完成返回首页 
     */
  goHome() {
    wx.navigateTo({
      url: "/pages/remActRouter/remActRouter",
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

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
