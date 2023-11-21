// pages/message/message.js
import Message from 'tdesign-miniprogram/message/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoginDialog: false,
    messageList: []
    // [{
    //   time: '10月7日',
    //   messageClassify: "系统消息",
    //   messageTitle: "您获得了“安全准入”证书",
    //   messageContent: "经过您对实验室安全知识的初步学习与掌握，获实验室安全平台发放的“ 安全准入” 证书！",
    // }, ]
  },
  handleClick(e) {
    console.log('【点击了消息块】', e.currentTarget.dataset.index)
    // let messageIndex = e.currentTarget.dataset.index
    // this.data.messageList[messageIndex]
  },
  onShow() {
    console.log('【消息通知页显示】')
    let app = getApp()
    if (!app.globalData.isLogin) {
      this.setData({
        showLoginDialog: true
      })
      return
    }
    // 发起消息请求，接受消息列表回调
    // ...
    // 若消息列表为空
    Message.info({
      context: '',
      offset: [20, 32],
      duration: 5000,
      content: '您目前暂无消息通知哦~'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  }
})
