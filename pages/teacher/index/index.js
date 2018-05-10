var Bmob = require('../../../utils/bmob.js');
var template = require('../../../template/template.js');
const app = getApp()
var that;
Page({
  data: {
  },
  onLoad: function () {
    that = this;
    template.tabbarteacher("tabBar", 0, this)


    // var User = Bmob.Object.extend("_User");
    // var UserModel = new User();
    // console.log(currentUser)
    // app.getUserInfo(function (userInfo) {
    //   console.log(userInfo)
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo,
    //     // currentUserId: currentUserId
    //   })
    // })
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
  create_notice: function (e) {
    wx.navigateTo({
      url: '../notice/create_notice',
    })
  },
  manage_notice: function (e) {
    wx.navigateTo({
      url: '../notice/manage_notice',
    })
  },
  notice_list: function (e) {
    wx.navigateTo({
      url: '../notice/notice_list',
    })
  },
  create_task: function (e) {
    wx.navigateTo({
      url: '../task/create',
    })
  },
  task_list: function (e) {
    wx.navigateTo({
      url: '../task/list',
    })
  },
})
