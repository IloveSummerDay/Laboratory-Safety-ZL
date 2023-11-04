// pages/my/login/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    account: undefined, // string
    password: undefined // string
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
    console.log('【账号 密码】', this.data.account, this.data.password)
    wx.cloud.callContainer({
      config: {
        env: 'prod-2gchtexr0201dccd' // 微信云托管的环境ID
      },
      path: `/login?id=${this.data.account}&password=${this.data.password}`,
      method: 'POST',
      header: {
        'X-WX-SERVICE': 'springboot-07ie',
        'content-type': 'application/form-data'
      },
      success: res => {
        console.log('【登陆成功回调】', res.data)
        let app = getApp()
        app.globalData.isLogin = true
        // 回退原来页
        wx.showToast({
          title: '登录成功'
        })
        wx.navigateBack({
          delta: 1
        })
      }
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
