// pages/danger-report/index.js
let cameraCtx = undefined
Page({
  data: {
    showLoginDialog: false,
    showUploadImgDialog: false,
    cameraSide: 'back',
    tempPicVisible: false,
    tempPicPath: undefined,
    dangerDesc: ''
  },
  takePhoto() {
    wx.showLoading({
      title: '拍照中',
      mask: true
    })
    // 1、调用Camera拍照
    cameraCtx.takePhoto({
      qulaty: 'high',
      success: res => {
        wx.hideLoading()
        wx.showLoading({
          title: '压缩图片上传中',
          mask: true
        })
        // 2、拍照成功压缩图片
        wx.compressImage({
          src: res.tempImagePath,
          quality: 80,
          success: res => {
            wx.hideLoading()
            this.setData({
              tempPicVisible: true,
              tempPicPath: res.tempFilePath,
              showUploadImgDialog: true
            })
            console.log('【图片临时路径】', this.data.tempPicPath, wx.env.USER_DATA_PATH)
          },
          fail: err => {
            wx.hideLoading()
            wx.showToast({
              icon: 'error',
              title: '压缩图片失败'
            })
            console.log('【错误！！！ ----- 压缩图片失败】', err)
          }
        })
        // 2、拍照成功压缩图片
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          icon: 'error',
          title: '拍照失败请重试'
        })
        console.log('【错误！！！ ----- 拍照失败】', err)
      }
    })
    // 1、调用Camera拍照
  },
  /**
   * @desc 调用接口 上传隐患图片
   */
  handleUploadDangerImg() {
    const app = getApp()
    let dangerDesc = this.data.dangerDesc
    this.setData({
      showUploadImgDialog: false
    })
    // api
    wx.showLoading({
      title: '上传中'
    })
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '上传成功'
      })
      this.setData({
        tempPicPath: undefined,
        tempPicVisible: false,
        dangerDesc: ''
      })
      console.log(this.data.dangerDesc)
    }, 1500)
  },
  getDangerDesc(e) {
    this.setData({
      dangerDesc: e.detail.value
    })
  },
  closeDialog() {
    this.setData({
      showUploadImgDialog: false,
      tempPicVisible: false,
      tempPicPath: undefined,
      dangerDesc: ''
    })
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
  /**
   * @desc 转换图片格式 Base64
   */
  toBase64() {
    try {
      const base64 = wx.getFileSystemManager().readFileSync(this.data.tempPicPath, 'base64')
      return base64
    } catch (e) {
      console.log('toBase64 Error: ', e)
    }
  },
  switchSide() {
    let cameraSide
    if (this.data.cameraSide === 'back') cameraSide = 'front'
    else cameraSide = 'back'
    this.setData({ cameraSide })
  },
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  },
  fromAlbum() {
    // 1、选择照片
    wx.chooseMedia({
      count: 1,
      mediaType: 'image',
      sourceType: 'album',
      success: res => {
        let tempPicPath = res.tempFiles[0].tempFilePath
        console.log(
          '【所选照片的临时路径、大小】',
          tempPicPath,
          res.tempFiles[0].size,
          this.data.dangerDesc
        )
        this.setData({
          // tempPicVisible: true,
          tempPicPath: tempPicPath,
          showUploadImgDialog: true
        })
      },
      fail: () => {
        wx.showToast({
          icon: 'error',
          title: '请重新选择照片'
        })
        console.log('【错误！！！ ----- 选择照片失败】', err)
      }
      // 1、选择照片
    })
  }
})
