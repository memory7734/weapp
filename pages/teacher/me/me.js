// pages/student/signin/signin.js
var template = require('../../../template/template.js');
var Bmob = require('../../../utils/bmob.js');
var app = getApp();
var that;
Page({
  data: {
    userInfo: {},
    currentUserId: null
  },
  onLoad: function () {
    template.tabbarteacher("tabBar", 2, this)
    that = this;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        currentUserId: currentUserId
      })
    })
  },

  onShow: function () {

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
  create_class: function (e) {
    wx.navigateTo({
      url: '../class/create_class',
    })
  },
  classlist: function (e) {
    wx.navigateTo({
      url: '../class/class_list',
    })
  },
  join_class: function (e) {
    wx.navigateTo({
      url: '../class/join_class',
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '辅助课堂',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})