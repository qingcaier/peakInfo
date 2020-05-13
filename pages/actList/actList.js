import store from "../../store";
import create from "../../utils/create";

const Func = require("../../public/util/func");
const func = new Func();

const app = getApp();

create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    targetLocation: "",

    currentPage: 1, // 商家活动页数
    pageSize: 3, // 每次请求数据条数

    isMore: [], // 商家活动列表中的元素是否被点击请求更多拼单(true/false)
    noMoreAct: false

    // actList: [
    //   {
    //     business_name: "以纯",
    //     address: "大学城新天地",
    //     distance: 3666664,
    //     orderList: [
    //       {
    //         img: "../../public/images/store.png",
    //         title: "缺200，满500减200！！！",
    //         detail: "走过路过千万别错过，以纯满500减200，现差200，求拼单！！！",

    //         _typeNumber: 1,
    //         _remainCount: 200,
    //         _validTime: 1582939162423
    //       }
    //     ]
    //   }
    // ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: async function () {
    try {
      let locationInfo = await this.getUserLocation();
      let location = locationInfo.location,
        targetLocation = locationInfo.address;

      let act = await this.getActSortByDistance(
        location,
        this.data.currentPage,
        this.data.pageSize
      );
      let actList = act.actList,
        totalPage = act.totalPage;
      console.log("商家列表", actList);
      for (let i of actList) {
        i.orderList = await this.getOrderByActId(i.act_id, 0, true);
      }
      console.log(actList.length);

      if (actList.length < this.data.pageSize) {
        this.setData({
          location,
          targetLocation,
          totalPage,
          actList,
          isMore: [], // 刷新
          // currentPage: 1,
          refresh: true, // 刷新
          noMoreAct: true
        });
      } else {
        this.setData({
          location,
          targetLocation,
          totalPage,
          actList,
          isMore: [], // 刷新
          // currentPage: 1,
          refresh: true, // 刷新
          noMoreAct: false
        });
      }

      wx.setStorageSync("localActList", actList);
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.testCot = this.selectComponent("#test");
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
        success: res => {
          // console.log(res.status, res.message);
          // console.log(res.result);
          let currentLocation = res.result;
          resolve(currentLocation);
        },
        fail: err => {
          console.log(err.status, err.message);
          reject(err);
        },
        complete: res => {
          // console.log(res.status, res.message);
        }
      });
    });
  },

  // 获取按距离排序的商家活动列表
  getActSortByDistance(location, page, pageSize) {
    return new Promise((resolve, reject) => {
      // 请求附近的商家活动
      app.ajax
        .checkActByDistance({
          location,
          page,
          pageSize
        })
        .then(res => {
          console.log("附近的商家活动", res.data);
          let actArr = res.data.data;
          let totalPage = res.data.count;

          let actList = [];
          for (let i of actArr) {
            let act = {};
            act.act_id = i._id;
            act.business_name = i.business_name;
            act.address = i.address;
            act.distance = i._distance;
            // act.orderList = [];

            actList.push(act);
          }

          let result = {
            actList,
            totalPage
          };
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  // 查询商家下的拼单
  getOrderByActId(act_id, order_state, isFirstOrder) {
    return new Promise((resolve, reject) => {
      app.ajax
        .checkActOrder({
          act_id: act_id,
          order_state: order_state || 0,
          firstOrder: isFirstOrder
        })
        .then(res => {
          let orderArr = res.data.data;
          console.log(res);

          let act_orderList = [];
          if (orderArr.length > 0) {
            for (let i of orderArr) {
              let orderObj = {};
              orderObj.order_id = i._id;
              orderObj.img = i.picture[0] || "../../public/images/store.png";
              orderObj.title = i.title;
              orderObj.detail = i.detail;
              orderObj._typeNumber = i.act_type;
              orderObj._remainCount =
                i.total_count - i.participant_id.current_count;
              orderObj._validTime = i.remain_time;

              act_orderList.push(orderObj);
            }
          }
          resolve(act_orderList);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  // 点击查看拼单详情
  goJoin(e) {
    console.log(e);
    let order_id = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: "../joinOrder/joinOrder",
      success: res => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit("dataFormFather", {
          data: {
            order_id: order_id,
            canJoin: true,
            operation: 0
          }
        });
      }
    });
  },
  /**
   * 自定义函数
   * */

  // showToast: function() {
  //   this.testCot.showToast("", 2000);
  // },

  // 点击获取更多商家下的拼单
  onGetMore: async function (e) {
    // console.log(e);

    // wx.setStorageSync("localToken", resp.data.localToken);

    let localActList = wx.getStorageSync("localActList"); // 获取缓存里的商家及拼单列表
    // console.log("本地缓存列表", localActList);

    let targetArrIndex = this.data.actList.findIndex(
      item => item.act_id === e.currentTarget.dataset.actid
    ); // 当前点击的商家活动下标

    let act_id = e.currentTarget.dataset.actid;

    if (localActList[targetArrIndex].orderList.length === 1) {
      // 如果缓存商家活动下有正在进行的拼单
      if (e.detail.isClicked) {
        // 点击请求更多拼单
        let act_orderList = await this.getOrderByActId(act_id, 0, false);

        this.setData({
          [`actList[${targetArrIndex}].orderList`]: act_orderList,
          [`isMore[${targetArrIndex}]`]: e.detail.isClicked
        });

        wx.setStorageSync("localActList", this.data.actList); // 请求完更多商家下的拼单列表后缓存到本地
      } else {
        // 点击收起拼单列表
        this.setData({
          [`actList[${targetArrIndex}].orderList`]: this.data.actList[
            targetArrIndex
          ].orderList.slice(0, 1),
          [`isMore[${targetArrIndex}]`]: e.detail.isClicked
        });
      }
    } else {
      // 商家活动下没有有效的拼单，就不发起请求
      if (e.detail.isClicked) {
        this.setData({
          [`actList[${targetArrIndex}].orderList`]: localActList[targetArrIndex]
            .orderList,
          [`isMore[${targetArrIndex}]`]: e.detail.isClicked
        });
      } else {
        this.setData({
          [`actList[${targetArrIndex}].orderList`]: this.data.actList[
            targetArrIndex
          ].orderList.slice(0, 1),
          [`isMore[${targetArrIndex}]`]: e.detail.isClicked
        });
      }
    }
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.removeStorageSync("localActList");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      refresh: false,
      currentPage: 1
    });
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    // this.setData({
    //   currentPage: ++this.data.currentPage
    // });

    let requestCount = Math.ceil(this.data.totalPage / this.data.pageSize) + 1;

    console.log(requestCount);
    if (this.data.currentPage < requestCount && !this.data.noMoreAct) {
      // 请求更多商家活动

      let act = await this.getActSortByDistance(
        this.data.location,
        this.data.currentPage + 1,
        this.data.pageSize
      );
      let actList = act.actList;
      console.log("商家列表", actList);

      for (let i of actList) {
        i.orderList = await this.getOrderByActId(i.act_id, 0, true);
      }
      if (actList.length < this.data.pageSize) {
        this.setData({
          actList: this.data.actList.concat(actList),
          currentPage: this.data.currentPage++,
          noMoreAct: true
        });
        console.log("111", this.data.actList);
      } else {
        this.setData({
          actList: this.data.actList.concat(actList),
          currentPage: ++this.data.currentPage
        });
        console.log("222", this.data.actList);
      }

      wx.setStorageSync("localActList", this.data.actList);
    } else {
      this.setData({
        noMoreAct: true
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { }
});
