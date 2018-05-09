var Bmob = require('../../../utils/bmob.js');
const app = getApp()
var that
Page({
  data: {
    title: null,
    content: null
  },
  onLoad: function (options) {
    that = this;
    var Notice = Bmob.Object.extend("notice");
    var notice = new Bmob.Query(Notice);
    notice.get(options.id, {
      success: function (result) {
        that.setData({
          title: result.get("title"),
          content: result.get("content")
        })
      },
      error: function (object, error) {
        wx.showToast({
          title: '公告不存在',
          icon: 'none'
        })
      }
    });

  },
})