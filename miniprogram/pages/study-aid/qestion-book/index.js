// pages/study-aid/qestion-book/index.js
Page({
  data: {
    errorList: [],
    value: 'AllError',
    list: [
      { value: 'AllError', label: '全部错题' },
      { value: 'UnStudy', label: '未学习' },
      { value: 'Studied', label: '已学习' }
    ],
    activeValues: [],
    activeAnalysis: {}
  },
  onChangeNav(e) {
    console.log(e.detail.value)
    const strategy = {
      AllError: () => {
        this.getErrQuestions()
      },
      UnStudy: () => {
        this.setData({
          errorList: []
        })
      },
      Studied: () => {
        this.setData({
          errorList: []
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
    console.log(e.detail.value, index, activeValues)
    for (let j = 0; j < activeValues.length; j++) {
      activeAnalysis[activeValues[j]] = true
    }
    this.setData({
      activeAnalysis: activeAnalysis
    })
    wx.nextTick(() => {
      console.log(this.data.activeAnalysis[index])
      this.setData({
        activeValues
      })
    })
  },
  async getErrQuestions() {
    const app = getApp()
    if (!app.globalData.isLogin) return
    wx.showLoading({
      title: '查询错题中'
    })
    const res = await app.call({
      path: `/getWrong?user_id=${app.globalData.id}`,
      header: {
        'content-type': 'application/form-data'
      },
      method: 'POST'
    })
    console.log('【从后端查询得到错题列表】', res)
    if (res) {
      wx.hideLoading()
      let errorList = res.map((item, index) => {
        return {
          questionText: item.content,
          myAnswer: item.student_answer,
          currentAnswer: item.answer
        }
      })
      this.setData({
        errorList
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
