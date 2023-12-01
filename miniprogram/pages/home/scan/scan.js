// pages/home/scan/scan.js
import detectObject from '../../../request/http.js' // detectObject( ImageBase64 )
import { nameMap } from './nameMap.js'

let cameraCtx = null
Page({
  data: {
    showLoginDialog: false,
    entryBtn: '进入学习',
    cancelBtn: '取消',
    cameraSide: 'back',
    tempPicVisible: false,
    detectRes: '',
    objName: '物体名称',
    objPic: '',
    showModal: false,
    modalDom: null,
    modalTransition: null,
    tempPicPath: undefined
  },
  takePhoto() {
    // 1、调用Camera拍照
    wx.showLoading({
      title: '拍照中',
      mask: true
    })
    cameraCtx.takePhoto({
      qulaty: 'high',
      success: res => {
        wx.hideLoading()
        wx.showLoading({
          title: '压缩图片中',
          mask: true
        })
        // 2、拍照成功压缩图片
        wx.compressImage({
          src: res.tempImagePath,
          quality: 80,
          success: res => {
            this.setData({
              tempPicVisible: true,
              tempPicPath: res.tempFilePath
            })
            wx.hideLoading()
            wx.showLoading({
              title: '扫描识别中'
            })
            console.log('【图片临时路径】', this.data.tempPicPath, wx.env.USER_DATA_PATH)
            let ImageBase64 = this.toBase64()
            this.detectObjectAPI(ImageBase64)
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
   * @desc 请求后端接口，调用腾讯云图像AI识别物体
   * @param {string} ImageBase64
   */
  detectObjectAPI(ImageBase64) {
    console.log('【请求后端接口，调用腾讯云图像AI识别物体】')
    try {
      detectObject(ImageBase64).then(
        res => {
          // res = extinguisher || socket || wiringBoard || switch
          console.log(
            '【调用腾讯云图像AI识别物体返回结果 extinguisher || socket || wiringBoard || switch】',
            res
          )
          wx.hideLoading()
          this.showModal(res)
        },
        err => {
          console.log('【请求后端接口，调用腾讯云图像AI识别物体 失败原因】', err)
          wx.hideLoading()
          this.errStrategy(err)
        }
      )
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        icon: 'error',
        title: '网络不佳请重试'
      })
      this.setData({
        tempPicVisible: false,
        tempPicPath: undefined
      })
    }
  },
  /**
   * @desc 拍摄或从手机相册中选择图片
   */
  fromAlbum() {
    // 1、选择照片
    wx.chooseMedia({
      count: 1,
      mediaType: 'image',
      sourceType: 'album',
      success: res => {
        wx.showLoading({
          title: '扫描中'
        })
        let tempPicPath = res.tempFiles[0].tempFilePath
        console.log('【所选照片的临时路径、大小】', tempPicPath, res.tempFiles[0].size)
        this.setData({ tempPicVisible: true, tempPicPath })
        this.detectObjectAPI(this.toBase64())
      },
      fail: err => {
        wx.showToast({
          icon: 'error',
          title: '请重新选择照片'
        })
        console.log('【错误！！！ ----- 选择照片失败】', err)
      }
      // 1、选择照片
    })
  },
  switchSide() {
    let cameraSide
    if (this.data.cameraSide === 'back') cameraSide = 'front'
    else cameraSide = 'back'
    this.setData({ cameraSide })
  },
  toBase64() {
    try {
      const base64 = wx.getFileSystemManager().readFileSync(this.data.tempPicPath, 'base64', 0)
      return base64
    } catch (e) {
      console.log('toBase64 Error: ', e)
    }
  },
  /**
   * @desc 根据识别物体接口返回结果显示进入学习对话框
   * @param {string} name
   */
  showModal(name) {
    // name = extinguisher || socket || wiringBoard || switch
    let resolvedName = name
    if (nameMap[name]) {
      resolvedName = nameMap[name].name // 灭火器 || 插座插头....
    }
    this.setData({
      detectRes: name,
      objName: resolvedName,
      showModal: true,
      // tempPicVisible: true,
      objPic: nameMap[name].imageUrl
    })
  },
  hideModal() {
    this.animate(
      '#modal',
      [
        { translateY: 0, ease: 'ease' },
        { translateY: '100%', ease: 'ease' }
      ],
      500,
      function () {
        this.clearAnimation('#modal')
        this.setData({ showModal: false, tempPicVisible: false, tempPicPath: undefined })
      }.bind(this)
    )
  },
  toStudy() {
    this.hideModal()
    let timer = setTimeout(() => {
      wx.navigateTo({
        url: nameMap[this.data.detectRes].url
      })
      clearTimeout(timer)
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp()
    // if (!app.globalData.isLogin) {
    //   this.setData({
    //     showLoginDialog: true
    //   })
    // } else {
    //   wx.authorize({
    //     scope: 'scope.camera'
    //   })
    //   cameraCtx = wx.createCameraContext()
    // }
  },
  toLogin() {
    console.log('【跳转到个人中心去登录】')
    wx.switchTab({
      url: '../../my/index/my'
    })
  },
  errStrategy(code) {
    const errStrategy = {
      // 201：'未识别到实验室物品'
      201: () => {
        wx.showModal({
          title: '未识别到实验室物品',
          content:
            '目前仅能识别灭火器、消防类器材、插座插头、接线板、开关等，拍照时请完整拍下学习对象',
          complete: res => {
            this.setData({
              tempPicVisible: false,
              tempPicPath: undefined
            })
          }
        })
      },
      // 202：`服务器请求错误：${res.statusCode}`
      202: () => {
        wx.showModal({
          title: '服务器请求错误',
          content: '目前位置网络不佳，请移步到网络良好处进行拍照扫描',
          complete: res => {
            this.setData({
              tempPicVisible: false,
              tempPicPath: undefined
            })
          }
        })
      },
      // 203：'服务器请求失败'
      203: () => {
        wx.showModal({
          title: '服务器请求失败',
          content: '目前位置网络不佳，请移步到网络良好处进行拍照扫描',
          complete: res => {
            this.setData({
              tempPicVisible: false,
              tempPicPath: undefined
            })
          }
        })
      },
      // 204：'服务器请求超时'
      204: () => {
        wx.showModal({
          title: '服务器请求超时',
          content: '目前位置网络不佳，请移步到网络良好处进行拍照扫描',
          complete: res => {
            this.setData({
              tempPicVisible: false,
              tempPicPath: undefined
            })
          }
        })
      }
    }
    errStrategy[code]()
  }
})
