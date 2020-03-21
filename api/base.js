const baseUrl = "http://localhost:3000/miniprogram";
const base = {
  userlogin: baseUrl + "/userLogin", // 用户登录
  createOrder: baseUrl + "/api/createOrder", // 创建拼单
  checkNeightAct: baseUrl + "/api/checkNeightAct", // 地图附近商家活动
  checkActOrder: baseUrl + "/api/checkActOrder", // 商家活动下有效拼单
  checkActByDistance: baseUrl + "/api/checkActByDistance", // 列表商家活动
  getqiniuyun: baseUrl + "/api/qiniuyun" //七牛云凭证
};

export default base;
