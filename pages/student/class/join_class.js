var Bmob = require('../../../utils/bmob.js');
const app = getApp()
Page({
  data: {
  },
  formSubmit: function (options) {
    var Clazz = Bmob.Object.extend("clazz");
    var clazz = new Bmob.Query(Clazz);
    var classid = options.detail.value.classid;
    var that = this;
    clazz.equalTo("objectId", classid);
    clazz.find({
      success: function (result) {
        if (result.length == 0) {
          wx.showToast({
            title: '班级不存在，请检查班级id',
            icon: 'none'
          })
        } else {
          var Student = Bmob.Object.extend("student");
          var student = new Bmob.Query(Student);
          var currentUser = Bmob.User.current();
          student.equalTo("studentid", currentUser.id);
          student.equalTo("classid", classid);
          student.find({
            success: function (result) {
              if (result.length == 1) {
                wx.showToast({
                  title: '您已经加入该班级',
                  icon: 'none'
                })
              } else {
                student = new Student();
                student.set("classid", classid);
                student.set("studentid", currentUser.id);
                student.save(null, {
                  success: function (result) {
                    wx.showToast({
                      title: '加入成功',
                      icon: 'none',
                      success: function () {
                        setTimeout(function () {
                          wx.navigateBack({})
                        }, 2000) //延迟时间 
                      },
                    })
                  },
                  error: function (result, error) {
                    wx.showToast({
                      title: '加入班级失败，请重试',
                      icon: 'none'
                    })
                  }
                })
              }
            }
          })
        }
      },
      error: function (result, error) {
        wx.showToast({
          title: '查询班级失败，请重试',
          icon: 'none'
        })
      }
    })
  },
})