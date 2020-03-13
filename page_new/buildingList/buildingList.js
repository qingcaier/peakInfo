// page_new/buildingList/buildingList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buildType: 0,
    inputShowed: false,
    inputVal: "",
    cho_position: { name: '广州', value: 'gz' },

    items: {
      gz: { name: '广州', value: 'gz', checked: true },
      yx: { name: '越秀区', value: 'yx', checked: false },
      hz: { name: '海珠区', value: 'hz', checked: false },
      lz: { name: '荔湾区', value: 'lz', checked: false },
      th: { name: '天河区', value: 'th', checked: false },
      by: { name: '白云区', value: 'by', checked: false },
      hp: { name: '黄埔区', value: 'hp', checked: false },
      hd: { name: '花都区', value: 'hd', checked: false },
      py: { name: '番禺区', value: 'py', checked: false },
      lg: { name: '萝岗区', value: 'lg', checked: false },
      ns: { name: '南沙区', value: 'ns', checked: false },
      ch: { name: '从化市', value: 'ch', checked: false },
      zc: { name: '增城市', value: 'zc', checked: false },
    },
    radioSee: false,
    BaseUrl: "http://cdn.cdlshow.xyz/",
    buidings: [
      { name: "友谊剧院", url: "http://cdn.cdlshow.xyz/" + "GZ_01_0010_友谊剧院/crop-周边环境1.jpg" },
      { name: "白云宾馆", url: "http://cdn.cdlshow.xyz/" + "GZ_01_0056_白云宾馆/crop-周边环境1.jpg" },
      { name: "海珠桥", url: "http://cdn.cdlshow.xyz/" + "GZ_01_0396_海珠桥/crop-建筑整体透视或立面1.jpg" },
      { name: "华南植物园水榭", url: "http://cdn.cdlshow.xyz/" + "GZ_01_0397_华南植物园水榭/crop-建筑整体透视或立面2.jpg" },
      { name: "兰圃", url: "http://cdn.cdlshow.xyz/" + "GZ_01_0398_兰圃/crop-建筑整体透视或立面1.jpg" }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      search: this.search.bind(this)
    })
  },
  search: function (value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([{ text: '搜索结果', value: 1 }, { text: '搜索结果2', value: 2 }])
      }, 200)
    })
  },
  selectResult: function (e) {
    console.log('select result', e.detail)
  },
  setBuildType: function (e) {
    let num = e.currentTarget.dataset['index'];
    // console.log(num)
    this.setData({
      buildType: num
    })
  },
  radioChange: function (e) {
    let newValue = e.detail.value;
    // console.log(this.data.items[this.data.cho_position.value])
    let newStr = 'items.' + newValue + ".checked";
    let oldStr = 'items.' + this.data.cho_position.value + ".checked";
    this.setData({
      radioSee: false,
      [oldStr]: false,
      [newStr]: true,
      cho_position: this.data.items[newValue],
    });
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    // console.log(this.data.items[newValue])
  },
  setRadioSee() {
    this.setData({
      radioSee: this.data.radioSee ? false : true
    });
    // console.log(this.data.radioSee)
  },
  goInfor() {
    wx.navigateTo({
      url: '/page_new/buildingInfo/buildingInfo'
    })
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