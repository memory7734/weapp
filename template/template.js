function tabbar1() {
  return [
    {
      "current": 0,
      "pagePath": "/pages/student/task/list",
      "iconPath": "/images/1-2.png",
      "selectedIconPath": "/images/1-1.png",
      "text": "作业"

    },
    {
      "current": 0,
      "pagePath": "/pages/student/notice/notice_list",
      "iconPath": "/images/2-2.png",
      "selectedIconPath": "/images/2-1.png",
      "text": "公告"
    },
    {
      "current": 0,
      "pagePath": "/pages/student/me/me",
      "iconPath": "/images/3-2.png",
      "selectedIconPath": "/images/3-1.png",
      "text": "我的"
    }
  ]
}

function tabbar2() {
  return [
    {
      "current": 0,
      "pagePath": "/pages/teacher/task/list",
      "iconPath": "/images/1-2.png",
      "selectedIconPath": "/images/1-1.png",
      "text": "作业"

    },
    {
      "current": 0,
      "pagePath": "/pages/teacher/notice/index",
      "iconPath": "/images/2-2.png",
      "selectedIconPath": "/images/2-1.png",
      "text": "公告"
    },
    {
      "current": 0,
      "pagePath": "/pages/teacher/me/me",
      "iconPath": "/images/3-2.png",
      "selectedIconPath": "/images/3-1.png",
      "text": "我的"
    }
  ]
}
//tabbar 主入口
function tabbarstudent(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbar1();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
}
//tabbar 主入口
function tabbarteacher(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbar2();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
}

module.exports = {
  tabbarstudent: tabbarstudent,
  tabbarteacher: tabbarteacher
}