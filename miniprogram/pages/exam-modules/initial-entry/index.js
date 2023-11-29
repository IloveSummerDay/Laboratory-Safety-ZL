// pages/exam-modules/initial-entry/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    examModules: [
      {
        title: '浙江传媒学院媒体工程学院实验室准入安全知识考核',
        start: '2023-11-15',
        end: '2024-1-1',
        complete: false
        // isQualify: true
      },
      {
        title: '浙江传媒学院实验室应急技能及实验室物品安全使用考试',
        start: '2023-10-1',
        end: '2024-11-7',
        complete: true
        // isQualify: true
      },
      {
        title: '媒体工程学院实验室基础实验物品辨别测试',
        start: '2023-9-10',
        end: '2024-9-30',
        complete: true
        // isQualify: true
      }
    ],
    showEnterDialog: false,
    showExamQualificationsDialog: false,
    showExamStandardDialog: false,
    showStartExam: false,
    showExamCompleteDialog: false
  },
  async handleAnswer(e) {
    // 是否已完成
    if (this.data.examModules[e.currentTarget.dataset.index].complete) {
      this.setData({ showExamCompleteDialog: true })
      return
    }
    // 是否获取考试资格
    else if (!(await this.isQualify())) {
      this.setData({ showExamQualificationsDialog: true })
      return
    }
    // 进入考试
    this.setData({ showEnterDialog: true })
  },
  toExam() {
    this.setData({ showEnterDialog: false })
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
      return false
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
  },
  closeExamCompleteDialog() {
    this.setData({
      showExamCompleteDialog: false
    })
  }
})
