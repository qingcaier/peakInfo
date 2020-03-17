const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buildType: 0,
    inputShowed: false,
    inputVal: "",
    nameList: ["所有类型"],
    items: ['广州市', '越秀区', '海珠区', '荔湾区', '天河区', '白云区', '黄埔区',
      '花都区',
      '番禺区', '萝岗区', '南沙区', '从化市', '增城市'],
    radioSee: false,
    BaseUrl: "http://cdn.cdlshow.xyz/",
    buidings: [],
    searchBuildData: {
      "type": "",
      "area": "",
      "searchWord": "",
      "page": 1,
      "pageSize": 10
    },
    keyWord: "",

    type: '类型',
    location: '位置',
    type_num: 0,
    location_num: 0,
    floorstatus: false,
  },
  isShow: true,
  currentTab: 0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.searchHistorical(this.data.searchBuildData)
    this.getAllType()
    this.setData({
      search: this.search.bind(this)
    });
  },
  //搜索建筑物,加到数组里
  searchHistorical(searchBuildData) {
    var that = this
    app.ajax.searchHistoricalData(searchBuildData).then(
      res => {
        console.log(res.data.data)
        if (!res.data.count) {
          console.log("不存在 或者 没有了")
        } else {
          let list = that.data.buidings
          list = list.concat(res.data.data)
          that.setData({
            buidings: list
          })
        }
      }).catch(err => { console.log(err) });
  },
  //获取所有建筑类型
  getAllType() {
    var that = this
    app.ajax.getAllType().then(
      res => {
        if (res.data.state.status == 200) {
          var list = that.data.nameList.concat(res.data.data);
          that.setData({
            nameList: list
          })
        } else {
          console.log(res.data.state)
        }
      }).catch(err => { console.log(err) });
  },
  //防抖
  debounce(fn, delay) {
    var timeout
    return () => {
      clearTimeout(timeout)
      timeout = setTimeout(fn, delay)
    }
  },
  //输入关键字
  bindKeyInput: function (e) {
    var that = this;
    this.setData({
      keyWord: e.detail.value
    });
    // that.debounce(that.search(), 1000)

  },
  //搜索
  search: function () {
    console.log(this.data.keyWord)
    // var that = this;
    // console.log(value)
    var newReqData = this.data.searchBuildData;
    newReqData.searchWord = this.data.keyWord;
    newReqData.page = 1;
    this.setData({
      buidings: [],
      searchBuildData: newReqData
    })
    this.setData({
      displays: "none"
    })
    this.searchHistorical(newReqData)

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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log(this.data.buidings.length)
    let newReqData = this.data.searchBuildData;
    newReqData.page++;
    this.searchHistorical(newReqData)

  },

  // 下拉切换
  hideNav: function () {
    this.setData({
      displays: "none"
    })
  },
  // 区域
  tabNav: function (e) {
    this.setData({
      displays: "block"
    })
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },

  clickType: function (e) {
    console.log(e.target.dataset.name)
    this.setData({
      type_num: e.target.dataset.num
    })
    this.setData({
      type: e.target.dataset.name
    })
    this.setData({
      displays: "none"
    })

    let newReqData = this.data.searchBuildData;
    newReqData.page = 1;
    newReqData.type = this.data.type_num == 0 ? "" : this.data.nameList[this.data.type_num];
    // if (!this.data.keyWord) {
    this.setData({
      buidings: [],
      searchBuildData: newReqData
    })
    // }
    this.searchHistorical(newReqData)

  },
  clickLocation: function (e) {
    console.log(e.target.dataset.name)
    this.setData({
      location_num: e.target.dataset.num
    })
    this.setData({
      location: e.target.dataset.name
    })
    this.setData({
      displays: "none"
    })
    let newReqData = this.data.searchBuildData;
    newReqData.page = 1;
    newReqData.area = this.data.location_num == 0 ? "" : this.data.items[this.data.location_num];
    // if (!this.data.keyWord) {
    this.setData({
      buidings: [],
      searchBuildData: newReqData
    })
    // }
    this.searchHistorical(newReqData)
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

})