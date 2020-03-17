//banner
Page({
  data: {
    // 下拉菜单

    type: '类型',
    location: '位置',

    type_num: 0,
    location_num: 0,
    nameList: [
      "中华及广州老字号",
      "交通道路设施",
      "亭台楼阙",
      "传统民居",
      "其他古建筑",
      "其他近现代重要史迹及代表性建筑",
      "典型风格建筑或构筑物",
      "医疗卫生建筑",
      "名人故、旧居",
      "坛庙祠堂",
      "学堂书院",
      "宅第民居",
      "宗教建筑",
      "工业建筑及附属物",
      "店铺作坊",
      "文化教育建筑及附属物",
      "水利设施及附属物",
      "池塘井泉",
      "近现代住宅",
      "重要历史事件及人物活动纪念地",
      "金融商贸建筑"
    ],
    items: [
      '广州',
      '越秀区',
      '海珠区',
      '荔湾区',
      '天河区',
      '白云区',
      '黄埔区',
      '花都区',
      '番禺区', '萝岗区', '南沙区', '从化市', '增城市'],

    // 筛选
    one: 0,
    two: 0,
    third: 0,
    four: 0,
    five: 0,
    six: 0,
    seven: 0,
  },
  isShow: true,
  currentTab: 0,

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
    console.log(e.target.dataset.num)
    this.setData({
      type_num: e.target.dataset.num
    })
    this.setData({
      type: e.target.dataset.name
    })
    this.setData({
      displays: "none"
    })
  },
  onLoad: function (options) {

  },
  // 房型
  clickLocation: function (e) {
    console.log(e.target.dataset.num)
    this.setData({
      location_num: e.target.dataset.num
    })
    this.setData({
      location: e.target.dataset.name
    })
    this.setData({
      displays: "none"
    })
  },
  onLoad: function (options) {

  },


})
