// pages/teacher/class/class_list.js
var Bmob = require('../../../utils/bmob.js');
const app = getApp()
var that
Page({
  data: {
    list: null,
    changed_name: null,
    changed_index: null,
    changed_id: null,
    showModal: false,
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
              list: classlist
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
  dismiss: function (options) {
    var currentUser = Bmob.User.current();
    var Teacher = Bmob.Object.extend("teacher");
    var teacher = new Bmob.Query(Teacher);
    teacher.equalTo("classid", options.currentTarget.dataset.id);
    teacher.find({
      success: function (results) {
        if (results.length == 0) {
          wx.showToast({
            title: '未在当前班级中',
          })
        } else if (results.length == 1) {
          wx.showModal({
            title: '提示',
            content: '您是这个班级最后一位老师，您退出班级将导致班级解散',
            success: function (res) {
              if (res.confirm) {
                var Clazz = Bmob.Object.extend("clazz");
                var clazz = new Bmob.Query(Clazz);
                /**
                 * todo
                 * 删除班级的所有信息
                 */
                teacher.equalTo("classid", options.currentTarget.dataset.id);
                teacher.find().then(function (todos) {
                  return Bmob.Object.destroyAll(todos);
                }).then();

                clazz.equalTo("objectId", options.currentTarget.dataset.id);
                clazz.find().then(function (todos) {
                  return Bmob.Object.destroyAll(todos);
                }).then();

                wx.showToast({
                  title: '已退出',
                })

                that.data.list.splice(options.currentTarget.dataset.index, 1)
                that.setData({
                  list: that.data.list
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

        } else {
          teacher.equalTo("classid", options.currentTarget.dataset.id);
          teacher.find().then(function (todos) {
            return Bmob.Object.destroyAll(todos);
          }).then(function (todos) {
            wx.showToast({
              title: '已退出',
            })
            that.data.list.splice(options.currentTarget.dataset.index, 1)
            that.setData({
              list: that.data.list
            })
          }, function (error) {
            // 异常处理
          });
        }
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })



  },
  catch_data: function (options) {
    console.log(options)
    that.setData({
      changed_index: options.currentTarget.dataset.index,
      changed_id: options.currentTarget.dataset.id,
      changed_name: that.data.list[options.currentTarget.dataset.index]['name']
    })
    console.log(that.data)
  },
  inputChange: function (event) {
    that.setData({
      changed_name: event.detail.value
    })
  },

  /**
 * 弹窗
 */
  change_name: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
    /*
    changed_name和changed_id存储了修改的信息
    */
    var Clazz = Bmob.Object.extend("clazz");
    var clazz = new Bmob.Query(Clazz);
    clazz.get(that.data.changed_id, {
      success: function (result) {
        console.log(result)
        result.set('name', that.data.changed_name);
        result.save();
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        })
        that.data.list[that.data.changed_index].name = that.data.changed_name
        that.setData({
          list: that.data.list
        })
      },
      error: function (object, error) {

        wx.showToast({
          title: '修改失败',
          icon: 'none'
        })
      }
    });
  }
})