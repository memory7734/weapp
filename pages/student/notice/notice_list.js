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
    var Notice = Bmob.Object.extend("notice");
    var notice = new Bmob.Query(Notice);
    var classid = []
    student.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          classid[i] = results[i].get('classid');
        }
        notice.containedIn("classid", classid)
        notice.limit(100)
        notice.find({
          success: function (results) {
            var classlist = []
            for (var i = 0; i < results.length; i++) {
              classlist[i] = {}
              classlist[i]['id'] = results[i].id;
              classlist[i]['classid'] = results[i].get('classid');
              classlist[i]['title'] = results[i].get('title');
            }
            var Clazz = Bmob.Object.extend("clazz");
            var clazz = new Bmob.Query(Clazz);
            clazz.containedIn("objectId", classid)
            clazz.find({
              success: function (results) {
                for (var i = 0; i < classlist.length; i++) {
                  for (var j = 0; j < results.length; j++) {
                    if (classlist[i]['classid'] == results[j].id) {
                      classlist[i]['name'] = results[j].get('name')
                    }
                  }
                }
                that.setData({
                  list: classlist
                })
              }
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

  },
  detail: function (options) {
    wx.navigateTo({
      url: 'notice_detail?id=' + options.currentTarget.dataset.id,
    })
  },
})