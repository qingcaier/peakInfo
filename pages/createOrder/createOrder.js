import store from "../../store";
import create from "../../utils/create";

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
        label: "拼件"
      },
      {
        value: 1,
        label: "拼额"
      }
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
        minute: 10
      }
    },

    formData: {
      picture: [
        // {
        //   url:
        //     "http://mmbiz.qpic.cn/mmbiz_png/VUIF3v9blLsicfV8ysC76e9fZzWgy8YJ2bQO58p43Lib8ncGXmuyibLY7O3hia8sWv25KCibQb7MbJW3Q7xibNzfRN7A/0"
        // },
        // {
        //   loading: true
        // },
        // {
        //   error: true
        // }
      ], // 图片路径
      orderType: {}, // 拼单类型
      business_act: {} // 所选商家
    },

    totalData: {},

    rules: [
      {
        name: "title",
        rules: { required: true, message: "标题是必填项" }
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
          }
        }
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
          }
        }
      },
      {
        name: "detail",
        rules: {
          maxlength: 500,
          message: "详情超过了500字"
        }
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
            message: "请输入有效数字"
          }
        ]
      }
    ]
  },

  onLoad: function () {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uploadFile: this.uploadFile.bind(this),
      [`formData.orderType`]: this.data.orderTypes[0]
    });
    // this.getQiniuyun();
    // 获取周围商店
    app.qqMap.search({
      keyword: "购物",
      // filter: "category=购物",
      address_format: "short",
      page_size: 20,
      // page_index: 2,
      success: res => {
        console.log(res.status, res.message);
        console.log(res.data);
        this.setData({
          business_acts: res.data,
          [`formData.business_act`]: res.data[0]
        });
      },
      fail: res => {
        console.log(res.status, res.message);
      },
      complete: res => {
        console.log(res.status, res.message);
      }
    });
  },

  // 双向绑定输入框
  formInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`validateData.${field}`]: e.detail && e.detail.value
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
      [`formData.orderType`]: this.data.orderTypes[e.detail.value]
    });
  },

  bindBusinessActChange: function (e) {
    console.log("所选商家改变", e.detail.value);
    console.log(e);

    this.setData({
      business_actIndex: e.detail.value,
      [`formData.business_act`]: this.data.business_acts[e.detail.value]
    });
  },

  // 上传图片
  uploadError(e) {
    console.log("upload error", e.detail);
  },
  uploadSuccess(e) {
    console.log("upload success", e.detail);
  },

  selectFile(files) {
    console.log("files", files);
    // 返回false可以阻止某次文件上传
    return true;
  },
  //上传的模板函数
  uploadFile(files) {
    console.log("upload", files);

    let ps = [],
      up = file => {
        return new Promise((resolve, reject) => {
          wx.uploadFile({
            url: "https://example.weixin.qq.com/upload", //仅为示例，非真实的接口地址

            filePath: file,

            name: "file",

            success(res) {
              // 服务器返回的数据 res.data = {url:'图片上传后的地址'}

              if (res.data.url) {
                resolve(res.data.url);
              } else {
                reject(res);
              }
            },

            fail(res) {
              reject(res);
            }
          });
        });
      };

    files.tempFilePaths.map(v => {
      ps.push(up(v));
    });

    return Promise.all(ps)
      .then(res => {
        return Promise.resolve({ urls: res });
      })
      .catch(res => {
        return Promise.reject("上传出错");
      });
  },
  //七牛云上传的token
  getQiniuyun() {
    app.ajax.getQiniuyun().then(res => {
      console.log(res);
    });

  },
  // 上传文件到七牛云 没有完成
  upqiniu(req) {
    console.log(req)
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    let filetype = ''
    if (req.file.type === 'image/png') {
      filetype = 'png'
    } else {
      filetype = 'jpg'
    }
    // 重命名要上传的文件
    const keyname = 'dfairy' + Date.parse(new Date()) + Math.floor(Math.random() * 100) + '.' + filetype
    // 从后端获取上传凭证token
    this.axios.get('/qiniuyun').then(res => {
      console.log(res)
      const formdata = new FormData()
      formdata.append('file', req.file)
      formdata.append('token', res.data.upToken)
      formdata.append('key', keyname)
      // 获取到凭证之后再将文件上传到七牛云空间
      this.axios.post(this.domain, formdata, config).then(res => {
        this.imageUrl = 'http://' + this.qiniuaddr + '/' + res.data.key
        // console.log(this.imageUrl)
      })
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    });
  },

  // 提交表单
  submitForm() {
    wx.navigateTo({
      url: "../orderMsg/orderMsg"
    });
    // this.selectComponent("#form").validate((valid, errors) => {
    //   console.log("valid", valid, errors);
    //   if (!valid) {
    //     const firstError = Object.keys(errors);
    //     if (firstError.length) {
    //       this.setData({
    //         error: errors[firstError[0]].message
    //       });
    //     }
    //     wx.showToast({
    //       title: errors[firstError[0]].message,
    //       icon: "none"
    //     });
    //   } else {
    //     wx.showToast({
    //       title: "校验通过"
    //     });
    //     const form = Object.assign(
    //       {},
    //       this.data.validateData,
    //       this.data.formData
    //     );
    //     console.log("提交的总表单", form);
    //     app.ajax.createOrder(form).then(res => {
    //       console.log(res);
    //     });
    //   }
    // });
  }
});
