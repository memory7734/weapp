// pages/teacher/class/class_list.js
var Bmob = require('../../../utils/bmob.js');
const app = getApp()
var that
Page({
  data: {
    list: []
  },
  onLoad: function (options) {
    that = this;
    var currentUser = Bmob.User.current();
    var Answer = Bmob.Object.extend("answer");
    var answer = new Bmob.Query(Answer);
    answer.equalTo('taskid', options.id)
    answer.limit(100)
    var list = []
    answer.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          list[i] = {}
          list[i]['answerid'] = results[i].id;
          list[i]['title'] = results[i].get('title');
          list[i]['userid'] = results[i].get('studentid');
        }
        var User = Bmob.Object.extend("_User");
        var user = new Bmob.Query(User);
        user.find({
          success: function (results) {
            for (var i = 0; i < list.length; i++) {
              for (var j = 0; j < results.length; j++) {
                if (list[i]['userid'] == results[j].id) {
                  list[i]['name'] = results[j].get('name')
                  list[i]['studentid'] = results[j].get('studentid')
                }
              }
            }
            that.setData({
              list: list
            })
            console.log(that.data.list)
          },
          error: function (error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });

  },
  detail: function (options) {
    wx.navigateTo({
      url: 'detail?id=' + options.currentTarget.dataset.id,
    })
  },
})