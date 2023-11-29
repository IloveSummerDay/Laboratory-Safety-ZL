// pages/home/regulation-detail/index.js
import { articleURL } from './table'
let regualtionIndex = undefined
Page({
  /**
   * 页面的初始数据
   */
  data: {
    regulationTitle: '',
    regualtionsParas: [],
    articleURL: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    regualtionIndex = Number(options.index) // "0/1/2/3..."
    this.setData({
      articleURL: articleURL[regualtionIndex]
      // regulationTitle: regulationsTxt[regualtionIndex].title,
      // regualtionsParas: regulationsTxt[regualtionIndex].paras
    })
  },
  /**
   * @desc 监听页面卸载 记录 规则制度学习进度
   */
  async onUnload() {
    let app = getApp()
    if (!app.globalData.isLogin) return
    if (app.globalData[`rule${regualtionIndex + 1}`]) return
    let res = undefined
    try {
      res = await app.call({
        path: `/setRule${regualtionIndex + 1}?id=${app.globalData.id}`,
        method: 'PUT'
      })
    } catch (error) {
      wx.showModal({
        title: '网络不佳',
        content: '由于退出过程中网络出错，导致学习进度记录失败，请重新学习',
        cancelText: '改日再学',
        confirmText: '重新学习',
        complete: res => {
          if (res.cancel) {
            wx.showToast({
              title: '记录失败'
            })
          }
          if (res.confirm) {
            wx.navigateTo({
              url: `./index?index=${regualtionIndex}`
            })
          }
        }
      })
      return
    }
    console.log(res)
    // 学习规章制度接口调用成功
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
