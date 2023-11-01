// app.js\
"use strict";
App({
  async onLaunch() {
    // 使用callContainer前一定要init一下，全局执行一次即可
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'lab-safe-1-0gg1is7mcdc48642',
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true
      });
    }
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        if (!res.authSetting["scope.userInfo"]) {
          wx.authorize({
            scope: 'scope.userInfo'
          })
        }
      }
    })
  },
  globalData: {
    isLogin: false,
    userInfo: {}, // 用户信息

    studyTime: 0, // 学习时长 (分)
    practiceSum: 0, // 练习页答题数

    learnedModule: [], // 已学习模块
    konwLedgeProgress: 0, // 安全手册学习进度(0-100）
    identifierProgress: 0, // 安全标识学习进度(0-100）
    regulationProgress: 0, // 规章制度学习进度(0-100）

    examPass: false // 考试页通过否
  }
})
