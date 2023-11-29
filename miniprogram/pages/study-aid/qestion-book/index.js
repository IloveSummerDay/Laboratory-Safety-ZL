// pages/study-aid/qestion-book/index.js
Page({
  data: {
    questionsList: [],
    value: 'AllError',
    list: [
      { value: 'AllError', label: '全部错题' },
      { value: 'UnStudy', label: '未学习' },
      { value: 'Studied', label: '已学习' }
    ],
    activeValues: [],
    activeAnalysis: {} // { 0: true, 1: true ...}
  },
  onChangeNav(e) {
    console.log(e.detail.value)
    const strategy = {
      AllError: () => {
        this.getErrQuestions()
      },
      UnStudy: () => {
        this.setData({
          questionsList: []
        })
      },
      Studied: () => {
        this.setData({
          questionsList: []
        })
      }
    }
    this.setData({
      value: e.detail.value
    })
    wx.nextTick(() => {
      strategy[e.detail.value]()
    })
  },
  handleLookAnalysis(e) {
    let index = e.currentTarget.dataset.index
    let activeValues = this.data.activeValues
    let activeAnalysis = {}
    if (activeValues.includes(index)) {
      let temp = activeValues
      activeValues = temp.filter(item => item !== index)
    } else {
      activeValues.push(index)
    }
    for (let j = 0; j < activeValues.length; j++) {
      activeAnalysis[activeValues[j]] = true
    }
    this.setData({
      activeAnalysis: activeAnalysis
    })
    wx.nextTick(() => {
      this.setData({
        activeValues
      })
    })
  },
  async getErrQuestions() {
    const app = getApp()
    let res = undefined
    if (!app.globalData.isLogin) return
    wx.showLoading({
      title: '查询错题中'
    })
    try {
      res = await app.call({
        path: `/getWrong?user_id=${app.globalData.id}`,
        header: {
          'content-type': 'application/form-data'
        },
        method: 'POST'
      })
    } catch (error) {
      wx.showModal({
        title: '网络不佳',
        content: '请尝试重新进入错题册',
        complete: res => {
          if (res.confirm) {
            wx.switchTab({
              url: '../../study/index/index'
            })
          }
        }
      })
    }
    console.log('【从后端查询得到错题列表】', res)
    if (res.length >= 0) {
      wx.hideLoading()
      let questionsList = res
      this.setData({
        questionsList
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const app = getApp()
    if (app.globalData.isLogin) {
      this.getErrQuestions()
    }
  }
})
