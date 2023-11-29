// pages/message/message.js
import Message from 'tdesign-miniprogram/message/index'
import { messageList } from './table' // 只为演示用
let app = undefined
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoginDialog: false,
    // messageList: []
    messageList: [],
    noMessDialog: false
  },
  handleClick(e) {
    console.log('【点击了消息块】', e.currentTarget.dataset.index)
    // let messageIndex = e.currentTarget.dataset.index
    // this.data.messageList[messageIndex]
  },
  onShow() {
    console.log('【消息通知页显示】登录状态', app.globalData.isLogin)
    if (!app.globalData.isLogin) {
      console.log('【消息通知页 用户未登录】')
      this.setData({
        showLoginDialog: true
      })
      return
    } else this.setData({ showLoginDialog: false, messageList })
    // 发起消息请求，接受消息列表回调
    // ...
    // if (messageList.length == 0 && !this.data.noMessDialog) {
    //   Message.info({
    //     context: '',
    //     offset: [20, 32],
    //     duration: 5000,
    //     content: '您目前暂无消息通知哦~'
    //   })
    // }
    // this.setData({ noMessDialog: true, messageList })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    app = getApp()
  },
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  }
})
