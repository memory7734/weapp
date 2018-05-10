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
    template.tabbarteacher("tabBar", 1, this)
    that = this;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      //更新数据
      that.setData({
        userInfo: userInfo,
        currentUserId: currentUserId
      })
    })
  },

  create: function (e) {
    wx.navigateTo({
      url: 'create_notice',
    })
  },
  list: function (e) {
    wx.navigateTo({
      url: 'notice_list',
    })
  },
  manage: function (e) {
    wx.navigateTo({
      url: 'manage_notice',
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