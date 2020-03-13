// page_new/buildingInfo/buildingInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: "http://cdn.cdlshow.xyz/",
    buildData: {
      "_id": "5e672354ac7fc1aed18a3da4",
      "name": "达保罗医院旧址",
      "type": "医疗卫生建筑",
      "period": "中华民国（1911-1949）",
      "site": "广州市越秀区人民中路318号广州市儿童医院内",
      "introduction": "广州市儿童医院为美国基督教会传教士达·保罗私人医院旧 址。1931 年医院迁至官禄路（今观绿路）30 号，更名为达·保 罗医院，后在今址建新院。 现存建筑为四层红砖建筑。首层作为建筑基座设计。二至四 层皆设民族式的琉璃瓦小批檐。水刷石栏杆、斗栱、批檐等防传 统建筑木结构构件均构造精巧。屋顶为仿宋氏歇山，同时也施老 虎窗。室内楼梯采用意大利批荡，大厅地板采用比利时的花地砖， 铜制扶手仍保留当年规格。大楼建成时就配置了电梯间，电梯由 瑞典进口。",
      "picList": [
        "GZ_01_0044_达保罗医院旧址/crop-建筑整体透视或立面1.jpg",
        "GZ_01_0044_达保罗医院旧址/crop-建筑整体透视或立面2.jpg",
        "GZ_01_0044_达保罗医院旧址/crop-细部1.jpg",
        "GZ_01_0044_达保罗医院旧址/crop-细部2.jpg"
      ],
      "icon": "thumbnails/thumbnails_1517453436811.jpg",
      "firstDisplayPic": "GZ_01_0044_达保罗医院旧址/crop-建筑整体透视或立面1.jpg",
      "location": [
        113.253771972657,
        23.119602593316
      ],
      "question": []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let newBuild = this.data.buildData;
    // for (let i = 0; i < newBuild.picture.length; i++) {
    //   newBuild.picture[i] = this.data.baseUrl + newBuild.picture[i];
    // }
    // this.setData({
    //   buildData: newBuild
    // })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})