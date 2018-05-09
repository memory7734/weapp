// pages/teacher/class/class_list.js
var Bmob = require('../../../utils/bmob.js');
const app = getApp()
var that
Page({
  data: {
    list: null,
    changed_name: null,
    changed_index: null,
    changed_id: null,
    showModal: false,
  },
  onLoad: function (options) {
    that = this;
    var currentUser = Bmob.User.current();
    var Student = Bmob.Object.extend("student");
    var student = new Bmob.Query(Student);
    student.equalTo('studentid', currentUser.id)
    student.limit(100)
    var Clazz = Bmob.Object.extend("clazz");
    var clazz = new Bmob.Query(Clazz);
    var classid = []
    student.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          classid[i] = results[i].get('classid');
        }
        clazz.containedIn("objectId", classid)
        clazz.limit(100)
        clazz.find({
          success: function (results) {
            var classlist = []
            for (var i = 0; i < results.length; i++) {
              classlist[i] = {}
              classlist[i]['id'] = results[i].id;
              classlist[i]['name'] = results[i].get('name');
            }
            that.setData({
              list: classlist
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
  dismiss: function (options) {
    var currentUser = Bmob.User.current();
    var Student = Bmob.Object.extend("student");
    var student = new Bmob.Query(Student);
    student.equalTo("classid", options.currentTarget.dataset.id);
    student.find({
      success: function (results) {
        if (results.length == 0) {
          wx.showToast({
            title: '未在当前班级中',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '确认退出吗？',
            success: function (res) {
              if (res.confirm) {
                student.equalTo("classid", options.currentTarget.dataset.id);
                student.find().then(function (todos) {
                  return Bmob.Object.destroyAll(todos);
                }).then();
                wx.showToast({
                  title: '已退出',
                })

                that.data.list.splice(options.currentTarget.dataset.index, 1)
                that.setData({
                  list: that.data.list
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

        }
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })
  }
})