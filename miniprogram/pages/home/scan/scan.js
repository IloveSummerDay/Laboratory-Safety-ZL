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
                this.showModal(err)
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
  cameraError() {},
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
    wx.authorize({
      scope: 'scope.camera'
    })
    cameraCtx = wx.createCameraContext()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // const query = wx.createSelectorQuery();
    // query.select('#canvas')
    //   .fields({ node: true, size: true})
    //   .exec((res) => {
    //     const canvas = res[1].node;
    //     const canvasCtx = canvas.getContext('2d');
    //     const dpr = wx.getSystemInfoSync().pixelRatio;
    //     canvas.width = res[0].width * dpr;
    //     canvas.height = res[0].height * dpr;
    //     canvasCtx.scale(dpr, dpr);
    //     this.setData({
    //       canvas,
    //       canvasCtx,
    //       canvasWidth: res[0].width,
    //       canvasHeight: res[0].height
    //     });
    //   });
    //   const listener = this.data.cameraCtx.onCameraFrame(this.onTick);
    //   listener.start();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
