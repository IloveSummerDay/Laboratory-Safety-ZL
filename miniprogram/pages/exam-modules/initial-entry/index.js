// pages/exam-modules/initial-entry/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    examModules: [
      {
        title: '浙江传媒学院媒体工程学院实验室准入安全知识考核',
        start: '永久',
        end: '无'
      }
    ],
    showEnterDialog: false,
    showExamQualificationsDialog: false,
    showExamStandardDialog: false
  },
  async handleAnswer() {
    // 是否获取考试资格
    if (!(await this.isQualify())) {
      this.setData({
        showExamQualificationsDialog: true
      })
      return
    }

    wx.redirectTo({
      url: '../../study/exam/exam'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  async isQualify() {
    //返回True表示有资格
    //返回False表示没有资格
    let app = getApp()
    let res = undefined
    try {
      res = await app.call({
        path: `/selectExamQualifications?id=${app.globalData.id}`
      })
    } catch (error) {
      wx.showToast({
        title: '网络不佳请重试'
      })
      return
    }
    console.log('【有无考试资格】', res.data)
    return res.data
  },
  closeExamDialog() {
    this.setData({
      showEnterDialog: false
    })
  },
  closeQualificationsDialog() {
    this.setData({
      showExamQualificationsDialog: false
    })
  },
  openExamStandardDialog() {
    this.setData({
      showExamStandardDialog: true,
      showExamQualificationsDialog: false
    })
  },
  closeExamStandardDialog() {
    this.setData({
      showExamStandardDialog: false
    })
  }
})
