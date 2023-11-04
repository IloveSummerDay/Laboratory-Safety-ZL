// pages/home/safety-manual/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoginDialog: false,
    categorizeImgURL: [
      {
        url:
          'cloud://cloud1-9gesq8mi1d4ae3de.636c-cloud1-9gesq8mi1d4ae3de-1314621544/安全手册icon/电气安全.png',
        value: '电气安全',
        nav: '../class-table/index'
      },
      {
        url:
          'cloud://cloud1-9gesq8mi1d4ae3de.636c-cloud1-9gesq8mi1d4ae3de-1314621544/安全手册icon/废物处置.png',
        value: '废物处置',
        nav: '../class-table/index'
      },
      {
        url:
          'cloud://cloud1-9gesq8mi1d4ae3de.636c-cloud1-9gesq8mi1d4ae3de-1314621544/安全手册icon/消防安全.png',
        value: '消防安全',
        nav: '../class-table/index'
      },
      {
        url:
          'cloud://cloud1-9gesq8mi1d4ae3de.636c-cloud1-9gesq8mi1d4ae3de-1314621544/安全手册icon/应急救援.png',
        value: '应急救援',
        nav: '../class-table/index'
      },
      {
        url:
          'cloud://cloud1-9gesq8mi1d4ae3de.636c-cloud1-9gesq8mi1d4ae3de-1314621544/安全手册icon/应急演练.png',
        value: '应急演练',
        nav: '../class-table/index'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let app = getApp()
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
