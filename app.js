var Bmob = require('utils/bmob.js');
Bmob.initialize(
  "5ee6339aa65768404b0f7aebd5ba3d82",
  "4f0ac8e0df982063fcfcebd1a38e3541"
);
App({
  onLaunch: function () {
    var user = new Bmob.User();//开始注册用户
    user.auth()
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {

          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    isteacher: false,
    isstudent: false,
    name: null,
    studentid: null,
  }
})