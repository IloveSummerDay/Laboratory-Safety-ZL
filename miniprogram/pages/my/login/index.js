// pages/my/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: undefined, // string
    password: undefined, // string
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
  // 账号 215701214  密码 123456
  async handleLogin() {
    console.log("【账号 密码】", this.data.account, this.data.password);
    const res = wx.cloud.callContainer({
      config: {
        env: 'prod-2gchtexr0201dccd', // 微信云托管的环境ID
      },
      url: '/login',
      method: 'POST',
      header: {
        'X-WX-SERVICE': 'springboot-07ie',
      },
      data: {
        id: this.data.account, // string
        password: this.data.password // string
      },
    })
    res.then((res) => {
      console.log("【登陆成功回调】", res.data);
      let app = getApp()
      app.globalData.isLogin = true
      // 回退原来页
      wx.showToast({
        title: '登录成功',
      })
      wx.navigateBack({
        delta: 1
      })
    }, rej => {
      wx.showToast({
        title: '登录失败，请重试',
      })
      console.log("【登陆失败回调】", res.data);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

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