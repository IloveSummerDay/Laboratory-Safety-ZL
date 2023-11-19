// pages/home/regulation-detail/index.js
let regualtionIndex = undefined
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    regualtionIndex = Number(options.index) // "0/1/2/3"
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  async onUnload() {
    let app = getApp()
    if (!app.globalData.isLogin) return
    if (app.globalData[`rule${regualtionIndex + 1}`]) return
    const res = await app.call({
      path: `/setRule${regualtionIndex + 1}?id=${app.globalData.id}`,
      method: 'PUT'
    })
    console.log(res)
    if (res.code == 200) {
      wx.showToast({
        title: res.message
      })
      console.log(`【学习规章制度 ${regualtionIndex + 1} 完成】`, res.message)
    } else {
      console.log(`【学习规章制度接口调用失败】`, res.message)
    }
    regualtionIndex = undefined
  }
})
