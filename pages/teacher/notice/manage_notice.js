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
    var Teacher = Bmob.Object.extend("teacher");
    var teacher = new Bmob.Query(Teacher);
    teacher.equalTo('teacherid', currentUser.id)
    teacher.limit(100)
    var Notice = Bmob.Object.extend("notice");
    var notice = new Bmob.Query(Notice);
    var classid = []
    teacher.find({
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
  deleteNotice: function (options) {
    var Notice = Bmob.Object.extend("notice");
    var notice = new Bmob.Query(Notice);
    notice.equalTo("objectId", options.currentTarget.dataset.id);
    notice.find({
      success: function (results) {
        if (results.length == 0) {
          wx.showToast({
            title: '当前公告不存在',
          })
        } else {
          notice.equalTo("objectId", options.currentTarget.dataset.id);
          notice.find().then(function (todos) {
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
  detail: function (options) {
    wx.navigateTo({
      url: 'notice_detail?id=' + options.currentTarget.dataset.id,
    })
  },
})