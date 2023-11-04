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
    if (videoURLIndex == e.currentTarget.dataset.index) return
    console.log('【切换视频】', e.currentTarget.dataset.index)
    videoURLIndex = e.currentTarget.dataset.index
    totalTime += deltaTime
    deltaTime = 0
    this.setData({
      videoURLIndex
    })
    this.loadVideo()
  },
  getVideoTempURL() {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(
      '【章节目录 视频分类】',
      options.classIndex,
      options.className,
      table[options.classIndex][options.className],
      totalTime,
      deltaTime
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
    /**
     * @desc 此处这样写 完全是为了演示
     * 安全手册学习种类总共 为5
     */
    // if (app.globalData.learnedModule.includes(className)) return
    // app.globalData.learnedModule.push(className)
    // app.globalData.konwLedgeProgress += 100 / 5
    totalTime += deltaTime
    if (totalTime <= 60) {
      // 此次学习时长不足一分钟时 不作记录
      wx.showToast({
        icon: 'error',
        title: '学习不足一分钟'
      })
    } else {
      // 调用增加时长接口， 更新数据库学习时长
      wx.request({
        url: 'https://springboot-07ie-78136-5-1314621544.sh.run.tcloudbase.com/addTime',
        method: 'PUT',
        header: {
          'content-type': 'application/form-data'
        },
        data: {
          id: '215701214',
          learn_time: 20
        },
        success: res => {
          console.log('【增加学时成功回调】', res)
          app.globalData.studyTime += Math.ceil(totalTime / 60)
        },
        fail: (errno, errMsg) => {
          console.log('【查询题目失败回调】', errno, errMsg)
        }
      })
    }
    console.log(
      '【离开安全手册视频学习页后 全局状态 】 学习总时长分 本页学习时长秒',
      app.globalData.studyTime,
      totalTime
    )
    // 重置 本页学习时长统计
    totalTime = 0
    deltaTime = 0
  }
})
