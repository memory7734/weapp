var Bmob = require('../../../utils/bmob.js');
var app = getApp();
var that
Page({
  data: {
    title: '',
    content: '',
    urlArr: [],
    update: false,
    answerid: '',
    taskid: ''
  },
  onLoad: function (options) {
    that = this;
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
            title: results[0].get('title'),
            content: results[0].get('content'),
            urlArr: results[0].get('imgArr'),
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
        // var urlArr={};
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
                urlArr: urlArr
              })
              console.log(urlArr)
              // }

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
          results.set("title", e.detail.value.title);
          results.set("content", e.detail.value.content);
          results.set("imgArr", that.data.urlArr);
          results.save();
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          wx.navigateBack({

          })
        }
      })
    } else {
      var answer = new Answer();
      var currentUser = Bmob.User.current();
      answer.set("title", e.detail.value.title);
      answer.set("content", e.detail.value.content);
      answer.set("imgArr", that.data.urlArr);
      answer.set("taskid", that.data.taskid);
      answer.set("studentid", currentUser.id);
      answer.save(null, {
        success: function (result) {
          wx.showToast({
            title: '填写答案成功',
            icon: 'none'
          })
          wx.navigateBack({
            
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