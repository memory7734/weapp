var Bmob = require('../../../utils/bmob.js');
var app = getApp();
var that
Page({
  data: {
    score: 0,
    comment: null,
    reviewed: false
  },
  onLoad: function (options) {
    that = this;
    console.log(options.id)
    var currentUser = Bmob.User.current();
    var Answer = Bmob.Object.extend("answer");
    var answer = new Bmob.Query(Answer);
    answer.equalTo('taskid', options.id)
    answer.equalTo('studentid', currentUser.id)
    answer.find({
      success: function (result) {
        if (result[0].get("reviewed")) {
          that.setData({
            score: result[0].get("score"),
            comment: result[0].get("comment"),
            reviewed: result[0].get("reviewed"),
          })
        }
      },
      error: function (object, error) {
        // 查询失败
      }
    });
  },
});