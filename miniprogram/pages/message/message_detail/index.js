// pages/message/message_detail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: undefined,
    content: undefined,
    messageClassify: 'system', // 'tip' || 'system'
    time: '10-07' // undefined
  },

  /**
   * 生命周期函数--监听页面加载
   * @params { key: value }
   */
  onLoad(options) {
    console.log('【消息详情页 数据初始化】', options)
    this.setData({
      title: options.messageTitle,
      content: options.messageContent,
      messageClassify: options.messageClassify
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})
