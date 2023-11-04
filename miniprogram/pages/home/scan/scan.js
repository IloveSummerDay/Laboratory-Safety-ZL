// pages/home/scan/scan.js
import detectObject from '../../../request/http.js'
const nameMap = {
  extinguisher: {
    name: '灭火器',
    url: '../../studytask/b_knowledge_introduce/knowledge_introduce',
    imageUrl: 'https://labsafe-1310569006.cos.ap-shanghai.myqcloud.com/preview_extinguisher.png'
  },
  socket: {
    name: '插座插头',
    url: '../../studytask/g_socket/socket',
    imageUrl: 'https://labsafe-1310569006.cos.ap-shanghai.myqcloud.com/preview_socket.png'
  },
  wiringBoard: {
    name: '接线板',
    url: '../../studytask/i_plug_tips/plug_tips',
    imageUrl: 'https://labsafe-1310569006.cos.ap-shanghai.myqcloud.com/preview_switch.png'
  },
  switch: {
    name: '开关',
    url: '../../studytask/f_Masterbrake_switch/Masterbrake_switch',
    imageUrl: 'https://labsafe-1310569006.cos.ap-shanghai.myqcloud.com/preview_switch.png'
  }
}
let cameraCtx = null
Page({
  data: {
    showLoginDialog: false,
    btnTitle: '进入学习',
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
              title: '扫描中',
              mask: true
            })
            detectObject(this.toBase64()).then(
              res => {
                wx.hideLoading()
                this.showModal(res)
              },
              err => {
                console.log(err)
                wx.hideLoading()
                wx.showToast({
                  title: '请重新拍照上传'
                })
                // this.showModal(err)
              }
            )
          },
          fail: err => {
            console.log(err)
          }
        })
      },
      fail: err => {
        console.log('failed', err)
      }
    })
  },

  toAlbum() {
    wx.chooseMedia({
      count: 1,
      mediaType: 'image',
      sourceType: 'album',
      success: res => {
        wx.showLoading({
          title: '扫描中'
        })
        tempPicPath = res.tempFiles[0].tempFilePath
        this.setData({ tempPicVisible: true, tempPicPath })
        wx.compressImage({
          src: tempPicPath,
          quality: 80,
          success: () => {
            detectObject(this.toBase64()).then(
              res => {
                wx.hideLoading()
                this.showModal(res)
              },
              err => {
                console.log(err)
                wx.hideLoading()
                this.showModal(err)
              }
            )
          },
          fail: err => {
            console.log(err)
          }
        })
      }
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
      const base64 = wx.getFileSystemManager().readFileSync(tempPicPath, 'base64')
      return base64
    } catch (e) {
      console.log('toBase64 Error: ', e)
    }
  },
  showModal(name) {
    let resolvedName = name,
      btnTitle = '确定'
    if (nameMap[name]) {
      resolvedName = nameMap[name].name
      btnTitle = '进入学习'
    }
    this.setData({
      detectRes: name,
      objName: resolvedName,
      showModal: true,
      tempPicVisible: true,
      objPic: nameMap[name].imageUrl,
      btnTitle
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
        this.setData({ showModal: false, tempPicVisible: false })
      }.bind(this)
    )
  },
  toStudy() {
    if (this.data.btnTitle === '确定') this.hideModal()
    else
      wx.navigateTo({
        url: nameMap[this.data.detectRes].url
      })
  },
  /**
   * 生命周期函数--监听页面加载
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
    console.log('【跳转到个人中心去登录】');
    wx.switchTab({
      url: '../../my/index/my'
    })
  }
})
