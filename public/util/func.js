/**
 * 工具函数类
 */

const qiniuUploader = require("../../utils/qiniuUploader");
class func {
  constructor() {
    this.r = 6378.137 * 1000;
  }

  // 将角度转化为弧度(rad)
  rad(d) {
    return (d * Math.PI) / 180;
  }

  // 计算给定的两点的距离
  getDistance(A, B) {
    let distance =
      this.r *
      Math.acos(
        Math.sin(this.rad(A.lat)) * Math.sin(this.rad(B.lat)) +
          Math.cos(this.rad(A.lat)) *
            Math.cos(this.rad(B.lat)) *
            Math.cos(this.rad(A.lng - B.lng))
      );
    return distance;
  }

  // 将地图比例尺转化为手机屏幕大概距离
  scaleToDistance(scale) {
    switch (scale) {
      case 3:
        return 6000000;
      case 4:
        return 3000000;
      case 5:
        return 1200000;
      case 6:
        return 600000;
      case 7:
        return 300000;
      case 8:
        return 300000;
      case 9:
        return 120000;
      case 10:
        return 60000;
      case 11:
        return 30000;
      case 12:
        return 12000;
      case 13:
        return 6000;
      case 14:
        return 3000;
      case 15:
        return 1200;
      case 16:
        return 600;
      case 17:
        return 300;
      case 18:
        return 300;
      case 19:
        return 120;
      case 20:
        return 60;
      default:
        return 20000000;
    }
  }

  // 合并数组并去重
  concatArr() {
    let newArr = Array.prototype.concat.apply([], arguments); // 没有去重的数组
    return Array.from(new Set(newArr));
  }

  /**
   * 合并两个有共同id的对象数组
   * @param longArr 长数组
   * @param shortArr 短的数组
   * @param id 要比较的对象
   *
   * */

  handleObjArr(longArr, shortArr, id) {
    return longArr.map(item => {
      let objIndex = shortArr.findIndex(item1 => item1[id] === item[id]);
      if (objIndex !== -1) {
        return shortArr[objIndex];
      } else return item;
    });
  }

  /**
   * 处理图片水印
   * @param url 图片原链接
   * @param style 图片周边颜色
   * @param num 图片数字水印
   */

  handlePictureWatermark(url, style, num) {
    const connector = "*"; // 连接符
    // let color = "";
    // switch (style) {
    //   case "clicked":
    //     color = "hs";
    //     break;
    //   case "active":
    //     color = "zs";
    // }

    if (url.indexOf(connector) > -1) {
      let urlArr = url.split(connector);
      let reg = /^\D+/g;
      let temp = urlArr[1].replace(reg, style);

      return urlArr[0] + connector + temp;
    } else {
      if (style) {
        if (num) {
          return `${url}${connector}${style}${num}`;
        } else return `${url}${connector}${style}`;
      } else return url;
    }
  }

  updateImg(filePath, uptoken) {
    return new Promise((resolve, reject) => {
      qiniuUploader.upload(
        filePath,
        res => {
          // 每个文件上传成功后,处理相关的事情
          // 其中 info 是文件上传成功后，服务端返回的json，形式如
          // {
          //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
          //    "key": "gogopher.jpg"
          //  }
          // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
          // console.log(res);
          // console.log("file url is: " + res.fileUrl);
          let result = res;
          wx.hideLoading();
          resolve(result);
        },
        error => {
          console.log("error: " + error);
          wx.hideLoading();
          reject(error);
        },
        {
          region: "ECN",
          uploadURL: "https://upload.qiniup.com/",
          domain: "http://cdn.cdlshow.xyz/", // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
          // key: "customFileName.jpg", // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
          // // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc

          uptoken: uptoken // 由其他程序生成七牛 uptoken
          // uptokenURL: "UpTokenURL.com/uptoken", // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
          // uptokenFunc: function() {
          //   return "[yourTokenString]";
          // }
        },
        res => {
          console.log("上传进度", res.progress);
          console.log("已经上传的数据长度", res.totalBytesSent);
          console.log("预期需要上传的数据总长度", res.totalBytesExpectedToSend);
        }
        // () => {
        //   // 取消上传
        // },
        // () => {
        //   // `before` 上传前执行的操作
        // },
        // err => {
        //   // `complete` 上传接受后执行的操作(无论成功还是失败都执行)
        // }
      );
    });
  }

  // 防抖函数
  static bounce = function(func, time) {
    // let delayTime = time;
    // setTimeout()
  };
}

module.exports = func;
