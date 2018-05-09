var Bmob = require('../../../utils/bmob.js');
const app = getApp()
Page({
  data: {
    classid: null
  },

  formSubmit: function (options) {
    var Clazz = Bmob.Object.extend("clazz");
    var clazz = new Clazz();
    var that =this;
    clazz.set("name", options.detail.value.class_name);
    clazz.save(null, {
      success: function (result) {
        var Teacher = Bmob.Object.extend("teacher");
        var teacher = new Teacher();
        var currentUser = Bmob.User.current();
        var id = result.id;
        teacher.set("classid", result.id);
        teacher.set("teacherid", currentUser.id);
        teacher.save(null, {
          success: function (result) {
            //创建成功
            wx.showToast({
              title: '创建成功',
              icon: 'success'
            })
            that.setData({
              classid: id
            })
            wx.setClipboardData({
              data: id,
              success: function () {
                wx.showToast({
                  title: '已复制到剪贴板，可直接进入群聊分享',
                  icon: 'none'
                })
              }
            })
            // setTimeout(function () {
            //   wx.hideToast()
            //   wx.navigateBack({})
            // }, 1500)
          },
          error: function (result, error) {
            console.log("关联班级失败")
            //创建失败
            wx.showToast({
              title: '关联班级失败，请重试',
              icon: 'none'
            })
          }
        })
      },
      error: function (result, error) {
        console.log("创建班级失败")
        //创建失败
        wx.showToast({
          title: '创建班级失败，请重试',
          icon: 'none'
        })
      }
    })
  },
})