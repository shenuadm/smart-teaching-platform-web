// 学生课程状态
export const selectStatusConvert = (data) => {
  function switchStatus(item) {
    switch (item.status) {
      case 0:
        item.status = '选课中'
        break;
      case 1:
        item.status = '已选中'
        break;
      case 2:
        item.status = "未选中"
        break;
      case 3:
        item.status = "已撤回"
        break;
      default:
        break;
    }
  }
  if (Array.isArray(data)) {
    data.map(item => {
      switchStatus(item)
    })
  } else {
    switchStatus(data)
  }
  return data;
}
// 教师课程状态
export const courseStatusConvert = (data) => {
  function switchStatus(item) {
    switch (item.status) {
      case 0:
        item.status = '未启用'
        break;
      case 1:
        item.status = '启用'
        break;
      case 2:
        item.status = "选课中"
        break;
      case 3:
        item.status = "选课结束"
        break;
      case 4:
        item.status = "授课中"
        break;
      case 5:
        item.status = "评阅中"
        break;
      case 6:
        item.status = "已结束"
        break;
      case 7:
        item.status = "已关闭"
        break;
      default:
        break;
    }
  }
  if (Array.isArray(data)) {
    data.map(item => {
      switchStatus(item)
    })
  } else {
    switchStatus(data)
  }
  return data;
}
// 公告状态
export const noticeStatus = (data) => {
  function switchStatus(item) {
    switch (item.status) {
      case 0:
        item.status = '未发布'
        break;
      case 1:
        item.status = '已发布'
        break;
      case 2:
        item.status = '已关闭'
        break;
      default:
        break;
    }
  }
  if (Array.isArray(data)) {
    data.map(item => {
      switchStatus(item)
    })
  } else {
    switchStatus(data)
  }
  return data;
}