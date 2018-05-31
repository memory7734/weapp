var Bmob = require('../../../utils/bmob.js');
const app = getApp()
Page({
  data: {
    classid: null
  },

  formSubmit: function (options) {
    var Clazz = Bmob.Object.extend("clazz");
    var clazz = new Clazz();
    var that = this;
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
              icon: 'success',
              success: function () {
                setTimeout(function () {
                  wx.setClipboardData({
                    data: id,
                    success: function () {
                      that.setData({
                        classid: id
                      })
                    }
                  })
                }, 2000) //延迟时间 
              },
            })
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