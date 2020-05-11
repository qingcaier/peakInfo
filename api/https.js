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
        token: wx.getStorageSync("localToken"),
      },
      data,
      method: "GET",
      success: (res) => {
        let status = res.data.state.status;
        if (status === 403) {
          wx.showModal({
            title: "",
            content: "请先登录！",
            confirmText: "去登录",

            success: (response) => {
              if (response.cancel) {
                wx.showToast({
                  title: "登录：已取消",
                  icon: "none",
                });
                // setTimeout(() => {
                //   // wx.navigateBack();
                //   wx.navigateBack({
                //     delta: 3
                //   });
                // }, 1000);
              } else if (response.confirm) {
                console.log("1111");
                // 拒绝授权后再次重新授权
                wx.navigateTo({
                  url: "/page_new/login/login",
                });
              }
            },
          });
        } else if (status === 404) {
          wx.showModal({
            title: "",
            content: "登录已过期！",
            confirmText: "去登录",
            success: (response) => {
              if (response.cancel) {
                wx.showToast({
                  title: "登录：已取消",
                  icon: "none",
                });
                // setTimeout(() => {
                //   wx.navigateBack();
                // }, 1000);
              } else if (response.confirm) {
                // 拒绝授权后再次重新授权
                wx.navigateTo({
                  url: "/page_new/login/login",
                  success: (res) => {
                    console.log(res);
                  },
                  fail: (err) => {
                    console.log(err);
                  },
                });
              }
            },
          });
        } else {
          wx.hideLoading();
          return status === 200 ? resolved(res) : rejected(res);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: err,
          icon: "none",
        });
        // rejected(err);
      },
      complete: () => {
        wx.hideLoading();
      },
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
  //为了用户体验，加一个loading效果
  if (url.search(/chatHome/) == -1) {
    wx.showLoading({ title: "加载中", mask: true });
  }

  // if (token) {
  return new Promise((resolved, rejected) => {
    // data.token = token;

    const obj = {
      url,
      header: {
        token: wx.getStorageSync("localToken"),
      },
      data,
      method: "POST",
      success: (res) => {
        let status = res.data.state.status;
        if (status === 403) {
          wx.showModal({
            title: "",
            content: "请先登录！",
            confirmText: "去登录",

            success: (response) => {
              if (response.cancel) {
                wx.showToast({
                  title: "登录：已取消",
                  icon: "none",
                });
                // setTimeout(() => {
                //   // wx.navigateBack();
                //   wx.navigateBack({
                //     delta: 3
                //   });
                // }, 1000);
              } else if (response.confirm) {
                console.log("1111");
                // 拒绝授权后再次重新授权
                wx.navigateTo({
                  url: "/page_new/login/login",
                });
              }
            },
          });
        } else if (status === 404) {
          wx.showModal({
            title: "",
            content: "登录已过期！",
            confirmText: "去登录",
            success: (response) => {
              if (response.cancel) {
                wx.showToast({
                  title: "登录：已取消",
                  icon: "none",
                });
                // setTimeout(() => {
                //   wx.navigateBack();
                // }, 1000);
              } else if (response.confirm) {
                // 拒绝授权后再次重新授权
                wx.navigateTo({
                  url: "/page_new/login/login",
                  success: (res) => {
                    console.log(res);
                  },
                  fail: (err) => {
                    console.log(err);
                  },
                });
              }
            },
          });
        } else {
          wx.hideLoading();
          return status === 200 ? resolved(res) : rejected(res);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: err,
          icon: "none",
        });
        // rejected(err);
      },
      complete: () => {
        wx.hideLoading();
      },
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
  _post,
};
