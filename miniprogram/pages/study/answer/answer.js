// pages/study/answer/answer.js
import Toast from 'tdesign-miniprogram/toast/index'
import { convertToOrder } from '../../../utils'
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
    showLoginDialog: false,
    showAnswerSituationDialog: false,
    answerSituation: undefined,
    questionNumber: 1,
    type: '',
    question: undefined,
    answered: 0, // 已答题数
    defaultOption: undefined,
    options: undefined,
    chooseCheckBoxOption: [],
    checked: -1
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
  onChangeCheckbox(value) {
    this.setData({
      chooseCheckBoxOption: value.detail // ["C", "D"]
    })
    // 由于value.detail 顺序不固定 可能为["C", "D"，"B"]这种乱序 需要 convertToOrder规范化为"BCD"
    chooseOption = convertToOrder(value.detail)
    console.log('【多选时用户选项】', value.detail, chooseOption)
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
    wx.cloud.callContainer({
      config: {
        env: 'prod-2gchtexr0201dccd'
      },
      path: `/findQuestion?id=${questionNumber}`,
      header: {
        'X-WX-SERVICE': 'springboot-07ie',
        'content-type': 'application/json'
      },
      method: 'GET',
      data: '\r\n',
      success: res => {
        console.log(
          '【查询题目成功回调】',
          res.data.data.id,
          res.data.data.type,
          res.data.data.answer
        )
        let resp = res.data.data
        let type = resp.type
        let optionsArray =
          type == '判断' ? options2 : [resp.option_A, resp.option_B, resp.option_C, resp.option_D]
        currentOption = resp.answer // 'A'
        this.setData({
          answered:
            questionNumber - 1 <= this.data.answered
              ? this.data.answered
              : (this.data.answered += 1),
          question: `${questionNumber}、` + resp.content,
          checked: type == '多选' ? [-1, -1, -1, -1] : -1,
          chooseCheckBoxOption: [],
          type,
          options: optionsArray.map((el, index) => {
            return {
              value: index,
              label: optionsArray[index]
            }
          })
        })
      }
    })
  },
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
    let app = getApp()
    if (!app.globalData.isLogin) {
      this.setData({
        showLoginDialog: true
      })
      return
    }
    wx.cloud.callContainer({
      config: {
        env: 'prod-2gchtexr0201dccd'
      },
      path: `/findQuestion?id=${questionNumber}`,
      header: {
        'X-WX-SERVICE': 'springboot-07ie',
        'content-type': 'application/json'
      },
      method: 'GET',
      data: '\r\n',
      success: res => {
        console.log(
          '【查询题目成功回调】',
          res.data.data.id,
          res.data.data.type,
          res.data.data.answer
        )
        let resp = res.data.data
        let type = resp.type
        let optionsArray =
          type == '判断' ? options2 : [resp.option_A, resp.option_B, resp.option_C, resp.option_D]
        currentOption = resp.answer // 'A'
        this.setData({
          question: `${questionNumber}、` + resp.content,
          checked: type == '多选' ? [-1, -1, -1, -1] : -1,
          chooseCheckBoxOption: [],
          type,
          options: optionsArray.map((el, index) => {
            return {
              value: index,
              label: optionsArray[index]
            }
          })
        })
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
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  }
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
})
