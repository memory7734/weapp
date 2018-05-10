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
  },
  enterWXapp: function () {
    that = this;
    var currentUser = Bmob.User.current();
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
