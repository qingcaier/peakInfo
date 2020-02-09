import store from "../../store";
import create from "../../utils/create";

const app = getApp();

create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    targetLocation: "华南理工大放声大哭了解过is阿的交付给添加热水学",
    navigator_style: {
      display: "flex",
      "justify-content": "space-around",
      "align-items": "center"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.testCot = this.selectComponent("#test");
  },

  /**
   * 自定义函数
   * */

  showToast: function() {
    this.testCot.showToast("", 2000);
  },

  // 发起拼单跳转
  toCreateOrder: function() {
    wx.navigateTo({
      url: "../createOrder/createOrder"
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
