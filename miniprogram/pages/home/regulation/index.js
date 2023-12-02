// pages/home/regulation/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoginDialog: false,
    rules: [
      '媒体工程学院实验室安全管理办法',
      '实验室突发事件应急处理预案',
      '浙江省高等学校实验室安全管理办法',
      '浙江传媒学院实验室安全管理办法',
      '高等学校实验室消防安全管理规范',
      '高等学校实验室安全规范',
      '浙江传媒学院学生实验守则',
      '浙江传媒学院实验室突发事件应急处置预案'
    ]
  },
  toWebView() {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let app = getApp()
    // 核验是否登录
    if (!app.globalData.isLogin) {
      this.setData({
        showLoginDialog: true
      })
    }
  },
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  }
})
