var Bmob = require('../../../utils/bmob.js');
var app = getApp();
var that
Page({
  data: {
    title: '',
    content: '',
    urlArr: [],
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
    var that = this
    var Task = Bmob.Object.extend("task");
    var task = new Task();
    var currentUser = Bmob.User.current();
    task.set("title", e.detail.value.title);
    task.set("content", e.detail.value.content);
    task.set("imgArr", that.data.urlArr);
    task.set("teacherid", currentUser.id);
    task.set("classid", that.data.array[that.data.index].id);
    task.save(null, {
      success: function (result) {
        wx.showToast({
          title: '创建作业成功',
          icon: 'none',
          success: function () {
            setTimeout(function () {
              wx.reLaunch({
                url: 'list',
              })
            }, 2000) //延迟时间 
          },
        })
      },
      error: function (result, error) {
        wx.showToast({
          title: '创建作业失败',
          icon: 'none'
        })
      }
    });
  }
});