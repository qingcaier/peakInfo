import store from "../../store.js"; const app = getApp();
Page({
  data: {
    historyData: [],
    userOpenId: ''
  },

  onShow: function (options) {
    let that = this;
    that.setData({ userOpenId: store.data.localUserInfo.openid });
    that.getHistory()
  },
  getHistory() {
    let that = this;
    app.ajax.getExcHistory({ openid: that.data.userOpenId }).then(res => {
      if (res.data.state.status == 200) {
        that.setData({ historyData: res.data.data })

      }
    })
  }



})
