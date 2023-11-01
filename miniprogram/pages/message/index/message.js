// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})