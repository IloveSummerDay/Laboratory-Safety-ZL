Page({
  data: {
    userInfo: null
  },

  onLoad() {
    wx.getStorage({ key: 'userInfo' }).then(res => {
      const userInfo = res.data;
      this.setData({ userInfo });
    })
  },

  login() {
    const { avatarUrl, nickName } = this.data.userInfo;
    wx.login({
      success(res) {
        const code = res.code;
        let data = {
          code,
          avatarUrl,
          nickName
        };
        if(code) {
          wx.request({
            url: 'https://labsafety.logosw.top/user/login',
            method: 'POST',
            data,
            success(res) {
              if(res.statusCode === 200) {
                wx.setStorage({
                  key: 'token',
                  data: res.data.token
                });
                wx.showToast({
                  title: '登录成功',
                  icon: 'success',
                  duration: 2000,
                  success() {
                    setTimeout(() => {
                      wx.navigateBack();
                    }, 2000);
                  }
                })
              } else {
                console.log(res.errMsg);
                wx.showToast({
                  title: '登录失败',
                  icon: 'error'
                });
              }
            },
            fail: e => {
              console.log(e);
              wx.showToast({
                title: '请求错误',
                icon: 'error'
              });
            }
          })
        }
      }
    })
  }
})