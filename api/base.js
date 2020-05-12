// const baseUrl = "http://192.168.1.38:3000/miniprogram";
// const baseUrl = "http://192.168.101.45:3000/miniprogram";
const baseUrl = "http://192.168.2.104:3000/miniprogram";

const base = {
  checkLogin: baseUrl + "/checkLogin",
  userlogin: baseUrl + "/userLogin",
  createOrder: baseUrl + "/api/createOrder",
  joinOrder: baseUrl + "/api/joinOrder",
  getOrderData: baseUrl + "/api/orderDetail",
  getShopData: baseUrl + "/api/shopDetail",
  getUserData: baseUrl + "/api/userDetai",
  checkMyOrder: baseUrl + "/api/checkMyOrder",
  getChatHome: baseUrl + "/api/chatHome",
  updateChat: baseUrl + "/api/updateChat",

  checkNeightAct: baseUrl + "/api/checkNeightAct",
  checkActByDistance: baseUrl + "/api/checkActByDistance",
  checkActOrder: baseUrl + "/api/checkActOrder",
  getqiniuyun: baseUrl + "/api/qiniuyun", //七牛云凭证

  searchHistoricalData: baseUrl + "/api/searchHistoricalData",
  getAllType: baseUrl + "/api/getAllType",
  getSingleDetail: baseUrl + "/api/getSingleDetail",
  checkMap: baseUrl + "/api/checkMap",
  getPunchFinish: baseUrl + "/api/getPunchFinish",
  getJigsawFinish: baseUrl + "/api/getJigsawFinish",
  getPunchList: baseUrl + "/api/getPunchList",
  finishPunch: baseUrl + "/api/finishPunch",
  getTaskMap: baseUrl + "/api/getTaskMap",
  getTaskList: baseUrl + "/api/getTaskList",
  getMappingPic: baseUrl + "/api/getMappingPic",
  finishMapping: baseUrl + "/api/finishMapping",
  finishHuntTrea: baseUrl + "/api/finishHuntTrea",
  getJigsawList: baseUrl + "/api/getJigsawList",
  finishJigsaw: baseUrl + "/api/finishJigsaw",
  getUserCredit: baseUrl + "/api/getUserCredit",
  getGiftList: baseUrl + "/api/getGiftList",
  getExcHistory: baseUrl + "/api/getExcHistory",
  exchangeGift: baseUrl + "/api/exchangeGift",
};

export default base;
