// pages/danger-report/index.js
let cameraCtx = undefined
Page({
  data: {
    showLoginDialog: false,
    cameraSide: 'back'
  },
  takePhoto() {
    //调用Camera拍照
    cameraCtx.takePhoto({
      qulaty: 'high',
      success: res => {
        //拍照成功压缩图片
        wx.compressImage({
          src: res.tempImagePath,
          quality: 80,
          success: res => {
            this.setData({
              tempPicVisible: true,
              tempPicPath: res.tempFilePath
            })
            wx.showLoading({
              title: '上传中',
              mask: true
            })
            // 执行隐患图片上传函数
            this.handleUploadDangerImg()
          }
        })
      }
    })
  },
  /**
   * @desc 调用接口 上传隐患图片
   */
  handleUploadDangerImg() {
    // ...
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '上传成功'
      })
    }, 2000)
  },
  switchSide() {
    let cameraSide
    if (this.data.cameraSide === 'back') cameraSide = 'front'
    else cameraSide = 'back'
    this.setData({ cameraSide })
  },
  /**
   * @desc 转换图片格式 Base64
   */
  toBase64() {
    try {
      const base64 = wx.getFileSystemManager().readFileSync(tempPicPath, 'base64')
      return base64
    } catch (e) {
      console.log('toBase64 Error: ', e)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   * @desc 获取相机授权
   */
  onLoad: function (options) {
    let app = getApp()
    if (!app.globalData.isLogin) {
      this.setData({
        showLoginDialog: true
      })
    } else {
      wx.authorize({
        scope: 'scope.camera'
      })
      cameraCtx = wx.createCameraContext()
    }
  },
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  }
})
