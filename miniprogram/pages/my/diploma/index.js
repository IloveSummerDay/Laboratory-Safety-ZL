// pages/my/diploma/index.js
import Message from 'tdesign-miniprogram/message/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    certificates: [],
    name: 'xxx',
    grade: 'xxx',
    visible: false,
    closeBtn: false,
    deleteBtn: false,
    image: ''
  },
  handleClickCertificates(e) {
    const { index } = e.currentTarget.dataset
    console.log(index)
    const images = [
      'cloud://cloud1-9gesq8mi1d4ae3de.636c-cloud1-9gesq8mi1d4ae3de-1314621544/个人中心icon/合格准入证.svg',
      'cloud://cloud1-9gesq8mi1d4ae3de.636c-cloud1-9gesq8mi1d4ae3de-1314621544/个人中心icon/实验优秀学员.svg'
    ]
    this.setData({
      image: images[index],
      visible: true
    })
  },
  handleCloseImageViewer(e) {
    // const { index } = e.detail
    // console.log('change', index) // 与 data-index 对应，证书索引位置
    this.setData({
      visible: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let app = getApp()
    if (!app.globalData.isLogin) {
      // 不能使用此功能
      return
    }
    // 调用获取证书接口，查询该用户所获证书情况
    let res = undefined
    wx.showLoading({
      title: '请求证书'
    })
    try {
      res = await app.call({
        path: `/selectCertificate?id=${app.globalData.id}`,
        method: 'POST',
        header: {
          'content-type': 'application/form-data'
        }
      })
    } catch (error) {
      wx.hideLoading()
      wx.showModal({
        title: '网络不佳',
        content: '请尝试重新进入所获证书页',
        complete: res => {
          if (res.confirm) {
            wx.navigateBack()
          }
        }
      })
      return
    }
    wx.hideLoading()
    console.log('【查询到所获证书】', res.data)
    if (res.code == 200) {
      let certificates = []
      const certificateNames = ['certificate1', 'certificate2']
      const certificatesObjs = [
        {
          src: '',
          content: '合格准入'
        },
        {
          src: '',
          content: '实验安全优秀学生'
        }
      ]
      for (let i = 0; i < certificateNames.length; i++) {
        if (res.data[certificateNames[i]]) {
          certificates.push(certificatesObjs[i])
        }
      }
      if ((!app.globalData.name || !app.globalData.grade) && certificates.length > 0) {
        Message.warning({
          context: '',
          offset: [20, 32],
          duration: 5000,
          content: '您的姓名或班级尚未填写，请前往个人中心进行完善。'
        })
      }
      this.setData({ certificates, name: app.globalData.name, grade: app.globalData.grade })
    } else {
      wx.showModal({
        title: '网络不佳',
        content: '请尝试重新进入',
        complete: res => {
          if (res.confirm) {
            wx.navigateBack()
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {}
})
