// pages/my/login/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    account: undefined, // string
    password: undefined, // string
    errMessage: '密码或用户不正确',
    showContentOnly: false
  },
  closeDialog() {
    this.setData({
      showContentOnly: false
    })
  },
  getAccount(e) {
    this.setData({
      account: String(e.detail.value)
    })
  },
  getPassword(e) {
    this.setData({
      password: String(e.detail.value)
    })
  },
  // 账号 215701214  密码 12345678
  async handleLogin() {
    console.log('【账号 密码】', this.data.account, this.data.password)
    wx.showLoading({
      title: '请稍候'
    })
    let app = getApp()
    const res = await app.call({
      path: `/login?id=${this.data.account}&password=${this.data.password}`,
      method: 'POST',
      header: {
        'content-type': 'application/form-data'
      }
    })
    // 登录失败
    if (typeof res.data == 'string') {
      console.log('【登录失败回调】', res, typeof res == 'string')
      wx.hideLoading()
      this.setData({
        errMessage: res.data,
        showContentOnly: true
      })
    }
    // 登录成功
    else {
      console.log('【登录成功回调】', res[0], typeof res == 'string')
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
      // 回退原来页
      wx.hideLoading()
      wx.showToast({
        title: '登录成功'
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
  handleFindPassword() {
    wx.showToast({
      title: '还未开发'
    })
    // wx.navigateTo({
    //   url: 'url'
    // })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})
