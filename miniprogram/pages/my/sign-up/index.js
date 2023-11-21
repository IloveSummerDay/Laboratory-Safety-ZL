// pages/my/sign-up/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: undefined,
    nickName: undefined,
    xuehao: undefined,
    grade: undefined,
    password: undefined,
    checkName: true,
    checkId: true
  },
  toLogin() {
    wx.navigateBack()
  },
  async handleSignUp() {
    console.log(
      this.data.name,
      this.data.nickName,
      this.data.xuehao,
      this.data.grade,
      this.data.password
    )
    if (
      !(
        this.data.name &&
        this.data.password &&
        this.data.xuehao &&
        this.data.nickName &&
        this.data.grade
      )
    ) {
      wx.showToast({
        icon: 'error',
        title: '注册信息不完善'
      })
      return
    }
    let app = getApp()
    // 拿到注册信息
    wx.showLoading({
      title: '注册中'
    })
    let data = {
      name: this.data.name,
      netName: this.data.nickName,
      id: this.data.xuehao,
      grade: this.data.grade,
      password: this.data.password
    }
    let res = undefined
    try {
      res = await app.call({
        path: `/addUser`,
        method: 'POST',
        header: {
          'content-type': 'application/json;charset=utf-8'
        },
        data
      })
    } catch (error) {
      wx.hideLoading()
      wx.showModal({
        title: '网络不佳',
        content: '在注册过程中，发生网络波动，请重新点击注册按钮进行注册0.0'
      })
      return
    }
    console.log(res)
    if (res.code == 200) {
      let timer = setTimeout(() => {
        wx.hideLoading()
        wx.showModal({
          title: '注册成功',
          content: '请返回至登录页进行登录',
          complete: res => {
            if (res.confirm) {
              wx.navigateBack()
            }
          }
        })
        clearTimeout(timer)
      }, 2000)
    } else {
      wx.hideLoading()
      wx.showModal({
        title: '注册用户已存在或注册过程中发生错误'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  // -------------------------------------- //
  getName(e) {
    if (!/^[\u4e00-\u9fa5]{2,5}$/.test(e.detail.value)) {
      this.setData({
        checkName: false,
        name: e.detail.value
      })
    } else
      this.setData({
        checkName: true,
        name: e.detail.value
      })
  },
  getNickName(e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  getXueHao(e) {
    if (!/^(20|21|22|23)\d{7}$/.test(e.detail.value)) {
      this.setData({
        checkId: false,
        xuehao: e.detail.value
      })
    } else {
      this.setData({
        checkId: true,
        xuehao: e.detail.value
      })
    }
  },
  getGrade(e) {
    this.setData({
      grade: e.detail.value
    })
  },
  getPassword(e) {
    this.setData({
      password: e.detail.value
    })
  }
})
