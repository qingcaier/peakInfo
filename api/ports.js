import base from "./base";
import https from "./https";

const ajax = {
  userLogin: data => {
    return https._post({ url: base.userlogin, data });
  },
  createOrder: data => {
    return https._post({ url: base.createOrder, data });
  }
};

export default ajax;
