// pages/study/exam/exam.js
import { convertToOrder } from '../../../utils'
let options4 = ['A', 'B', 'C', 'D']
let options2 = ['正确', '错误']
/**
 * @desc 记录每道题 用户选的答案 用于最后和正确答案比对 得到正确率
 * @key { questionNumber, chooseOption }
 */
let chooseOptionList = []
/**
 * @desc 记录每道题的正确答案
 * @key { questionNumber, currentOption }
 */
let currentOptionList = []
let questionNumber = 1 // 题号
let currentOption = undefined // 当前题目正确答案 'A'
let chooseOption = undefined // 当前题目用户选项0123
let currentSum = 0 // 当前题目用户选项0123
let errorSum = 0 // 当前题目用户选项0123
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoginDialog: false,
    showConfirm: false,
    showAnswerSituationDialog: false,
    answerSituation: undefined,
    type: '单选',
    question: undefined,
    answered: 0, // 已答题数
    checked: -1, // 单选按钮是否选中（可控）
    options: undefined,
    chooseCheckBoxOption: []
  },
  /**
   * @desc 考试结束时调用的API如下
   */
  handleExit() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  handleTimeEndSubmit() {
    console.log('【时间耗尽 提交答卷】')
    this.handleExit()
  },
  handleOpenDialog(bool = true) {
    this.setData({
      showConfirm: bool
    })
  },
  onCloseDialog(e) {
    console.log()
    if (e.type == 'confirm') {
      this.handleOpenDialog(false)
      this.handleCalGrades()
    } else {
      this.handleOpenDialog(false)
    }
  },
  handleCalGrades() {
    // chooseOptionList currentOptionList
    let answered = this.data.answered // 已答题数
    for (let i = 0; i < answered; i++) {
      if (chooseOptionList[i].chooseOption == currentOptionList[i].currentOption) currentSum += 1
      else errorSum += 1
    }
    this.setData({
      answerSituation: `已答题${answered} 正确${currentSum} 错误${errorSum}`,
      showAnswerSituationDialog: true
    })
    // console.log(`【交卷 已答题${answered} 正确${currentSum} 错误${errorSum}】`);
  },
  /**
   * @desc 考试进行时调用的API如下
   */
  onChangeCheckbox(value) {
    this.setData({
      chooseCheckBoxOption: value.detail // ["C", "D"]
    })
    // 由于value.detail 顺序不固定 可能为["C", "D"，"B"]这种乱序 需要 convertToOrder规范化为"BCD"
    chooseOption = convertToOrder(value.detail)
    console.log('【多选时用户选项】', value.detail, chooseOption)
  },
  onChangeRadio(value) {
    if (this.data.type == '单选') {
      chooseOption = options4[value.detail.value]
    } else if (this.data.type == '判断') {
      chooseOption = options2[value.detail.value]
    }
    console.log('【单选/判断时用户选项】', value.detail.value, chooseOption)
  },
  getOptionIndex(type) {
    let strategy_fromPreToNext = {
      单选: () => {
        return options4.indexOf(chooseOptionList[questionNumber - 1].chooseOption)
      },
      多选: () => {
        if (chooseOptionList[questionNumber - 1].chooseOption == '') {
          this.setData({
            chooseCheckBoxOption: [] // ["C", "D"]
          })
          return [-1, -1, -1, -1]
        }
        let ABCD_list = chooseOptionList[questionNumber - 1].chooseOption.split('') // ['A', 'B', 'C']
        this.setData({
          chooseCheckBoxOption: ABCD_list
        })
        let checked = [-1, -1, -1, -1]
        for (let i = 0; i < ABCD_list.length; i++) {
          const option = ABCD_list[i] // 'A'
          checked[options4.indexOf(option)] = options4.indexOf(option)
        }
        console.log(ABCD_list, checked)
        return checked // 选中选项的数组 [0,1,2] => ABC
      },
      判断: () => {
        return options2.indexOf(chooseOptionList[questionNumber - 1].chooseOption)
      }
    }
    let strategy_normalNext = {
      单选: () => {
        return -1
      },
      多选: () => {
        return [-1, -1, -1, -1]
      },
      判断: () => {
        return -1
      }
    }
    if (questionNumber <= this.data.answered) {
      console.log('【strategy_fromPreToNext】', strategy_fromPreToNext[type]())
      return strategy_fromPreToNext[type]()
    } else {
      console.log('【strategy_normalNext】', strategy_normalNext[type]())
      return strategy_normalNext[type]()
    }
  },
  /**
   * @desc 与 handleNext() 配合使用
   */
  getNextQuestion() {
    questionNumber += 1
    wx.cloud.callContainer({
      config: {
        env: 'prod-2gchtexr0201dccd' // 微信云托管的环境ID
      },
      path: `/findQuestion?id=${questionNumber}`,
      method: 'GET',
      header: {
        'X-WX-SERVICE': 'springboot-07ie',
        'content-type': 'application/json'
      },
      data: '\r\n',
      success: res => {
        console.log('【查询题目成功回调】', res.data.data.id, res.data.data.type)
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
          // checked: questionNumber <= this.data.answered ? this.getOptionIndex(type) : -1,
          checked: this.getOptionIndex(type),
          chooseCheckBoxOption: [],
          type: type,
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
  handlePrev() {
    if (questionNumber - 1 == 0) return
    questionNumber -= 1
    wx.cloud.callContainer({
      config: {
        env: 'prod-2gchtexr0201dccd' // 微信云托管的环境ID
      },
      path: `/findQuestion?id=${questionNumber}`,
      method: 'GET',
      header: {
        'X-WX-SERVICE': 'springboot-07ie',
        'content-type': 'application/json'
      },
      data: '\r\n',
      success: res => {
        // console.log("【查询题目成功回调】", res.data.data);
        let resp = res.data.data
        let type = resp.type
        let optionsArray =
          type == '判断' ? options2 : [resp.option_A, resp.option_B, resp.option_C, resp.option_D]
        currentOption = resp.answer // 'A'
        this.setData({
          question: `${questionNumber}、` + resp.content,
          checked: this.getOptionIndex(type),
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
      // 翻阅做题历史时 点击“下一题”按钮
      // 可修改答案
      if (chooseOption) chooseOptionList[questionNumber - 1].chooseOption = chooseOption
      this.getNextQuestion()
    } else {
      // 正常做题且无论跳过该题（chooseOption是否为undefined）时 点击“下一题”按钮
      chooseOptionList.push({
        questionNumber: questionNumber,
        chooseOption
      })
      this.getNextQuestion()
      currentOptionList.push({
        questionNumber,
        currentOption
      })
      chooseOption = undefined // 重置当前题目用户选项
      console.log('【记录完毕 下一题】', chooseOptionList, currentOptionList)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let app = getApp()
    if (!app.globalData.isLogin) {
      this.setData({
        showLoginDialog: true
      })
      return
    }
    wx.cloud.callContainer({
      config: {
        env: 'prod-2gchtexr0201dccd' // 微信云托管的环境ID
      },
      path: `/findQuestion?id=${questionNumber}`,
      method: 'GET',
      header: {
        'X-WX-SERVICE': 'springboot-07ie',
        'content-type': 'application/json'
      },
      data: '\r\n',
      success: res => {
        console.log('【查询题目成功回调】', res, res.data.data, currentSum)
        let resp = res.data.data
        let type = resp.type
        let optionsArray =
          type == '判断' ? options2 : [resp.option_A, resp.option_B, resp.option_C, resp.option_D]
        currentOption = resp.answer // 'A'
        currentOptionList.push({
          questionNumber,
          currentOption: currentOption
        })
        this.setData({
          question: `${questionNumber}、` + resp.content,
          type,
          checked: type == '多选' ? [-1, -1, -1, -1] : -1,
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
    app.globalData.examPass = this.data.answered == 50
    console.log('【退出考试页后 全局状态】', app.globalData)
    // 重置
    chooseOptionList = []
    currentOptionList = []
    questionNumber = 1 // 题号
    currentOption = undefined // 当前题目正确答案 'A'
    chooseOption = undefined // 当前题目用户选项0123
    currentSum = 0 // 当前题目用户选项0123
    errorSum = 0 // 当前题目用户选项0123
  },
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  }
})
