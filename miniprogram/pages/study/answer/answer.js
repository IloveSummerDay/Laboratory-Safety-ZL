// pages/study/answer/answer.js
import Toast from 'tdesign-miniprogram/toast/index'
import { convertToOrder, getRanQuestions } from '../../../utils'
let options4 = ['A', 'B', 'C', 'D']
let options2 = ['正确', '错误']
let ranQuestions = [] // 随机题目题号数组
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
    analysis: ''
  },
  handleExit() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  /**
   * @desc 点击 “退出” 按钮，打开练习情况对话框
   */
  async handleOpenDialog(e, ifAllCompleted = false) {
    console.log('【用户是否完成全部培训】', ifAllCompleted)
    let app = getApp()
    let res = undefined
    wx.showLoading({
      title: '记录练习题量'
    })
    try {
      res = await app.call({
        path: `/addNumber?id=${app.globalData.id}&number=${this.data.answered}`,
        method: 'PUT',
        header: {
          'content-type': 'application/form-data'
        }
      })
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误请重试'
      })
      return
    }
    wx.hideLoading()
    if (res.code == 200) {
      let text = ifAllCompleted
        ? `恭喜你完成此次练习, 再接再厉哦！`
        : `已经练习 ${this.data.answered} 题, 再接再厉哦！`
      this.setData({
        answerSituation: text,
        showAnswerSituationDialog: true
      })
      console.log('【练习量增加成功】')
    } else {
      wx.showToast({
        title: '记录失败请重试'
      })
      console.log('【练习量增加失败】')
    }
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
      this.setData({
        answered: 30
      })
      wx.showLoading({
        title: '记录练习进度中'
      })
      setTimeout(() => {
        wx.hideLoading()
        this.handleOpenDialog(undefined, true)
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
          res.data.data.answer,
          res.data.data.analysis
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
          analysis: res.data.data.analysis ? res.data.data.analysis : '此题没有解析',
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
    let res = undefined
    ranQuestions = getRanQuestions()
    console.log('【此次随机题目题号】', ranQuestions)

    // 调用云托管 请求题目
    try {
      res = await app.call({
        path: `/findQuestion?id=${ranQuestions[questionNumber - 1]}`,
        header: {
          'content-type': 'application/json'
        }
      })
    } catch (error) {
      wx.showModal({
        title: '网络不佳',
        content: '请尝试重新进入练习',
        complete: res => {
          if (res.confirm) {
            wx.switchTab({
              url: '../index/index'
            })
          }
        }
      })
      return
    }
    console.log(res)
    if (res.code == 200) {
      // 查询题目成功回调
      console.log(
        '【查询题目成功回调】',
        '题号 ' + res.data.id,
        '类型 ' + res.data.type,
        '答案 ' + res.data.answer,
        '解析 ' + res.data.analysis
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
        analysis: res.data.analysis ? res.data.analysis : '此题没有解析',
        options: optionsArray.map((el, index) => {
          return {
            value: index,
            label: optionsArray[index]
          }
        })
      })
    } else {
      wx.showModal({
        title: '网络不佳',
        content: '查询题目失败，请尝试重新进入练习',
        complete: res => {
          if (res.confirm) {
            wx.switchTab({
              url: '../index/index'
            })
          }
        }
      })
      console.log('【查询题目失败】')
      return
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
