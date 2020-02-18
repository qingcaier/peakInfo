// const token = wx.getStorageSync("localToken");

// 封装get请求
function _get({ url, data }) {
  // if (token) {
  //为了用户体验，加一个loading效果
  wx.showLoading({ title: "加载中", mask: true });

  return new Promise((resolved, rejected) => {
    // data.token = token;

    const obj = {
      url,
      header: {
        token: wx.getStorageSync("localToken")
      },
      data,
      method: "GET",
      success: res => (res.statusCode === 200 ? resolved(res) : rejected(res)),
      fail: err => rejected(err)
      //   complete: () => {
      //       wx.hideloading();
      //   }
    };
    wx.request(obj);
  });
  // } else {
  //   wx.showToast({
  //     title: "请先授权登录！"
  //   });
  // }
}

// 封装post请求
function _post({ url, data }) {
  // if (token) {
  return new Promise((resolved, rejected) => {
    // data.token = token;

    const obj = {
      url,
      header: {
        token: wx.getStorageSync("localToken")
      },
      data,
      method: "POST",
      success: res => {
        // if (res.statusCode === 400) {
        //   wx.showToast({
        //     title: "请先授权登录！"
        //   });
        // }
        return res.statusCode === 200 ? resolved(res) : rejected(res);
      },
      fail: err => rejected(err)
    };
    wx.request(obj);
  });
  // } else {
  //   wx.showToast({
  //     title: "请先授权登录！"
  //   });
  // }
}

export default {
  _get,
  _post
};
