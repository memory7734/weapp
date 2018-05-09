var Bmob = require('../../../utils/bmob.js');
const app = getApp()
var that
Page({
  data: {
    content: null
  },
  onLoad: function (options) {
    that = this;
    var Notice = Bmob.Object.extend("notice");
    var notice = new Bmob.Query(Notice);
    notice.get(options.id, {
      success: function (result) {
        that.setData({
          content: result.get("content")
        })
        wx.setNavigationBarTitle({
          title: result.get("title"),
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