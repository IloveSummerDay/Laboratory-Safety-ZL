// pages/home/safety-manual/class-table/index.js
import { table } from './table'
let videoCloudURL_list = undefined
let videoURLIndex = 0
let classIndex = undefined
let className = undefined
let totalTime = 0 // 视频学习总时长（秒）
let deltaTime = 0 // （秒）
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nowNav: 1,
    navList: [
      {
        value: 1,
        label: '章节目录',
        icon: 'home',
        children: []
      },
      {
        value: 2,
        label: '视频介绍',
        icon: 'app',
        children: []
      },
      {
        value: 3,
        label: '课程介绍',
        icon: 'app',
        children: []
      }
    ],
    titleList: [], // 视频标题
    videoTempURL: undefined,
    videoURLIndex: 0,
    videoContext: undefined
  },
  onPlay: function () {
    // 获取videoContext对象
    this.videoContext = wx.createVideoContext('video')
  },
  /**
   * @desc 视频播放时触发的事件
   */
  onTimeUpdate: function (e) {
    deltaTime = Math.ceil(e.detail.currentTime)
    // console.log('【当前播放时长】', e.detail.currentTime, totalTime, deltaTime)
  },
  handleNavChange(e) {
    console.log('【切换目录】', e.detail.value)
    this.setData({
      nowNav: e.detail.value
    })
  },
  loadVideo() {
    this.setData({
      videoTempURL: videoCloudURL_list[videoURLIndex]
    })
  },
  handleSwapVideo(e) {
    console.log('【切换视频 或不切】', e.currentTarget.dataset.index)
    if (videoURLIndex == e.currentTarget.dataset.index) return
    videoURLIndex = e.currentTarget.dataset.index
    totalTime += deltaTime
    deltaTime = 0
    this.setData({
      videoURLIndex
    })
    this.loadVideo()
  },
  getVideoTempURL() {},
  async setModuleComplete() {
    let app = getApp()
    let modulesName = ['setDianqi', 'setFeiwu', 'setXiaofang', 'setJiuyuan', 'setYanlian']
    const res = await app.call({
      path: `/${modulesName[classIndex]}?id=${app.globalData.id}`,
      method: 'PUT'
    })
    if (res.code == 200) console.log('【设置安全手册模块完成回调】', res)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(
      '【章节目录 视频分类】',
      options.classIndex,
      options.className,
      table[options.classIndex][options.className]
    )
    className = options.className
    classIndex = options.classIndex
    videoCloudURL_list = table[classIndex]['videoCloudURL']
    this.setData({
      titleList: table[classIndex][className]
    })
    this.loadVideo()
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  async onUnload() {
    let app = getApp()
    totalTime += deltaTime // 汇总此次页面的学习时长 （单位 - 秒）
    if (totalTime <= 60) {
      // 此次学习时长不足一分钟时 不作记录
      wx.showToast({
        icon: 'error',
        title: '学习不足一分钟'
      })
    } else {
      // 调用增加时长接口， 更新数据库学习时长
      const res = await app.call({
        path: `/addTime?id=${app.globalData.id}&learn_time=${Math.ceil(totalTime / 60)}`,
        method: 'PUT',
        header: {
          'content-type': 'application/form-data'
        }
      })
      // 接口成功回调 callback
      if (res.code == 200) {
        wx.showToast({
          title: '学时增加完成'
        })
        console.log('【增加学时成功回调】', res)
        console.log('【离开安全手册视频学习页后 全局状态 本页学习时长秒】', totalTime)
      } else {
        wx.showToast({
          title: '网络欠佳'
        })
      }
    }
    // 暂定学习5分钟即可算作完成该模块
    if (totalTime > 300) {
      this.setModuleComplete()
    }
    // 重置 本页学习时长统计
    totalTime = 0
    deltaTime = 0
  }
})
