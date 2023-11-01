// pages/study/answer/answer.js
import Toast from 'tdesign-miniprogram/toast/index'
let options4 = ['A', 'B', 'C', 'D']
let options2 = ['正确', '错误']
let questionNumber = 1 // 题号
let currentOption = undefined // 正确答案 'A'
let chooseOption = -1 // 当前选项0123
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showAnswerSituationDialog: false,
    answerSituation: undefined,
    questionNumber: 1,
    type: '单选',
    question: undefined,
    answered: 0, // 已答题数
    defaultOption: undefined,
    options: undefined
  },
  handleExit() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  handleOpenDialog() {
    this.setData({
      answerSituation: `已经练习 ${this.data.answered} 题, 再接再厉哦！`,
      showAnswerSituationDialog: true
    })
  },
  onChangeRadio(value) {
    console.log('【选项号0123】', value.detail.value)
    if (this.data.type === '单选') {
      chooseOption = options4[value.detail.value]
    } else if (this.data.type == '判断') {
      chooseOption = options2[value.detail.value]
    }
  },
  /**
   * @desc 与 handleNext() 配合使用
   */
  getNextQuestion() {
    questionNumber += 1
    wx.request({
      url: 'https://springboot-07ie-78136-5-1314621544.sh.run.tcloudbase.com/findQuestion',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        id: questionNumber
      },
      success: res => {
        console.log('【查询题目成功回调】', res.data.data)
        let resp = res.data.data
        let optionsArray = [resp.option_A, resp.option_B, resp.option_C, resp.option_D]
        currentOption = resp.answer // 'A'
        this.setData({
          answered:
            questionNumber - 1 <= this.data.answered
              ? this.data.answered
              : (this.data.answered += 1),
          question: `${questionNumber}、` + resp.content,
          options: this.data.options.map((el, index) => {
            return {
              value: index,
              label: optionsArray[index]
            }
          })
        })
      },
      fail: (errno, errMsg) => {
        console.log('【查询题目失败回调】', errno, errMsg)
      }
    })
  },
  // handlePrev() {
  //   questionNumber -= 1
  //   wx.request({
  //     url: "https://demo-77568-5-1322007337.sh.run.tcloudbase.com/findQuestion",
  //     method: "GET",
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     data: {
  //       id: questionNumber,
  //     },
  //     success: (res) => {
  //       console.log("【查询题目成功回调】", res.data.data);
  //       let resp = res.data.data
  //       let optionsArray = [resp.option_A, resp.option_B, resp.option_C, resp.option_D];
  //       currentOption = resp.answer // 'A'
  //       this.setData({
  //         question: `${questionNumber}、` + resp.content,
  //         options: this.data.options.map((el, index) => {
  //           return {
  //             value: index,
  //             label: optionsArray[index]
  //           }
  //         })
  //       })
  //     },
  //     fail: (errno, errMsg) => {
  //       console.log("【查询题目失败回调】", errno, errMsg);
  //     }
  //   })
  // },
  handleNext() {
    if (questionNumber <= this.data.answered) {
      this.getNextQuestion()
    } else if (chooseOption == currentOption) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '答案正确',
        theme: 'success',
        duration: 1000,
        placement: 'middle',
        direction: 'column'
      })
      this.getNextQuestion()
    } else {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '答案错误, 请重新选择',
        theme: 'error',
        duration: 1000,
        placement: 'middle',
        direction: 'column'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: 'https://demo-77568-5-1322007337.sh.run.tcloudbase.com/findQuestion',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        id: questionNumber
      },
      success: res => {
        console.log('【查询题目成功回调】', res.data.data, questionNumber, this.data.answered)
        let resp = res.data.data
        let type = res.data.type
        let optionsArray =
          type == '判断' ? options2 : [resp.option_A, resp.option_B, resp.option_C, resp.option_D]
        currentOption = resp.answer // 'A'
        this.setData({
          question: `${questionNumber}、` + resp.content,
          options: optionsArray.map((el, index) => {
            return {
              value: index,
              label: optionsArray[index]
            }
          })
        })
      },
      fail: (errno, errMsg) => {
        console.log('【查询题目失败回调】', errno, errMsg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    let app = getApp()
    app.globalData.practiceSum = this.data.answered
    app.globalData.studyTime = 30
    // 重置
    questionNumber = 1
    currentOption = undefined
    chooseOption = -1
    console.log('【退出练习页后 全局状态】', app.globalData)
  },

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
