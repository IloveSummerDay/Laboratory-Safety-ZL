// components/jump/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    url: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'navigateTo'
    },
    delta: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    route: function () {
      this.jump()
    },
    jump: function () {
      let token = wx.getStorageSync('token')
      let url = this.data.url
      let type = this.data.type
      //url是否跳转的tabbar页面，可以自行书写判断代码，如果是type = 'switchTab';否则就自行传递type的值为switchTab;
      //type类型有navigateTo（默认）、redirectTo、switchTab、reLaunch、navigateBack
      //delta参数只有后退才用得着，后台层数。
      var n_url_index = url.lastIndexOf('?')
      var n_url = url.substring(0, n_url_index)
      //登录权限验证
      if (!noLoginPath.includes(n_url) && !token) {
        //跳转登陆页
        wx.navigateTo({
          url: '/pages/user/login'
        })
        return
      }
      if (type == 'navigateTo') {
        wx.navigateTo({
          url: url
        })
      } else if (type == 'redirectTo') {
        wx.redirectTo({
          url: url
        })
      } else if (type == 'switchTab') {
        wx.switchTab({
          url: url
        })
      } else if (type == 'reLaunch') {
        wx.reLaunch({
          url: url
        })
      } else if (type == 'navigateBack') {
        wx.navigateBack({
          delta: this.data.delta
        })
      }
    }
  }
})
