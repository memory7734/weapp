var Bmob = require('../../../utils/bmob.js');
const app = getApp()
var template = require('../../../template/template.js');
var that;
Page({
  data: {
  },
  onLoad: function () {
    template.tabbarstudent("tabBar", 0, this)
    that = this;
    var currentUser = Bmob.User.current();
    console.log(currentUser)
  },
  logout: function (e) {
    var currentUser = Bmob.User.current();
    var User = Bmob.Object.extend("_User");
    var user = new Bmob.Query(User);
    user.equalTo("objectId", currentUser.id);
    user.find({
      success: function (results) {
        if (results.length == 0) {
          wx.showToast({
            title: '当前用户不存在',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '确认退出吗？',
            success: function (res) {
              if (res.confirm) {
                user.equalTo("objectId", currentUser.id);
                user.get(currentUser.id, {
                  success: function (result) {
                    result.set('isteacher', false);
                    result.set('isstudent', false);
                    result.save();
                  },
                  error: function (object, error) {

                  }
                })
                wx.showToast({
                  title: '已退出',
                })
                wx.redirectTo({
                  url: '../../index/index',
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
  },
  class_list: function (e) {
    wx.navigateTo({
      url: '../class/class_list',
    })
  },
  join_class: function (e) {
    wx.navigateTo({
      url: '../class/join_class',
    })
  },
  notice_list: function (e) {
    wx.navigateTo({
      url: '../notice/notice_list',
    })
  },
  task_list: function (e) {
    wx.navigateTo({
      url: '../task/list',
    })
  },
})
