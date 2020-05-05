var app = getApp(); import store from "../../store.js";
Page({

  data: {
    chatData: {
      // "_id": "5eaee52fe966c485ecd2d405",
      // "order_id": "5eaee52fe966c485ecd2d404",
      // "msgInfor": [
      //   {
      //     "_id": "5eaee52fe966c485ecd2d406",
      //     "user_id": "5eaee508e966c485ecd2d400",
      //     "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Tp8K06cGYIJLB1pUaibXuFouypKTNE9wnQGmljzoaATibSicS7eKnLnbShwv5Q1sdo8PI17AO0rq4GQfFutxTP2eA/132",
      //     "msgImg": "",
      //     "msg": "各位一起拼单哟",
      //     "name": "蔡东林",
      //     "time": "1588520239436"
      //   }
      // ],
      // "name": "拼单 3:23"
    },

    sendText: "",//发送的消息
    sendImg: "",//发送图片
    userInfo: {
      userId: 2,
      name: "呵呵",
      img: 'https://wx.qlogo.cn/mmopen/vi_32/Tp8K06cGYIJLB1pUaibXuFouypKTNE9wnQGmljzoaATibSicS7eKnLnbShwv5Q1sdo8PI17AO0rq4GQfFutxTP2eA/132'
    },//app.appData.userInfo,
    scrolltop: 999,

  },

  /**输入内容 */
  sendTextBind: function (e) {
    this.setData({
      sendText: e.detail.value
    });
    // console.log(this.data.sendText);
  },

  onLoad: function (options) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('dataFormMessage', (res) => {
      that.setData({ chatData: res.data.chatData })
      console.log(that.data.chatData);
    })
    wx.setNavigationBarTitle({
      title: that.data.chatData.name
    });
    that.setData({ userInfo: store.data.localUserInfo })
    var interval = setInterval(function () {
      that.getChatData()
    }, 2000) //循环间隔 单位ms
    that.setData({ timer: interval })
  },
  //销毁轮询器
  onUnload: function () {
    clearInterval(this.data.timer);
  },
  //请求聊天数据
  getChatData() {
    let that = this;
    console.log("获取新消息");
    app.ajax.getChatHome({ order_id: that.data.chatData.orderid }).then((res) => {
      if (res.data.state.status == 200) {
        that.setData({ "chatData.msgInfor": res.data.data.msgInfor })
        console.log(res.data.data.msgInfor);
      }
    })
  },
  /**发送消息 */
  sendBtn: function (e) {
    let that = this;
    var msgJson = {
      user_id: this.data.userInfo._id,
      avatarUrl: this.data.userInfo.avatarUrl,
      msgImg: this.data.sendImg,
      msg: this.data.sendText,
      name: this.data.userInfo.nickName,
    }
    //发送消息
    console.log('发送消息事件！', msgJson);
    app.ajax.updateChat({ chatId: that.data.chatData._id, msgInfor: msgJson }).then((res) => {
      if (res.data.state.status == 200) {
        that.setData({ "chatData.msgInfor": res.data.data.msgInfor })
        // console.log(res.data.data.msgInfor);

      }
    })
    this.setData({
      sendText: ""//发送消息后，清空文本框
    });
  },



})