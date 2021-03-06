var Bmob = require('../../../utils/bmob.js');
var app = getApp();
var that
Page({
  data: {
    content: '',
    urlArr: [],
    taskid: '',
    answer_title: '',
    answer_content: '',
    answer_urlArr: [],
    update: false,
    answerid: '',
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
    that.setData({
      update: false,
      taskid: options.id
    })
    var currentUser = Bmob.User.current();
    var Answer = Bmob.Object.extend("answer");
    var answer = new Bmob.Query(Answer);
    answer.equalTo('taskid', options.id)
    answer.equalTo('studentid', currentUser.id)
    answer.find({
      success: function (results) {
        if (results.length == 1) {
          that.setData({
            answer_title: results[0].get('title'),
            answer_content: results[0].get('content'),
            answer_urlArr: results[0].get('imgArr'),
            update: true,
            answerid: results[0].id,
          })
        }
      }
    })
  },
  upImg: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showNavigationBarLoading()
        that.setData({
          loading: false
        })
        var urlArr = new Array();
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        var imgLength = tempFilePaths.length;
        if (imgLength > 0) {
          var newDate = new Date();
          var newDateStr = newDate.toLocaleDateString();
          var j = 0;
          //如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
          for (var i = 0; i < imgLength; i++) {
            var tempFilePath = [tempFilePaths[i]];
            var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
            if (extension) {
              extension = extension[1].toLowerCase();
            }
            var name = newDateStr + "." + extension;//上传的图片的别名

            var file = new Bmob.File(name, tempFilePath);
            file.save().then(function (res) {
              wx.hideNavigationBarLoading()
              var url = res.url();
              urlArr.push(url);
              j++;
              console.log(j, imgLength);
              that.setData({
                loading: true,
                answer_urlArr: urlArr
              })
              console.log(answer_urlArr)

            }, function (error) {
              console.log(error)
            });

          }
        }
      }
    })
  },
  formSubmit: function (e) {
    var Answer = Bmob.Object.extend("answer");
    if (that.data.update) {
      var answer = new Bmob.Query(Answer);
      answer.get(that.data.answerid, {
        success: function (results) {
          results.set("title", e.detail.value.answer_title);
          results.set("content", e.detail.value.answer_content);
          results.set("imgArr", that.data.answer_urlArr);
          results.set("reviewed", false);
          results.save();
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            success: function () {
              setTimeout(function () {
                wx.navigateBack({})
              }, 2000) //延迟时间 
            },
          })
        }
      })
    } else {
      var answer = new Answer();
      var currentUser = Bmob.User.current();
      answer.set("title", e.detail.value.answer_title);
      answer.set("content", e.detail.value.answer_content);
      answer.set("imgArr", that.data.answer_urlArr);
      answer.set("taskid", that.data.taskid);
      answer.set("studentid", currentUser.id);
      answer.save(null, {
        success: function (result) {
          wx.showToast({
            title: '填写答案成功',
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
            title: '填写答案失败',
            icon: 'none'
          })
        }
      });
    }
  }
});