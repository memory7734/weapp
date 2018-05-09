var Bmob = require('../../../utils/bmob.js');
var app = getApp();
var that
Page({
  data: {
    content: '',
    urlArr: [],
    taskid: '',
  },
  onLoad: function (options) {
    that = this;
    var Task = Bmob.Object.extend("task");
    var task = new Bmob.Query(Task);
    task.get(options.id, {
      success: function (result) {
        that.setData({
          taskid: options.id,
          content: result.get("content"),
          urlArr: result.get("imgArr"),
        })
        wx.setNavigationBarTitle({
          title: result.get("title"),
        })
      },
      error: function (object, error) {
        // 查询失败
      }
    });
  },
});