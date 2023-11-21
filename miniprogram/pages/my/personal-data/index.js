// pages/my/personal-data/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    nickName: '',
    stu_id: '',
    grade: '',
    password: ''
  },
  handleExit() {
    const app = getApp()
    for (let key in app.globalData) {
      app.globalData[key] = undefined
    }
    wx.showLoading({
      title: '正在退出'
    })
    let exitTimer = setTimeout(() => {
      wx.hideLoading()
      wx.reLaunch({
        url: '../index/my'
      })
      clearTimeout(exitTimer)
    }, 1500)
    console.log('【！！！退出该账号登录！！！】')
  },
  async handleSave() {
    wx.showLoading({
      title: '保存中'
    })
    const app = getApp()
    app.globalData.nickName = this.data.nickName
    // app.globalData.password = this.data.password
    let res = undefined
    try {
      res = await app.call({
        path: `/updateUser?id=${app.globalData.id}&password=${app.globalData.password}&netName=${this.data.nickName}`,
        method: 'PUT',
        header: {
          'content-type': 'application/json;charset=utf-8'
        }
      })
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        icon: 'error',
        title: '网络不佳请重试'
      })
    }
    wx.hideLoading()
    console.log('【调用接口 更新个人资料】', res)
    if (res.code == 200) {
      wx.showToast({
        title: '保存成功'
      })
    } else {
      wx.showToast({
        icon: 'error',
        title: '保存失败请重试'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 请求全局数据 显示保存的用户个人资料
    const app = getApp()
    console.log(app.globalData.nickName, app.globalData.grade)
    this.setData({
      name: app.globalData.name,
      nickName: app.globalData.nickName ? app.globalData.nickName : '',
      stu_id: app.globalData.id,
      grade: app.globalData.grade ? app.globalData.grade : ''
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getNickName(e) {
    this.setData({
      nickName: e.detail.value
    })
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
