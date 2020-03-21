import store from "../../store";
import create from "../../utils/create";

const app = getApp();

create(store, {
  /**
   * 页面的初始数据
   */
  data: {
    targetLocation: "",

    currentPage: 1, // 商家活动页数
    pageSize: 10, // 每次请求数据条数

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
  onLoad: function() {
    // 获取自身位置（地址逆解析）
    app.qqMap.reverseGeocoder({
      // location: {
      //   latitude,
      //   longitude
      // },
      ger_poi: 1,
      success: res => {
        // console.log(res.status, res.message);
        console.log(res.result);

        // this.store.data.userLocation = { latitude, longitude }; // 将当前位置存在westore
        // this.update();

        this.setData({
          location: {
            lat: res.result.location.lat,
            lng: res.result.location.lng
          },
          targetLocation: res.result.address
        });

        // 请求附近的商家活动
        app.ajax
          .checkActByDistance({
            location: {
              lng: res.result.location.lng,
              lat: res.result.location.lat
            },
            page: this.data.currentPage,
            pageSize: this.data.pageSize
          })
          .then(async res => {
            console.log("附近的商家活动", res.data);

            let actList = [];
            for (let i of res.data.data) {
              let act = {};
              act.act_id = i._id;
              act.business_name = i.business_name;
              act.address = i.address;
              act.distance = i._distance;
              act.orderList = [];

              await app.ajax
                .checkActOrder({
                  act_id: i._id,
                  order_state: 0,
                  firstOrder: true
                })
                .then(resp => {
                  // console.log(resp.data);
                  // let act_orderList = [];
                  let order = resp.data.data[0];
                  let orderObj = {};
                  if (order) {
                    orderObj.orderId = order._id;
                    orderObj.img =
                      order.picture[0] || "../../public/images/store.png";
                    orderObj.title = order.title;
                    orderObj.detail = order.detail;
                    orderObj._typeNumber = order.act_type;
                    orderObj._remainCount =
                      order.total_count - order.participant_id.current_count;
                    orderObj._validTime = order.remain_time;

                    // act_orderList.push(orderObj);

                    // act.orderList = act_orderList;
                    act.orderList.push(orderObj);
                  }
                });

              actList.push(act);
            }

            this.setData({
              actList: actList,
              totalPage: res.data.count
            });
            // console.log(this.data.totalPage);

            wx.setStorageSync("localActList", actList);

            //   let NeightAct = res.data.data;
            //   let markersList = [];

            //   for (let i in NeightAct) {
            //     let marker = {};
            //     marker = createMarker(NeightAct[i]);
            //     marker.id = Number(i);
            //     markersList.push(marker);
            //   }
            //   console.log(markersList);
            //   this.setData({
            //     markers: markersList
            //   });
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.testCot = this.selectComponent("#test");
  },
  goJoin() {
    console.log("mychat");
    wx.navigateTo({
      url: "../joinOrder/joinOrder"
    });
  },
  /**
   * 自定义函数
   * */

  // showToast: function() {
  //   this.testCot.showToast("", 2000);
  // },

  onGetMore: function(e) {
    // console.log(e);

    // wx.setStorageSync("localToken", resp.data.localToken);

    let localActList = wx.getStorageSync("localActList"); // 获取缓存里的商家及拼单列表
    // console.log("本地缓存列表", localActList);

    let targetArrIndex = this.data.actList.findIndex(
      item => item.act_id === e.currentTarget.dataset.actid
    ); // 当前点击的商家活动下标

    if (localActList[targetArrIndex].orderList.length === 1) {
      // 如果缓存商家活动下有正在进行的拼单
      if (e.detail.isClicked) {
        // 点击请求更多拼单
        app.ajax
          .checkActOrder({
            act_id: e.currentTarget.dataset.actid,
            order_state: 0,
            firstOrder: false
          })
          .then(resp => {
            // console.log(resp.data);
            let act_orderList = [];
            if (resp.data.data.length > 0) {
              for (let i of resp.data.data) {
                let orderObj = {};
                orderObj.img = i.picture[0] || "../../public/images/store.png";
                orderObj.title = i.title;
                orderObj.detail = i.detail;
                orderObj._typeNumber = i.act_type;
                orderObj._remainCount =
                  i.total_count - i.participant_id.current_count;
                orderObj._validTime = i.remain_time;

                act_orderList.push(orderObj);
              }

              this.setData({
                [`actList[${targetArrIndex}].orderList`]: act_orderList,
                [`isMore[${targetArrIndex}]`]: e.detail.isClicked
              });

              wx.setStorageSync("localActList", this.data.actList); // 请求完更多商家下的拼单列表后缓存到本地
            }
          });
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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      currentPage: 1
    });
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({
      currentPage: ++this.data.currentPage
    });

    let requestCount = Math.ceil(this.data.totalPage / this.data.pageSize) + 1;

    if (this.data.currentPage < requestCount) {
      // 请求更多商家活动
      app.ajax
        .checkActByDistance({
          location: this.data.location,
          page: this.data.currentPage,
          pageSize: this.data.pageSize
        })
        .then(async res => {
          // console.log("新商家", res.data);

          let actList = [];
          for (let i of res.data.data) {
            let act = {};
            act.act_id = i._id;
            act.business_name = i.business_name;
            act.address = i.address;
            act.distance = i._distance;
            act.orderList = [];

            await app.ajax
              .checkActOrder({
                act_id: i._id,
                order_state: 0,
                firstOrder: true
              })
              .then(resp => {
                // console.log(resp.data);
                // let act_orderList = [];
                let order = resp.data.data[0];
                let orderObj = {};
                if (order) {
                  orderObj.orderId = order._id;
                  orderObj.img =
                    order.picture[0] || "../../public/images/store.png";
                  orderObj.title = order.title;
                  orderObj.detail = order.detail;
                  orderObj._typeNumber = order.act_type;
                  orderObj._remainCount =
                    order.total_count - order.participant_id.current_count;
                  orderObj._validTime = order.remain_time;

                  // act_orderList.push(orderObj);

                  // act.orderList = act_orderList;
                  act.orderList.push(orderObj);
                }
              });

            actList.push(act);
          }

          this.setData({
            actList: this.data.actList.concat(actList)
          });

          wx.setStorageSync("localActList", this.data.actList);

          //   let NeightAct = res.data.data;
          //   let markersList = [];

          //   for (let i in NeightAct) {
          //     let marker = {};
          //     marker = createMarker(NeightAct[i]);
          //     marker.id = Number(i);
          //     markersList.push(marker);
          //   }
          //   console.log(markersList);
          //   this.setData({
          //     markers: markersList
          //   });
        });
    } else {
      this.setData({
        noMoreAct: true
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
