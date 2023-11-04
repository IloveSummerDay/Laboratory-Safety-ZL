// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoginDialog: false,
    messageList: [{
      time: '10月7日',
      messageClassify: "系统消息",
      messageTitle: "您获得了“安全准入”证书",
      messageContent: "经过您对实验室安全知识的初步学习与掌握，获实验室安全平台发放的“ 安全准入” 证书！",
    }, ]
  },
  handleClick(e) {
    console.log('【点击了消息块】', e.currentTarget.dataset.index);
    // let messageIndex = e.currentTarget.dataset.index
    // this.data.messageList[messageIndex]

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
    console.log('【跳转到个人中心去登录】');
    wx.switchTab({
      url: '../../my/index/my'
    })
  }

})