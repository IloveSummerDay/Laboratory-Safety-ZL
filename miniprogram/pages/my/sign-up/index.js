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
    password: undefined
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
    let app = getApp()
    // 拿到注册信息
    // wx.showLoading({
    //   title: '注册中',
    // })
    // const res = await app.call({
    //   path: '/addUser',
    //   method: 'POST',
    // })
    // if (res.code == 200) {
    // setTimeout(() => {
    //   wx.hideLoading()
    //   wx.showModal({
    //   title: '注册成功',
    //   content: '请返回至登录页进行登录',
    //   complete: (res) => {
    //     if (res.cancel) {

    //     }

    //     if (res.confirm) {

    //     }
    //   }
    // })
    // }, 2000)
    // }else{
    // wx.showToast({
    //   title: '注册失败',
    // })
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  // -------------------------------------- //
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
  getXueHao(e) {
    this.setData({
      xuehao: e.detail.value
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
