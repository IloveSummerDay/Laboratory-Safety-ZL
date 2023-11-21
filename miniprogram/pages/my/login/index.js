// pages/my/login/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    account: undefined, // string
    password: undefined, // string
    errMessage: '',
    showContentOnly: false
  },
  closeDialog() {
    this.setData({
      showContentOnly: false
    })
  },
  // 账号 215701214  密码 12345678
  async handleLogin() {
    console.log('【账号 密码】', this.data.account, this.data.password)
    wx.showLoading({
      title: '请稍候'
    })
    let app = getApp()
    let res = undefined
    try {
      res = await app.call({
        path: `/login?id=${this.data.account}&password=${this.data.password}`,
        method: 'POST',
        header: {
          'content-type': 'application/form-data'
        }
      })
    } catch (error) {
      console.log(error)
      wx.showToast({
        icon: 'error',
        title: '请尝试重新登录'
      })
      return
    }
    console.log(res)
    // 登录失败
    if (!res) {
      console.log('【登录失败回调】', res, typeof res == 'string')
      wx.hideLoading()
      this.setData({
        errMessage: '用户账号或密码不正确',
        showContentOnly: true
      })
    }
    // 登录成功
    else {
      console.log('【登录成功回调】', res, res[0], typeof res == 'string')
      let data = res[0]
      // 记录用户信息（赋值客户端全局变量）
      app.globalData.isLogin = data.sign
      app.globalData.nickName = data.netName
      for (let prop in data) {
        if (data.hasOwnProperty(prop) && app.globalData.hasOwnProperty(prop)) {
          app.globalData[prop] = data[prop]
          console.log(prop, app.globalData[prop])
        }
      }
      console.log('isLogin', app.globalData.isLogin)
      console.log('netName', app.globalData.nickName)
      // 回退原来页
      wx.hideLoading()
      wx.navigateBack({
        delta: 1
      })
    }
  },
  handleFindPassword() {
    wx.showToast({
      icon: 'error',
      title: '还未开发'
    })
  },
  handleSignUp() {
    wx.navigateTo({
      url: '../sign-up/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  getAccount(e) {
    this.setData({
      account: String(e.detail.value)
    })
  },
  getPassword(e) {
    this.setData({
      password: String(e.detail.value)
    })
  }
})
