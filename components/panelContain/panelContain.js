Component({
  behaviors: [],

  options: {
    multipleSlots: true
  },

  data: {
    // business_name: "以纯",
    // type: 0

    toastShow: false
  },

  properties: {
    toastText: {
      type: String,
      value: "内容"
    }
  },

  methods: {
    showToast(text, time) {
      if (!text) {
        text = this.data.toastText;
      }
      this.setData({
        toastShow: !this.data.toastShow,
        toastText: text
      });

      var that = this;
      if (!time) {
        time = 2000;
      }

      setTimeout(function() {
        that.setData({
          toastShow: !that.data.toastShow
        });
      }, time);
    }
  }
});
