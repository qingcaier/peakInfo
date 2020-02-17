Page({
<<<<<<< HEAD
=======

>>>>>>> miniprogram
  /**
   * 页面的初始数据
   */
  data: {
<<<<<<< HEAD
    isComplete: false, //完成
    isCancel: false //取消
=======
    isComplete: false,//完成
    isCancel: false,//取消

>>>>>>> miniprogram
  },

  /**
   * 生命周期函数--监听页面加载
   */
<<<<<<< HEAD
  onLoad: function(options) {},
=======
  onLoad: function (options) {

  },
>>>>>>> miniprogram
  //完成拼单
  complete() {
    let that = this;
    wx.showModal({
<<<<<<< HEAD
      title: "完成拼单，是否确认？",
      // content: '完成拼单，是否确认？',
      success: function(res) {
=======
      title: '完成拼单，是否确认？',
      // content: '完成拼单，是否确认？',
      success: function (res) {
>>>>>>> miniprogram
        if (res.confirm) {
          // console.log('点击确认回调')
          //**这里进行api请求 */
          that.setData({
            isComplete: true
          });
        } else {
<<<<<<< HEAD
          console.log("点击取消回调");
        }
      }
    });
=======
          console.log('点击取消回调')
        }
      }
    })


>>>>>>> miniprogram
  },
  //修改拼单
  modify() {
    // let pages = getCurrentPages(); //获取当前页面pages里的所有信息。
<<<<<<< HEAD
    // let prevPage = pages[pages.length - 2]; //prevPage 是获取上一个页面的js里面的pages的所有信息。-2 是上一个页面，-3是上上个页面以此类推。
=======
    // let prevPage = pages[pages.length - 2]; //prevPage 是获取上一个页面的js里面的pages的所有信息。-2 是上一个页面，-3是上上个页面以此类推。                                                           
>>>>>>> miniprogram
    // prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
    //   id: this.data.orderInfo.id
    // })//上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。
    // //最后就是返回上一个页面。
    wx.navigateBack({
      delta: 1, // 返回上一级页面。
<<<<<<< HEAD
      success: function() {
        console.log("成功！");
      }
    });
=======
      success: function () {
        console.log('成功！')
      }
    })
>>>>>>> miniprogram
  },
  //取消拼单
  cancel() {
    let that = this;
    wx.showModal({
<<<<<<< HEAD
      title: "取消拼单，是否确认？",
      // content: '完成拼单，是否确认？',
      success: function(res) {
        if (res.confirm) {
          console.log("点击确认回调");
=======
      title: '取消拼单，是否确认？',
      // content: '完成拼单，是否确认？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确认回调')
>>>>>>> miniprogram
          //**这里进行api请求 */
          that.setData({
            isCancel: true
          });
        } else {
<<<<<<< HEAD
          console.log("点击取消回调");
        }
      }
    });
=======
          console.log('点击取消回调')
        }
      }
    })
>>>>>>> miniprogram
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
<<<<<<< HEAD
  onReady: function() {},
=======
  onReady: function () {

  },
>>>>>>> miniprogram

  /**
   * 生命周期函数--监听页面显示
   */
<<<<<<< HEAD
  onShow: function() {},
=======
  onShow: function () {

  },
>>>>>>> miniprogram

  /**
   * 生命周期函数--监听页面隐藏
   */
<<<<<<< HEAD
  onHide: function() {},
=======
  onHide: function () {

  },
>>>>>>> miniprogram

  /**
   * 生命周期函数--监听页面卸载
   */
<<<<<<< HEAD
  onUnload: function() {},
=======
  onUnload: function () {

  },
>>>>>>> miniprogram

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
<<<<<<< HEAD
  onPullDownRefresh: function() {},
=======
  onPullDownRefresh: function () {

  },
>>>>>>> miniprogram

  /**
   * 页面上拉触底事件的处理函数
   */
<<<<<<< HEAD
  onReachBottom: function() {},
=======
  onReachBottom: function () {

  },
>>>>>>> miniprogram

  /**
   * 用户点击右上角分享
   */
<<<<<<< HEAD
  onShareAppMessage: function() {}
});
=======
  onShareAppMessage: function () {

  }
})
>>>>>>> miniprogram
