// pages/my/personal-data/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  handleExit() {
    const app = getApp()
    for (let key in app.globalData) {
      app.globalData[key] = undefined
    }
    wx.reLaunch({
      url: '../index/my'
    })
    wx.showToast({
      title: '退出账号成功'
    })
    console.log('【退出该账号登录！！！】')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {}
})
