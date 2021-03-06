import store from "../../store";
import create from "../../utils/create";

const Func = require("../../public/util/func");
const func = new Func();

const app = getApp();

create(store, {
  data: {
    files: [
      // {
      //   url:
      //     "http://mmbiz.qpic.cn/mmbiz_png/VUIF3v9blLsicfV8ysC76e9fZzWgy8YJ2bQO58p43Lib8ncGXmuyibLY7O3hia8sWv25KCibQb7MbJW3Q7xibNzfRN7A/0"
      // }
      // {
      //   loading: true
      // },
      // {
      //   error: true
      // }
    ],
    orderTypes: [
      {
        value: 0,
        label: "拼件",
      },
      {
        value: 1,
        label: "拼额",
      },
    ],
    orderTypeIndex: 0, // 拼单类型下标

    business_acts: [], // 腾讯地图接口返回的附近的商家
    business_actIndex: 0,

    validateData: {
      title: "", // 拼单标题
      total_count: "", // 拼单总额
      current_count: "", // 目前（发起者）的拼额
      detail: "这里是详情哦", // 拼单详情
      time: {
        // 拼单有效时长
        day: 0,
        hour: 0,
        minute: 10,
      },
    },

    formData: {
      picture: [

      ], // 图片路径
      orderType: {}, // 拼单类型
      business_act: {}, // 所选商家
    },

    totalData: {},

    rules: [
      {
        name: "title",
        rules: { required: true, message: "标题是必填项" },
      },
      {
        name: "total_count",
        rules: {
          required: true,
          message: "拼单总数是必填项",
          validator: function (rule, value, param, models) {
            if (isNaN(value) || value <= 0) {
              return rule.message;
            }
          },
        },
      },
      {
        name: "current_count",
        rules: {
          required: true,
          message: "您已拼了多少",
          validator: function (rule, value, param, models) {
            if (isNaN(value) || value <= 0) {
              return rule.message;
            }
          },
        },
      },
      {
        name: "detail",
        rules: {
          maxlength: 500,
          message: "详情超过了500字",
        },
      },
      {
        name: "time",
        rules: [
          {
            validator: function (rule, value, param, models) {
              for (let i in value) {
                if (isNaN(value[i]) || value[i] < 0) {
                  return rule.message;
                }
              }
            },
            message: "请输入有效数字",
          },
        ],
      },
    ],
  },

  onLoad: async function () {
    try {
      let business_act = await this.getNeightShop();

      let address = (await this.getUserLocation()).address;

      this.setData({
        selectFile: this.selectFile.bind(this),
        uploadFile: this.uploadFile.bind(this),
        business_acts: business_act,
        [`formData.business_act`]: business_act[0],
        [`formData.orderType`]: this.data.orderTypes[0],
        userAddress: address,
      });
    } catch (err) {
      wx.showToast({
        title: err,
        icon: "none",
      });
    }

    // this.getQiniuyun();
  },

  // 获取用户周围商家
  getNeightShop: function () {
    return new Promise((resolve, reject) => {
      // 获取周围商店
      app.qqMap.search({
        keyword: "购物",
        // filter: "category=购物",
        address_format: "short",
        // location: {
        //   latitude: 23.612472,
        //   longitude: 116.30525
        // },
        page_size: 20,
        // page_index: 2,
        success: (res) => {
          console.log(res.status, res.message);
          console.log(res.data);
          let business_act = res.data;
          // this.setData({
          //   business_acts: res.data,
          //   [`formData.business_act`]: res.data[0]
          // });
          resolve(business_act);
        },
        fail: (res) => {
          console.log(res.status, res.message);
          reject(res);
        },
        complete: (res) => {
          console.log(res.status, res.message);
        },
      });
    });
  },

  // 获取用户当前位置经纬度
  getUserLocation: function () {
    return new Promise((resolve, reject) => {
      // 获取自身位置（地址逆解析）
      app.qqMap.reverseGeocoder({
        // location: {
        //   latitude,
        //   longitude
        // },
        ger_poi: 1,
        success: (res) => {
          console.log(res.status, res.message);
          console.log(res.result);

          let currentLocation = res.result;

          resolve(currentLocation);
        },
        fail: (err) => {
          console.log(err.status, err.message);
          reject(err);
        },
        complete: (res) => {
          // console.log(res.status, res.message);
        },
      });
    });
  },

  // 双向绑定输入框
  formInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`validateData.${field}`]: e.detail && e.detail.value,
    });
    console.log(e);
    console.log(this.data.validateData);
  },

  bindOrderTypeChange: function (e) {
    console.log("picker country code 发生选择改变，携带值为", e.detail.value);
    console.log(e);

    // console.log(value);
    this.setData({
      orderTypeIndex: e.detail.value,
      [`formData.orderType`]: this.data.orderTypes[e.detail.value],
    });
  },

  // 选择商家
  bindBusinessActChange: function (e) {
    console.log("所选商家改变", e.detail.value);
    console.log(e);

    this.setData({
      business_actIndex: e.detail.value,
      [`formData.business_act`]: this.data.business_acts[e.detail.value],
    });
  },

  // 上传图片
  uploadError(e) {
    console.log("upload error", e.detail);
  },

  // 上传图片到七牛云成功，将图片url插入提交的表单
  uploadSuccess(e) {
    console.log("upload success", e.detail);
    let pictureList = this.data.formData.picture;
    let picture = e.detail.urls;
    let newPictureList = pictureList.concat(picture);

    this.setData({
      [`formData.picture`]: newPictureList,
    });
  },

  selectFile(files) {
    console.log("files", files);
    // 返回false可以阻止某次文件上传
    return true;
  },

  selectImg(e) {
    console.log(e.detail);
  },
  //上传的模板函数
  async uploadFile(files) {
    console.log("upload", files);
    let upToken = (await app.ajax.getQiniuyun()).data.upToken;

    let ps = [],
      up = (file) => {
        return new Promise((resolve, reject) => {
          func
            .uploadImg(file, upToken)
            .then((res) => {
              console.log(res);

              resolve(res.imageURL);
            })
            .catch((err) => {
              reject(err);
            });
        });
      };

    files.tempFilePaths.map((v) => {
      ps.push(up(v));
    });

    return Promise.all(ps)
      .then((res) => {
        return Promise.resolve({ urls: res });
      })
      .catch((res) => {
        return Promise.reject("上传出错");
      });
  },


  // 提交表单
  submitForm() {
    this.selectComponent("#form").validate(async (valid, errors) => {
      console.log("valid", valid, errors);
      if (!valid) {
        const firstError = Object.keys(errors);
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message,
          });
        }
        wx.showToast({
          title: errors[firstError[0]].message,
          icon: "none",
        });
      } else {
        wx.showToast({
          title: "校验通过",
        });
        const form = Object.assign(
          {},
          this.data.validateData,
          this.data.formData
        );
        console.log("提交的总表单", form);
        wx.navigateTo({
          url: "../orderMsg/orderMsg",
          success: res => {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit("dataFormCreate", {
              data: {
                form
              }
            });
          }
        });

        // try {
        //   await app.ajax.createOrder(form).then((res) => {
        //     var order_id = res.data.data._id;
        //     wx.navigateTo({
        //       url: "../orderMsg/orderMsg",
        //       success: res => {
        //         // 通过eventChannel向被打开页面传送数据
        //         res.eventChannel.emit("dataFormFather", {
        //           data: {
        //             order_id
        //           }
        //         });
        //       }
        //     });
        //     console.log(res);
        //   });
        // } catch (err) {
        //   console.log(err);
        //   wx.showToast({
        //     title: err.data.state.msg,
        //     icon: "none",
        //   });
        // }
      }
    });
  },

  //上传组件的删除图片
  deleteImg(e) {
    // console.log(e.detail.index);
    let deleteIndex = e.detail.index;
    let picArr = this.data.formData.picture;
    picArr.splice(deleteIndex, 1);
    this.setData({ "formData.picture": picArr })
  }
});
