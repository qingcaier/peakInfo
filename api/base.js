const baseUrl = "http://localhost:3000/miniprogram";
const base = {
  userlogin: baseUrl + "/userLogin",
  createOrder: baseUrl + "/api/createOrder",
  checkNeightAct: baseUrl + "/api/checkNeightAct",
  checkActOrder: baseUrl + "/api/checkActOrder",
  getqiniuyun: baseUrl + "/api/qiniuyun", //七牛云凭证
  searchHistoricalData: baseUrl + "/api/searchHistoricalData",
  getSingleDetail: baseUrl + "/api/getSingleDetail",
  checkMap: baseUrl + "/api/checkMap",
  getGiftList: baseUrl + "/api/getGiftList",
  getAllType: baseUrl + "/api/getAllType"
};

export default base;
