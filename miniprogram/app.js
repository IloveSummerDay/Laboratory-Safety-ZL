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
    isLogin: false,
    userInfo: {}, // 用户信息

    studyTime: 0, // 安全手册学习时长 (分)

    practiceSum: 0, // 练习页答题数

    learnedModule: [], // 已学习模块
    konwLedgeProgress: 0, // 安全手册学习进度(0-100）
    identifierProgress: 0, // 安全标识学习进度(0-100）
    regulationProgress: 0, // 规章制度学习进度(0-100）

    examPass: false // 考试页通过否
  }
})
