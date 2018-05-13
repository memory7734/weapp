var Bmob = require('../../utils/bmob.js');
const app = getApp()
var that;
Page({
  data: {
    user: false,
    isteacher: false,
    isstudent: false,
    src: '../../images/cover.png'
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  enterWXapp: function (e) {
    that = this;
    var currentUser = Bmob.User.current();
    currentUser.getUserInfo(e.detail.userInfo)
    if (!currentUser) {
      var user = new Bmob.User();//开始注册用户
      user.auth()
      that.setData({ user: true })
      currentUser = Bmob.User.current();
      if (!currentUser) {
        wx.showToast({
          title: '不授权用户信息将无法正常使用小程序，请退出后删掉本程序，重新加载进来再使用',
          icon: 'none',
        })
      }
    } else {
      var User = Bmob.Object.extend("_User");
      var queryUser = new Bmob.Query(User);
      // 查询所有数据
      queryUser.get(currentUser.id, {
        success: function (result) {
          var isstudent = result.get("isstudent");
          var isteacher = result.get("isteacher");
          var name = result.get("name");
          var studentid = result.get("studentid");

          if (isteacher) {
            app.globalData.isteacher = true
            app.globalData.isstudent = false
            app.globalData.name = name
            wx.redirectTo({
              url: '../teacher/task/list',
            })
          } else if (isstudent) {
            app.globalData.isteacher = false
            app.globalData.isstudent = true
            app.globalData.name = name
            app.globalData.studentid = studentid
            wx.redirectTo({
              // url: '../student/index/index',
              url: '../student/task/list',
            })
          } else {
            result.set("isstudent", false)
            result.set("isteacher", false)
            result.save()
            that.setData({
              user: true
            })

          }
        },
        error: function (object, error) {
          console.log("查询失败")
          // 查询失败
          wx.showToast({
            title: '请检查网络链接',
            icon: 'none',
          })
        }
      });
    }
  },
  isteacher: function () {
    that = this
    that.setData({
      isteacher: true
    })
  },
  isstudent: function () {
    that = this
    that.setData({
      isstudent: true
    })
  },
  registerStudent: function (e) {
    var User = Bmob.Object.extend("_User");
    var queryUser = new Bmob.Query(User);
    var currentUser = Bmob.User.current();
    // 查询所有数据
    queryUser.get(currentUser.id, {
      success: function (result) {
        result.set("isstudent", true)
        result.set("isteacher", false)
        result.set("name", e.detail.value.name)
        result.set("studentid", e.detail.value.studentid)
        result.save()

      },
      error: function (object, error) {
        console.log("查询失败")
        // 查询失败

        wx.showToast({
          title: '请检查网络链接',
          icon: 'none',
        })
      }
    });
    wx.redirectTo({
      // url: '../student/index/index',
      url: '../student/task/list',
    })
  },
  registerTeacher: function (e) {
    var User = Bmob.Object.extend("_User");
    var queryUser = new Bmob.Query(User);
    var currentUser = Bmob.User.current();
    // 查询所有数据
    queryUser.get(currentUser.id, {
      success: function (result) {
        result.set("isstudent", false)
        result.set("isteacher", true)
        result.set("name", e.detail.value.name)
        result.set("studentid", '')
        result.save()
      },
      error: function (object, error) {
        console.log("查询失败")
        // 查询失败

        wx.showToast({
          title: '请检查网络链接',
          icon: 'none',
        })
      }
    });

    wx.redirectTo({
      url: '../teacher/task/list',
    })
  },
})
