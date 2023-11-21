// app.js\
'use strict'
App({
  async onLaunch() {
    // 使用callContainer前一定要init一下，全局执行一次即可
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-9gesq8mi1d4ae3de',
        traceUser: true
      })
    }
    // 加载全局字体临时路径
    wx.cloud.getTempFileURL({
      fileList: [
        'cloud://cloud1-9gesq8mi1d4ae3de.636c-cloud1-9gesq8mi1d4ae3de-1314621544/字体woff2/黑体 regular.woff'
      ],
      success: res => {
        let url = res.fileList[0].tempFileURL
        wx.loadFontFace({
          global: true,
          family: '黑体 normal', // 自定义字体名
          source: 'url("' + url + '")',
          desc: {
            style: 'normal',
            weight: 'normal',
            variant: 'normal'
          }
        })
      },
      fail: console.error
    })
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // wx.getSetting({
    //   withSubscriptions: true,
    //   success(res) {
    //     if (!res.authSetting['scope.userInfo']) {
    //       wx.authorize({
    //         scope: 'scope.userInfo'
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    id: '',
    password: '',
    isLogin: false,
    learn_time: undefined,
    number: undefined,
    score1: undefined,
    score2: undefined,
    dianqi: false,
    feiwu: false,
    xiaofang: false,
    jiuyuan: false,
    yanlian: false,
    rule1: false,
    rule2: false,
    rule3: false,
    rule4: false,
    rule5: false,
    safeSign: false,
    grade: '',
    name: '',
    nickName: undefined,
    // ----------------------------- //
    userInfo: {}, // 用户信息
    studyTime: 0, // 安全手册学习时长 (分)
    practiceSum: 0, // 练习页答题数
    learnedModule: [], // 已学习模块
    konwLedgeProgress: 0, // 安全手册学习进度(0-100）
    identifierProgress: 0, // 安全标识学习进度(0-100）
    regulationProgress: 0, // 规章制度学习进度(0-100）
    examPass: false // 考试页通过否
  },
  async call(obj, number = 0) {
    const that = this
    if (that.cloud == null) {
      that.cloud = new wx.cloud.Cloud({
        resourceAppid: 'wx15ef99992bca301c', // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
        resourceEnv: 'prod-2gchtexr0201dccd' // 微信云托管的环境ID
      })
      await that.cloud.init() // init过程是异步的，需要等待init完成才可以发起调用
    }
    try {
      const result = await that.cloud.callContainer({
        path: obj.path, // 填入业务自定义路径和参数，根目录，就是 /
        method: obj.method || 'GET', // 按照自己的业务开发，选择对应的方法
        // dataType:'text', // 如果返回的不是json格式，需要添加此项
        header: {
          'X-WX-SERVICE': 'springboot-07ie', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
          // 其他header参数
          ...obj.header
        },
        data: obj.data,
        // 其余参数同 wx.request
      })
      console.log(`微信云托管调用结果${result.errMsg} | callid:${result.callID}`)
      return result.data // 业务数据在data中
    } catch (e) {
      const error = e.toString()
      // 如果错误信息为未初始化，则等待300ms再次尝试，因为init过程是异步的
      if (error.indexOf("Cloud API isn't enabled") != -1 && number < 3) {
        return new Promise(resolve => {
          setTimeout(function () {
            resolve(that.call(obj, number + 1))
          }, 300)
        })
      } else {
        throw new Error(`微信云托管调用失败${error}`)
      }
    }
  }
})
