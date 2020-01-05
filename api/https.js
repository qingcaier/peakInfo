const token = wx.getStorageSync("localToken");

// 封装get请求
function _get({ url, data }) {
  //为了用户体验，加一个loading效果
  wx.showLoading({ title: "加载中", mask: true });

  return new Promise((resolved, rejected) => {
    const obj = {
      url,
      header: {
        token
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
}

// 封装post请求
function _post({ url, data }) {
  return new Promise((resolved, rejected) => {
    const obj = {
      url,
      header: {
        token
      },
      data,
      method: "POST",
      success: res => (res.statusCode === 200 ? resolved(res) : rejected(res)),
      fail: err => rejected(err)
    };
    wx.request(obj);
  });
}

export default {
  _get,
  _post
};
