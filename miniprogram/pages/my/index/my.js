// pages/my/a_my/my.js
let app = undefined
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    avatarUrl:
      'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
    nickName: ''
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    app.globalData.userInfo.avatarUrl = avatarUrl
    this.setData({
      avatarUrl
    })
  },
  onChooseNickName(e) {
    let { value } = e.detail
    app.globalData.userInfo.nickName = value
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('【个人中心页显示】')
    app = getApp()
    this.setData({
      isLogin: app.globalData.isLogin,
      nickName: app.globalData.nickName ? app.globalData.nickName : ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {},
  handleToPersonalData() {
    wx.navigateTo({
      url: '../personal-data/index'
    })
  },
  toLogin(e) {
    wx.getUserProfile({
      desc: '用于登录本小程序',
      success(res) {
        const { userInfo } = res
        wx.setStorage({
          key: 'userInfo',
          data: userInfo
        })
          .then(() => {
            wx.navigateTo({
              url: '../k_login/login'
            })
          })
          .catch(e => console.log(e))
      },
      fail(e) {
        console.log(e)
      }
    })
  }
})
