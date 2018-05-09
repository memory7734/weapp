var Bmob = require('../../../utils/bmob.js');
var app = getApp();
var that
Page({
  data: {
    title: '',
    content: '',
    urlArr: [],
    array: [],
    index: 0,
    taskid: '',
  },
  onLoad: function (options) {
    that = this;
    var Task = Bmob.Object.extend("task");
    var task = new Bmob.Query(Task);
    that.setData({
      taskid: options.id
    })
    var clazzid
    task.get(options.id, {
      success: function (result) {
        that.setData({
          title: result.get("title"),
          content: result.get("content"),
          urlArr: result.get("imgArr"),
        })
        clazzid = result.get("classid")
      },
      error: function (object, error) {
        // 查询失败
      }
    });
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
              if (clazzid == results[i].id) {
                that.setData({
                  index: i
                })
              }
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
});