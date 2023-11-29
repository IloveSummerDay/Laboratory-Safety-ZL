// pages/study-aid/study-notes-detail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    isEdit: false
  },
  handleEdit() {
    this.setData({ isEdit: true })
  },
  handleCompleteEdit() {
    this.setData({ isEdit: false })
    wx.showToast({
      title: '保存成功'
    })
  },
  updataNewNotes(e) {
    console.log(e)
    this.setData({
      content: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      title: options.title,
      content: options.content,
      newContent: ''
    })
  }
})
