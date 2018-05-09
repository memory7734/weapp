var Bmob = require('../../../utils/bmob.js');
var app = getApp();
var that
Page({
  data: {
    title: '',
    content: '',
    urlArr: [],
    answerid: '',
    reviewed: false,
    score: 0,
    comment: ''
  },
  onLoad: function (options) {
    that = this;
    var Answer = Bmob.Object.extend("answer");
    var answer = new Bmob.Query(Answer);
    answer.get(options.id, {
      success: function (result) {
        that.setData({
          title: result.get("title"),
          content: result.get("content"),
          urlArr: result.get("imgArr"),
          answerid: options.id,
        })
        if (result.get("reviewed")){
          that.setData({
            reviewed: true,
            score: result.get("score"),
            comment: result.get("comment")
          })
        }
      },
      error: function (object, error) {
        // 查询失败
      }
    });

  },

  formSubmit: function (e) {
    var Answer = Bmob.Object.extend("answer");
    if (that.data.reviewed) {
      var answer = new Bmob.Query(Answer);
      answer.get(that.data.answerid, {
        success: function (results) {
          results.set("score", e.detail.value.score);
          results.set("comment", e.detail.value.comment);
          results.set("reviewed", true);
          results.save();
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
        }
      })
    } else {
      var answer = new Bmob.Query(Answer);
      answer.get(that.data.answerid, {
        success: function (results) {
          results.set("score", e.detail.value.score);
          results.set("comment", e.detail.value.comment);
          results.set("reviewed", true);
          results.save();
          wx.showToast({
            title: '评价成功',
            icon: 'none'
          })
        }
      })
    }
  }
});