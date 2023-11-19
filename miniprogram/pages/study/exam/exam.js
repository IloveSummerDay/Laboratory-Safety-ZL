// pages/study/exam/exam.js
import { convertToOrder, getRanQuestions } from '../../../utils'
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
let ranExamQuestions = [] // 随机题目题号
let examQuestionsSum = 30 // 考题总数
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
    showExamQualificationsDialog: false,
    showConfirm: false,
    showAnswerSituationDialog: false,
    answerSituation: undefined,
    type: '单选',
    question: undefined,
    examQuestionsSum: undefined,
    answered: 0, // 已答题数
    questionNumber: 1, // 题号
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
    if (e.type == 'confirm') {
      this.handleCalGrades()
      this.handleOpenDialog(false)
    } else {
      this.handleOpenDialog(false)
    }
  },
  /**
   * @desc 计算最终成绩
   */
  async handleCalGrades() {
    // chooseOptionList currentOptionList
    let answered = this.data.answered // 已答题数 == 总题量
    let errorQuestionNumbers = []
    for (let i = 0; i < answered; i++) {
      if (chooseOptionList[i].chooseOption == currentOptionList[i].currentOption) {
        currentSum += 1
      } else {
        errorSum += 1
        errorQuestionNumbers.push({
          question_id: ranExamQuestions[i],
          student_answer: chooseOptionList[i].chooseOption
        }) // 错题题号数组
      }
    }
    this.setData({
      answerSituation: `已答题${answered} 正确${currentSum} 错误${errorSum}`,
      showAnswerSituationDialog: true
    })
    if (errorQuestionNumbers.length > 0)
      this.handleUpExamData(errorQuestionNumbers, Math.ceil((currentSum / answered) * 100))
    console.log(`【交卷成功 ----- 已答题${answered} 正确${currentSum} 错误${errorSum}】`)
  },
  /**
   * @desc 上传错题、上传考试分数
   * @params numbers（错题题号）、score（分数）
   */
  async handleUpExamData(numbers, score) {
    console.log('【错题信息列表 每个元素为错题题号 + 用户所选答案】', numbers)
    let app = getApp()
    let errQuestionsList = []
    for (let i = 0; i < numbers.length; i++) {
      errQuestionsList.push({
        question_id: numbers[i].question_id,
        user_id: app.globalData.id,
        student_answer: numbers[i].student_answer
      })
    }
    // 调用上传错题接口
    const res_wrongAnswer = await app.call({
      method: 'POST',
      path: `/addWrongAnswer`,
      header: {
        'content-type': 'application/json'
      },
      data: errQuestionsList
    })
    const res_finalScore = await app.call({
      method: 'PUT',
      path: `/updateFinalScore?id=${app.globalData.id}&score2=${score}`,
      header: {
        'content-type': 'application/form-data'
      }
    })
    if (res_wrongAnswer.code == 200 && res_finalScore.code == 200) {
      console.log(
        '【调用上传错题接口时携带数据】【错题信息列表 和 考试分数】',
        errQuestionsList,
        score
      )
      console.log(
        '【 调用上传 错题、分数 接口 上传成功】',
        res_wrongAnswer.message,
        res_finalScore.message
      )
    }
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
    this.setData({
      checked: value.detail.value
    })
    console.log('【单选/判断时用户选项】', value.detail.value, chooseOption)
  },
  getOptionIndex(type) {
    let strategy_fromPreToNext = {
      单选: () => {
        return options4.indexOf(chooseOptionList[questionNumber - 1].chooseOption)
      },
      多选: () => {
        // 如果此题用户没有选答案时
        if (!chooseOptionList[questionNumber - 1].chooseOption) {
          this.setData({
            chooseCheckBoxOption: [] // ["C", "D"]
          })
          return [-1, -1, -1, -1]
        }
        console.log(chooseOptionList[questionNumber - 1].chooseOption)
        let ABCD_list = chooseOptionList[questionNumber - 1].chooseOption.split('') // ['A', 'B', 'C']
        this.setData({
          chooseCheckBoxOption: ABCD_list
        })
        let checked = [-1, -1, -1, -1]
        for (let i = 0; i < ABCD_list.length; i++) {
          const option = ABCD_list[i] // 'A'
          checked[options4.indexOf(option)] = options4.indexOf(option)
        }
        console.log('【此题多选 用户所选答案为】', ABCD_list, checked)
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
      console.log('【strategy_fromPreToNext】用户选项索引', strategy_fromPreToNext[type]())
      return strategy_fromPreToNext[type]()
    } else {
      console.log('【strategy_normalNext】用户选项索引', strategy_normalNext[type]())
      return strategy_normalNext[type]()
    }
  },
  /**
   * @desc 与 handleNext() 配合使用
   */
  async getNextQuestion(isGetPre = false) {
    let app = getApp()
    const res = await app.call({
      path: `/findQuestion?id=${ranExamQuestions[questionNumber - 1]}`,
      header: {
        'content-type': 'application/form-data'
      }
    })
    if (res.code == 200) {
      console.log(
        '【查询题目成功回调】',
        res.message,
        res.data.answer,
        res.data.type,
        res.data.type !== '多选'
      )
      let resp = res.data
      let type = resp.type
      let optionsArray =
        type == '判断' ? options2 : [resp.option_A, resp.option_B, resp.option_C, resp.option_D]
      currentOption = resp.answer // 'A'
      let optionsIndex = this.getOptionIndex(type) // 0123（单/判） 或者
      let checkBoxOption =
        chooseOptionList.length >= questionNumber &&
        chooseOptionList[questionNumber - 1].chooseOption
          ? chooseOptionList[questionNumber - 1].chooseOption.split('')
          : []
      console.log('【checkBoxOption】', checkBoxOption)
      // 获取 下 一题后设置状态
      if (!isGetPre) {
        this.setData({ type })
        console.log('【设置题目类型type wx:if】', type)
        wx.nextTick(() => {
          console.log('【设置题目类型type / wx.nextTick / wx:if】', type)
          console.log('——————————————————————————————————————')
          this.setData({
            answered:
              questionNumber - 1 <= this.data.answered
                ? this.data.answered
                : (this.data.answered += 1),
            question: `${questionNumber}、` + resp.content,
            checked: optionsIndex, // 单选/判断时用户选项
            chooseCheckBoxOption: checkBoxOption, // 多选时用户选项
            options: optionsArray.map((el, index) => {
              return {
                value: index,
                label: optionsArray[index]
              }
            })
          })
        })
      }
      // 获取 上 一题后设置状态
      else {
        this.setData({ type })
        console.log('【设置题目类型type wx:if】', type)
        wx.nextTick(() => {
          console.log('【设置题目类型type / wx.nextTick / wx:if】', type)
          console.log('——————————————————————————————————————')
          this.setData({
            question: `${questionNumber}、` + resp.content,
            checked: optionsIndex,
            chooseCheckBoxOption: checkBoxOption,
            options: optionsArray.map((el, index) => {
              return {
                value: index,
                label: optionsArray[index]
              }
            })
          })
        })
      }
    }
  },
  async handlePrev() {
    // 防止从第一题点击 “上一题”
    if (questionNumber - 1 == 0) return
    console.log('【点击上一题按钮时 当前题目的用户所选答案】', chooseOption)
    questionNumber -= 1
    this.getNextQuestion(true)
  },
  handleNext() {
    if (questionNumber <= this.data.answered) {
      // 翻阅做题历史时 点击“下一题”按钮 (可修改答案)
      console.log('——————————————————————————————————————')
      console.log('【翻阅做题历史时 点击“下一题”按钮】')
      if (chooseOption) chooseOptionList[questionNumber - 1].chooseOption = chooseOption
    } else {
      // 正常做题且无论跳过该题（chooseOption是否为undefined）时 点击“下一题”按钮
      console.log('——————————————————————————————————————')
      console.log('【正常做题且无论跳过该题】')
      chooseOptionList.push({
        questionNumber: questionNumber,
        chooseOption
      })
      currentOptionList.push({
        questionNumber,
        currentOption
      })
      chooseOption = undefined // 重置当前题目用户选项
      console.log(
        '【记录完毕 下一题】',
        chooseOptionList,
        currentOptionList,
        '题号 ' + questionNumber
      )
    }
    if (questionNumber == examQuestionsSum) {
      // 已经答完全部题目
      this.handleOpenDialog()
      return
    }
    questionNumber += 1
    this.getNextQuestion()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let app = getApp()
    // 是否登录
    if (!app.globalData.isLogin) {
      this.setData({
        showLoginDialog: true
      })
      return
    }
    // 是否获取考试资格
    if (!(await this.isQualify())) {
      console.log('【检查到用户没有资格时自动返回到上一页并提示信息】')
      this.setData({
        showExamQualificationsDialog: true
      })
      return
    }
    ranExamQuestions = getRanQuestions()
    console.log('【随机考试题目题号】', ranExamQuestions)
    wx.showLoading({
      title: '获取题目中'
    })
    const res = await app.call({
      path: `/findQuestion?id=${ranExamQuestions[questionNumber - 1]}`,
      header: {
        'content-type': 'application/form-data'
      }
    })
    if (res.code == 200) {
      console.log('【查询题目成功回调】', res.message, res.data.answer, res.data.type)
      let resp = res.data
      let type = resp.type
      let optionsArray =
        type == '判断' ? options2 : [resp.option_A, resp.option_B, resp.option_C, resp.option_D]
      currentOption = resp.answer // 'A'
      this.setData({
        examQuestionsSum, // 考题总数
        question: `${questionNumber}、` + resp.content,
        type,
        checked: this.getOptionIndex(type),
        options: optionsArray.map((el, index) => {
          return {
            value: index,
            label: optionsArray[index]
          }
        })
      })
      wx.hideLoading()
    }
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
  async isQualify() {
    //返回True表示有资格
    //返回False表示没有资格
    let app = getApp()
    const res = await app.call({
      path: `/selectExamQualifications?id=${app.globalData.id}`
    })
    if (res.data.indexOf('你暂未获取考试资格') > -1) {
      // 查询到字符串表示 没有资格
      return true // false
    } else {
      return true
    }
  },
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  }
})
