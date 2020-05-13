import store from "../../store";
import create from "../../utils/create";

const Func = require("../../public/util/func");
const func = new Func();

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
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
    orderDATA: {},
    validateData: {
      title: "", // 拼单标题
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

    },
    rules: [
      {
        name: "title",
        rules: { required: true, message: "标题是必填项" },
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
  onLoad: function () {
    try {
      let that = this;
      //	获取所有打开的EventChannel事件
      const eventChannel = this.getOpenerEventChannel();
      // 监听
      eventChannel.on("modifyOrderFunction", (res) => {
        that.setData({ orderDATA: res.data.orderDATA });
        // that.setData({ "formData.picture": res.data.orderDATA.picture });

        let newvalidateData = that.data.validateData;
        newvalidateData.title = that.data.orderDATA.title;
        newvalidateData.current_count = that.data.orderDATA.initiator.count;
        newvalidateData.detail = that.data.orderDATA.detail;
        newvalidateData.time = that.data.orderDATA.valid_time;

        that.setData({ validateData: newvalidateData });
        that.setData({
          selectFile: that.selectFile.bind(that),
          uploadFile: that.uploadFile.bind(that),
        });
      });
    } catch (err) {
      wx.showToast({
        title: err,
        icon: "none",
      });
    }
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
  // 上传图片
  uploadError(e) {
    console.log("upload error", e.detail);
  },
  //上传组件的删除图片
  deleteImg(e) {
    // console.log(e.detail.index);
    let deleteIndex = e.detail.index;
    let picArr = this.data.formData.picture;
    picArr.splice(deleteIndex, 1);
    this.setData({ "formData.picture": picArr })
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
  selectImg(e) {
    console.log(e.detail);



  },
  // 提交表单
  submitForm() {
    let that = this;
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

        let NiceOrder = {};
        NiceOrder.order_id = that.data.orderDATA._id;
        NiceOrder.title = that.data.validateData.title;
        NiceOrder.current_count = that.data.validateData.current_count;
        NiceOrder.detail = that.data.validateData.detail;
        NiceOrder.time = that.data.validateData.time;
        NiceOrder.picture = that.data.orderDATA.picture.concat(that.data.formData.picture);

        console.log("修改后的数据", NiceOrder);
        try {
          app.ajax.editOrder(NiceOrder).then((res) => {
            console.log(res);

            if (res.data.state.status == 200) {
              wx.showModal({
                title: "修改完成",
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1, // 返回上一级页面。
                      success: function () {

                      }
                    });

                  }
                }
              })

            } else {
              throw (res.data.state)
            }
          });
        } catch (err) {
          console.log(err);
          wx.showToast({
            title: err.data.state.msg,
            icon: "none",
          });
        }


      }
    });
  },
  /**
   * @method setObjData 
   * @description 把boj_a中的值赋值到obj_b中对应的属性上 
   * @param { Object } obj_a obj_b 
   * @return { Object } obj_b
   */
  setObjData(obj_a, obj_b) {
    let keyArr = Object.keys(obj_b);

    for (let item of keyArr) {
      obj_b[item] = obj_a[item];
    }
    return obj_b
  }




})