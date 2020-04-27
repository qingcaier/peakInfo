var app = getApp();
Page({
  data: {

    myInfo: {
      userId: 1,
      name: "呵呵",
      img: 'https://g.csdnimg.cn/static/user-reg-year/2x/3.png'
    },
    socket_open: false,//判断连接是否打开
    sendText: "",//发送的消息
    serverMsg: [],//接受的服务端的消息
    userInfo: {
      userId: 2,
      name: "呵呵",
      img: 'https://wx.qlogo.cn/mmopen/vi_32/Tp8K06cGYIJLB1pUaibXuFouypKTNE9wnQGmljzoaATibSicS7eKnLnbShwv5Q1sdo8PI17AO0rq4GQfFutxTP2eA/132'
    },//app.appData.userInfo,
    scrolltop: 999,
    order_id: "111",
    chatId: "5e738b26813b0022bc86cfcf"
  },

  /**输入内容 */
  sendTextBind: function (e) {
    this.setData({
      sendText: e.detail.value
    });
    // console.log(this.data.sendText);
  },
  /**发送消息 */
  sendBtn: function (e) {
    var msgJson = {
      user: {
        id: this.data.userInfo.userId,//app.appData.userInfo.userId, //唯一ID区分身份
        name: this.data.userInfo.name, //显示用姓名
        img: this.data.userInfo.img, //显示用头像
      },
      order_id: this.data.order_id,
      msg: this.data.sendText,//发送的消息
      chatId: this.data.chatId,
      justConnect: false
    }
    //发送消息
    console.log('发送消息事件！', msgJson);
    this.send_socket_message(JSON.stringify(msgJson));
    this.setData({
      sendText: ""//发送消息后，清空文本框
    });
  },
  onLoad: function (options) {
    // app.login();
    // this.setData({
    //     userInfo: app.appData.userInfo
    // });
    //初始化
    this.wssInit();
  },
  wssInit() {
    var that = this;
    //建立连接
    wx.connectSocket({
      url: 'ws://localhost:3000/chat'//app.appData.socket
    })
    //监听WebSocket连接打开事件。
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！');
      that.setData({
        socket_open: true
      });
      var msgJson = {
        user: {
          id: that.data.userInfo.userId,//app.appData.userInfo.userId, //唯一ID区分身份
          name: that.data.userInfo.name, //显示用姓名
          img: that.data.userInfo.img, //显示用头像
        },
        order_id: that.data.order_id,
        msg: "欢迎来参加拼单讨论",//发送的消息
        chatId: that.data.chatId,
        justConnect: true
      }
      //发送消息
      console.log('发送消息事件！', msgJson);
      that.send_socket_message(JSON.stringify(msgJson));
    });
    //监听WebSocket接受到服务器的消息事件。
    wx.onSocketMessage(function (res) {
      var server_msg = JSON.parse(res.data);
      console.log('收到：', server_msg);
      if (server_msg.state == 200) {
        var msgnew = that.data.serverMsg;
        if (server_msg.data.msgInfor) {
          msgnew = msgnew.concat(server_msg.data.msgInfor);
        }
        if (!that.data.chatId) {
          that.setData({
            chatId: server_msg.data._id
          });
        }
        that.setData({
          serverMsg: msgnew,
          scrolltop: msgnew.length * 100
        });
        console.log("消息链：", that.data.serverMsg);
      }
    });
    //监听WebSocket错误。
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！', res)
    });


  },
  send_socket_message: function (msg) {
    //socket_open，连接打开的回调后才会为true，然后才能发送消息
    if (this.data.socket_open) {
      console.log("send: ", msg)
      wx.sendSocketMessage({
        data: msg
      })
    }
  }
})