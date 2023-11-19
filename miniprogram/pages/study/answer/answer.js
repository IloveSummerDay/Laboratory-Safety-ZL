// pages/study/answer/answer.js
import Toast from 'tdesign-miniprogram/toast/index'
import { convertToOrder, getRanQuestions } from '../../../utils'
let options4 = ['A', 'B', 'C', 'D']
let options2 = ['正确', '错误']
let ranQuestions = [] // 随机题目题号数组
let questionNumberIndex = 0 // 题号索引
let questionNumber = 1 // 题号
let currentOption = undefined // 正确答案 'A'
let chooseOption = -1 // 当前选项0123
const app = getApp()
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
    checked: -1,
    showAnalysis: false,
    myOption: undefined,
    currentOption: undefined,
    analysis: undefined
  },
  handleExit() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  handleOpenDialog(ifAllCompleted = false) {
    let text = ifAllCompleted
      ? `恭喜你完成此次练习, 再接再厉哦！`
      : `已经练习 ${this.data.answered} 题, 再接再厉哦！`
    this.setData({
      answerSituation: text,
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
    if (questionNumber == 30) {
      wx.showLoading({
        title: '记录练习进度中'
      })
      setTimeout(() => {
        wx.hideLoading()
        this.handleOpenDialog(true)
      }, 2000)
      return
    }
    questionNumber += 1
    wx.cloud.callContainer({
      config: {
        env: 'prod-2gchtexr0201dccd'
      },
      path: `/findQuestion?id=${ranQuestions[questionNumber - 1]}`,
      header: {
        'X-WX-SERVICE': 'springboot-07ie',
        'content-type': 'application/json'
      },
      method: 'GET',
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
          }),
          showAnalysis: false
        })
      }
    })
  },
  handleNext() {
    if (chooseOption == currentOption) {
      // 提交答案正确时
      this.getNextQuestion()
    } else {
      // 提交答案错误时
      this.setData({
        showAnalysis: true,
        myOption: chooseOption,
        currentOption: currentOption
        // analysis: analysis
      })
      Toast({
        context: this,
        selector: '#t-toast',
        message: '答案错误, 请参考解析',
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
  async onLoad(options) {
    // 核验工作
    if (!app.globalData.isLogin) {
      this.setData({
        showLoginDialog: true
      })
      return
    }
    /**
     * 取随机数，用于随机生成题目
     * 单选 1-15 / 多选 16-30 / 判断 31-50
     * 按照 10：10：10 取题目
     */
    ranQuestions = getRanQuestions()
    console.log('【此次随机题目题号】', ranQuestions)
    // 调用云托管 请求题目
    const res = await app.call({
      path: `/findQuestion?id=${ranQuestions[questionNumber - 1]}`,
      header: {
        'content-type': 'application/json'
      }
    })
    console.log(res)
    if (res.code == 200) {
      // 查询题目成功回调
      console.log(
        '【查询题目成功回调】',
        '题号 ' + res.data.id,
        '类型 ' + res.data.type,
        '答案 ' + res.data.answer
      )
      let resp = res.data
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
    } else {
      wx.showToast({
        icon: 'error',
        title: '查询题目失败'
      })
      console.log('【查询题目失败】')
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
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
})
