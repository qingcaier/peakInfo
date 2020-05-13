import base from "./base";
import https from "./https";

const ajax = {
  // 验证是否登录
  checkLogin: () => https._post({ url: base.checkLogin }),

  // 登录
  userLogin: (data) => https._post({ url: base.userlogin, data }),

  // 创建拼单
  createOrder: (data) => https._post({ url: base.createOrder, data }),
  // 用户参与拼单
  joinOrder: (data) => https._post({ url: base.joinOrder, data }),
  // 用户退出拼单
  exitOrder: (data) => https._post({ url: base.exitOrder, data }),
  // 用户修改拼单
  editOrder: (data) => https._post({ url: base.editOrder, data }),
  //获取拼单数据
  getOrderData: (data) => https._post({ url: base.getOrderData, data }),

  // 返回线下拼单附近商家活动
  checkNeightAct: (data) => https._post({ url: base.checkNeightAct, data }),

  // 返回线下拼单列表的商家
  checkActByDistance: (data) =>
    https._post({ url: base.checkActByDistance, data }),

  // 根据商家查询对应拼单
  checkActOrder: (data) => https._post({ url: base.checkActOrder, data, }),

  // 根据id查询商家
  getShopData: (data) => https._post({ url: base.getShopData, data, }),

  //七牛云凭证
  getQiniuyun: () => https._get({ url: base.getqiniuyun }),

  // 获取拼单发起者的信息 
  getUserData: (data) => https._post({ url: base.getUserData, data, }),

  // 获取用户相关的订单
  checkMyOrder: (data) => https._post({ url: base.checkMyOrder, data, }),
  // 获取订单的聊天信息
  getChatHome: (data) => https._post({ url: base.getChatHome, data, }),
  // 更新聊天信息
  updateChat: (data) => https._post({ url: base.updateChat, data, }),











  //获取所有建筑类型
  getAllType: (data) => https._post({ url: base.getAllType, data }),

  //1. 根据条件检索符合的所有建筑信息
  searchHistoricalData: (data) =>
    https._post({ url: base.searchHistoricalData, data }),

  //2. 根据建筑ID获取建筑详细资料
  getSingleDetail: (data) => https._post({ url: base.getSingleDetail, data }),

  //3. 查看地图：显示地图建筑icon
  checkMap: (data) => https._post({ url: base.checkMap, data }),

  //3.1 匹配完成打卡状态下的建筑
  getPunchFinish: (data) => https._post({ url: base.getPunchFinish, data }),

  //3.2 匹配完成拼图状态下的建筑
  getJigsawFinish: (data) => https._post({ url: base.getJigsawFinish, data }),

  //4. 获取打卡记录列表信息
  getPunchList: (data) => https._post({ url: base.getPunchList, data }),

  //5. 完成答题打卡：记录答题结果并叠加积分（前端进行匹配用户位置与建筑位置）
  finishPunch: (data) => https._post({ url: base.finishPunch, data }),

  //6. 获取任务建筑中心区域，打开小程序页面就定位到任务位置
  getTaskMap: (data) => https._post({ url: base.getTaskMap, data }),

  //7. 获取用户任务列表信息
  getTaskList: (data) => https._post({ url: base.getTaskList, data }),

  //8. 获取寻宝需要定向匹配的照片
  getMappingPic: (data) => https._post({ url: base.getMappingPic, data }),

  //9. 完成照片匹配
  finishMapping: (data) => https._post({ url: base.finishMapping, data }),

  //10. 完成寻宝答题，记录答题结果、记录积分并更新任务状态
  finishHuntTrea: (data) => https._post({ url: base.finishHuntTrea, data }),

  //11. 获取用户拼图记录列表信息
  getJigsawList: (data) => https._post({ url: base.getJigsawList, data }),

  //12. 完成拼图，记录拼图信息并累计积分
  finishJigsaw: (data) => https._post({ url: base.finishJigsaw, data }),

  //13. 获得用户积分信息
  getUserCredit: (data) => https._post({ url: base.getUserCredit, data }),

  //14. 获取礼品列表
  getGiftList: (data) => https._post({ url: base.getGiftList, data }),

  //15. 获取用户兑换历史记录列表
  getExcHistory: (data) => https._post({ url: base.getExcHistory, data }),

  //16. 兑换礼品，记录历史并扣除积分
  exchangeGift: (data) => https._post({ url: base.exchangeGift, data }),

};

export default ajax;
