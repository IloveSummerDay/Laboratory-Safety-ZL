// pages/study/exam/exam.js
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
    showConfirm: false,
    showAnswerSituationDialog: false,
    answerSituation: undefined,
    type: '单选',
    question: undefined,
    answered: 0, // 已答题数
    checked: -1, // 单选按钮是否选中（可控）
    options: undefined,
  },
  handleExit() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  handleTimeEndSubmit() {
    console.log("【时间耗尽 提交答卷】", );
    this.handleExit()
  },
  handleOpenDialog(bool = true) {
    this.setData({
      showConfirm: bool
    })
  },
  onCloseDialog(e) {
    console.log();
    if (e.type == "confirm") {
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
      if (chooseOptionList[i].chooseOption == currentOptionList[i].currentOption)
        currentSum += 1
      else
        errorSum += 1
    }
    this.setData({
      answerSituation: `已答题${answered} 正确${currentSum} 错误${errorSum}`,
      showAnswerSituationDialog: true
    })
    // console.log(`【交卷 已答题${answered} 正确${currentSum} 错误${errorSum}】`);
  },
  onChangeRadio(value) {
    if (this.data.type == '单选') {
      chooseOption = options4[value.detail.value]
    } else if (this.data.type == '多选') {
      chooseOption = options2[value.detail.value]
    } else if (this.data.type == '判断') {
      chooseOption = options2[value.detail.value]
    }
    // console.log("【选项号0123】", value.detail.value, chooseOption);
  },
  getOptionIndex() {
    let strategy = {
      '单选': () => {
        return options4.indexOf(chooseOptionList[questionNumber - 1].chooseOption)
      },
      '多选': () => {
        return -1
      },
      '判断': () => {
        return options2.indexOf(chooseOptionList[questionNumber - 1].chooseOption)
      }
    }
    return strategy[this.data.type]()
  },
  /**
   * @desc 与 handleNext() 配合使用
   */
  getNextQuestion() {
    questionNumber += 1
    wx.request({
      url: "https://demo-77568-5-1322007337.sh.run.tcloudbase.com/findQuestion",
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        id: questionNumber,
      },
      success: (res) => {
        // console.log("【查询题目成功回调】", res.data.data);
        let resp = res.data.data
        let type = res.data.data.type
        let optionsArray = type == '判断' ? options2 : [resp.option_A, resp.option_B, resp.option_C, resp.option_D];
        currentOption = resp.answer // 'A'
        this.setData({
          answered: questionNumber - 1 <= this.data.answered ? this.data.answered : this.data.answered += 1,
          question: `${questionNumber}、` + resp.content,
          checked: questionNumber <= this.data.answered ? this.getOptionIndex() : -1,
          options: optionsArray.map((el, index) => {
            return {
              value: index,
              label: optionsArray[index]
            }
          })
        })
      },
      fail: (errno, errMsg) => {
        console.log("【查询题目失败回调】", errno, errMsg);
      }
    })
  },
  handlePrev() {
    if (questionNumber - 1 == 0) return
    questionNumber -= 1
    wx.request({
      url: "https://demo-77568-5-1322007337.sh.run.tcloudbase.com/findQuestion",
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        id: questionNumber,
      },
      success: (res) => {
        // console.log("【查询题目成功回调】", res.data.data);
        let resp = res.data.data
        let type = res.data.type
        let optionsArray = type == '判断' ? options2 : [resp.option_A, resp.option_B, resp.option_C, resp.option_D];
        currentOption = resp.answer // 'A'
        this.setData({
          question: `${questionNumber}、` + resp.content,
          checked: this.getOptionIndex(),
          options: optionsArray.map((el, index) => {
            return {
              value: index,
              label: optionsArray[index]
            }
          })
        })
      },
      fail: (errno, errMsg) => {
        console.log("【查询题目失败回调】", errno, errMsg);
      }
    })
  },
  handleNext() {
    if (questionNumber <= this.data.answered) {
      // 翻阅做题历史时 点击“下一题”按钮
      if (chooseOption)
        chooseOptionList[questionNumber - 1].chooseOption = chooseOption
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
      console.log("【记录完毕 下一题】", chooseOptionList, currentOptionList);
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // const res = new wx.cloud.Cloud({
    //   resourceAppid: 'wxa59f8852443b0924', // 环境所属的账号appid
    //   resourceEnv: 'prod-4gkgem8ab7dc02a6', // 微信云托管的环境ID
    // })
    // await res.init()
    // res = wx.cloud.callContainer({
    //   config: {
    //     env: 'prod-4gkgem8ab7dc02a6', // 微信云托管的环境ID
    //   },
    //   // https://demo-77568-5-1322007337.sh.run.tcloudbase.com
    //   url: '/findQuestion',
    //   method: 'GET',
    //   header: {
    //     'X-WX-SERVICE': 'demo',
    //     'content-type': 'application/json'
    //   },
    //   data: {
    //     id: questionNumber,
    //   },
    // })
    // res.then((res) => {
    //   console.log("【查询题目成功回调】", res.data.data, currentSum);
    //   let resp = res.data.data
    //   let type = res.data.type
    //   let optionsArray = type == '判断' ? options2 : [resp.option_A, resp.option_B, resp.option_C, resp.option_D];
    //   currentOption = resp.answer // 'A'
    //   currentOptionList.push({
    //     questionNumber,
    //     currentOption: currentOption
    //   })
    //   this.setData({
    //     question: `${questionNumber}、` + resp.content,
    //     options: optionsArray.map((el, index) => {
    //       return {
    //         value: index,
    //         label: optionsArray[index]
    //       }
    //     })
    //   })
    // }, err => {
    //   console.log("【获取题目失败回调】", err);
    // })
    wx.request({
      url: "https://demo-77568-5-1322007337.sh.run.tcloudbase.com/findQuestion",
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        id: questionNumber,
      },
      success: (res) => {
        console.log("【查询题目成功回调】", res.data.data, currentSum);
        let resp = res.data.data
        let type = res.data.type
        let optionsArray = type == '判断' ? options2 : [resp.option_A, resp.option_B, resp.option_C, resp.option_D];
        currentOption = resp.answer // 'A'
        currentOptionList.push({
          questionNumber,
          currentOption: currentOption
        })
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
        console.log("【查询题目失败回调】", errno, errMsg);
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    let app = getApp()
    app.globalData.examPass = (this.data.answered == 50)
    console.log("【退出考试页后 全局状态】", app.globalData)
    // 重置
    chooseOptionList = []
    currentOptionList = []
    questionNumber = 1 // 题号
    currentOption = undefined // 当前题目正确答案 'A'
    chooseOption = undefined // 当前题目用户选项0123
    currentSum = 0 // 当前题目用户选项0123
    errorSum = 0 // 当前题目用户选项0123

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})