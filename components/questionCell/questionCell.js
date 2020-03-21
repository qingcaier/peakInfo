// components/questionCell/questionCell.js

Component({
  behaviors: [],

  options: {
    multipleSlots: true,
    pureDataPattern: /^_/
  },
  /**
   * 组件的属性列表
   */
  properties: {
    num: Number,
    title: String,
    choices: Array,
    errMsg: {
      type: String,
      value: "*错误，请重新选择"
    },
    color: {
      type: String,
      value: "#ff0000"
    },

    _choices: Array,
    _answer: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    showErrMsg: false
    // num: 1,
    // title: "您所在的建筑名字是？",
    // choices: ["霍芝庭公馆旧址", "纸行路42号居民", "礼兴街10号居民"]
  },

  observers: {
    _choices: function() {
      let choices = [];
      for (let i of this.data._choices) {
        let choice = {};
        choice.text = i;
        choices.push(choice);
      }

      this.setData({
        choices
      });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect: function(e) {
      let nativeChoices = [];
      for (let i of this.data._choices) {
        let choice = {};
        choice.text = i;
        nativeChoices.push(choice);
      }

      let userChoice = this.data.choices[e.detail.value].text;

      if (this.data._answer !== userChoice) {
        let choices = nativeChoices;
        choices[e.detail.value].errMsg = this.data.errMsg;
        choices[e.detail.value].color = this.data.color;
        this.setData({
          choices,
          showErrMsg: true
        });
      } else {
        let choices = nativeChoices;
        this.setData({
          choices,
          showErrMsg: false
        });
      }
      let myEventDetail = {
        userAnswer: this.data.choices[e.detail.value],
        isRight: !this.data.showErrMsg
      };
      let myEventOption = {};
      this.triggerEvent("getUserAnswer", myEventDetail, myEventOption);
    }
  }
});
