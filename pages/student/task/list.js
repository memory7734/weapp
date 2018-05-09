// pages/teacher/class/class_list.js
var Bmob = require('../../../utils/bmob.js');
var template = require('../../../template/template.js');
const app = getApp()
var that
Page({
  data: {
    list: []
  },
  onLoad: function (options) {
    template.tabbarstudent("tabBar", 1, this)
    that = this;
    var currentUser = Bmob.User.current();
    var Student = Bmob.Object.extend("student");
    var student = new Bmob.Query(Student);
    student.equalTo('studentid', currentUser.id)
    student.limit(100)
    var classid = []
    student.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          classid.push(results[i].get('classid'));
        }
        var Task = Bmob.Object.extend("task");
        var task = new Bmob.Query(Task);
        task.containedIn('classid', classid)
        task.limit(100)
        var list = []
        task.find({
          success: function (results) {
            for (var i = 0; i < results.length; i++) {
              list[i] = {}
              list[i]['taskid'] = results[i].id;
              list[i]['title'] = results[i].get('title');
              list[i]['classid'] = results[i].get('classid');
            }
            var Clazz = Bmob.Object.extend("clazz");
            var clazz = new Bmob.Query(Clazz);
            clazz.find({
              success: function (results) {
                for (var i = 0; i < list.length; i++) {
                  for (var j = 0; j < results.length; j++) {
                    if (list[i]['classid'] == results[j].id) {
                      list[i]['name'] = results[j].get('name')
                    }
                  }
                }
                that.setData({
                  list: list
                })
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
      }
    })
    
    

  },
  detail: function (options) {
    wx.navigateTo({
      url: 'detail?id=' + options.currentTarget.dataset.id,
    })
  },
  edit: function (options) {
    wx.navigateTo({
      url: '../answer/edit?id=' + options.currentTarget.dataset.id,
    })
  },
  review: function (options) {
    wx.navigateTo({
      url: '../answer/review?id=' + options.currentTarget.dataset.id,
    })
  },
})