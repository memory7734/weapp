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
    template.tabbarteacher("tabBar", 0, this)
    that = this;
    var currentUser = Bmob.User.current();
    var Task = Bmob.Object.extend("task");
    var task = new Bmob.Query(Task);
    task.equalTo('teacherid', currentUser.id)
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

  },
  detail: function (options) {
    wx.navigateTo({
      url: 'detail?id=' + options.currentTarget.dataset.id,
    })
  },
  update: function (options) {
    wx.navigateTo({
      url: 'update?id=' + options.currentTarget.dataset.id,
    })
  },
  deleteTask: function (options) {
    /**
     * todo
     * 删除所有的作业回答
     */
    var Task = Bmob.Object.extend("task");
    var task = new Bmob.Query(Task);
    task.equalTo("objectId", options.currentTarget.dataset.id);
    task.find({
      success: function (results) {
        if (results.length == 0) {
          wx.showToast({
            title: '当前作业不存在',
          })
        } else {
          task.equalTo("objectId", options.currentTarget.dataset.id);
          task.find().then(function (todos) {
            return Bmob.Object.destroyAll(todos);
          }).then(function (todos) {
            wx.showToast({
              title: '已删除',
            })
            that.data.list.splice(options.currentTarget.dataset.index, 1)
            that.setData({
              list: that.data.list
            })
          }, function (error) {
            // 异常处理
          });
        }
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })

  },
  situation: function (options) {
    wx.navigateTo({
      url: '../answer/list?id=' + options.currentTarget.dataset.id + '&title=' + options.currentTarget.dataset.title,
    })
  },
  create_task: function (e) {
    wx.navigateTo({
      url: 'create',
    })
  },
})