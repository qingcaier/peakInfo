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
  checkActByDistance: data => {
    return https._post({ url: base.checkActByDistance, data });
  },
  checkActOrder: data => {
    return https._post({
      url: base.checkActOrder,
      data
    });
  },
  //七牛云凭证
  getQiniuyun: () => {
    return https._get({ url: base.getqiniuyun });
  }
};

export default ajax;
