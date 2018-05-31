var Bmob = require('../../../utils/bmob.js');
const app = getApp()
var that
Page({
  data: {
    array: [],
    index: 0
  },
  onLoad: function (options) {
    that = this;
    var currentUser = Bmob.User.current();
    var Teacher = Bmob.Object.extend("teacher");
    var teacher = new Bmob.Query(Teacher);
    teacher.equalTo('teacherid', currentUser.id)
    teacher.limit(100)
    var Clazz = Bmob.Object.extend("clazz");
    var clazz = new Bmob.Query(Clazz);
    var classid = []
    teacher.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          classid[i] = results[i].get('classid');
        }
        clazz.containedIn("objectId", classid)
        clazz.limit(100)
        clazz.find({
          success: function (results) {
            var classlist = []
            for (var i = 0; i < results.length; i++) {
              classlist[i] = {}
              classlist[i]['id'] = results[i].id;
              classlist[i]['name'] = results[i].get('name');
            }
            that.setData({
              array: classlist
            })
          },
          error: function (error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });

  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  formSubmit: function (e) {
    console.log(e.detail.value)
    var Notice = Bmob.Object.extend("notice");
    var notice = new Notice();
    var currentUser = Bmob.User.current();
    notice.set("title", e.detail.value.title);
    notice.set("content", e.detail.value.content);
    notice.set("classid", this.data.array[this.data.index].id);
    notice.set("teacherid", currentUser.id);

    //添加数据，第一个入口参数是null
    notice.save(null, {
      success: function (result) {
        wx.showToast({
          title: '创建成功',
          icon: 'success',
          success: function () {
            setTimeout(function () {
              wx.navigateBack({})
            }, 2000) //延迟时间 
          },
        })
      },
      error: function (result, error) {
        wx.showToast({
          title: '创建失败',
          icon: 'none'
        })
      }
    });
  },
})