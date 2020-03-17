import base from "./base";
import https from "./https";

const ajax = {
  userLogin: data => {
    return https._post({ url: base.userlogin, data });
  },
  createOrder: data => {
    return https._post({ url: base.createOrder, data });
  },
  checkNeightAct: data => {
    return https._post({ url: base.checkNeightAct, data });
  },
  checkActOrder: data => {
    return https._post({
      url: base.checkActOrder,
      data
    })
  },
  //七牛云凭证
  getQiniuyun: () => {
    return https._get({ url: base.getqiniuyun });
  },
  //1. 根据条件检索符合的所有建筑信息
  searchHistoricalData: data => {
    return https._post({ url: base.searchHistoricalData, data })
  },
  //2. 根据建筑ID获取建筑详细资料
  getSingleDetail: data => {
    return https._post({ url: base.getSingleDetail, data })
  },
  //3. 查看地图：显示地图建筑icon
  checkMap: data => {
    return https._post({ url: base.checkMap, data })
  },
  //14. 获取礼品列表
  getGiftList: data => {
    return https._post({ url: base.getGiftList, data })
  },
  //获取所有建筑类型
  getAllType: data => {
    return https._post({ url: base.getAllType, data })
  },

};

export default ajax;
