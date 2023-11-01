// pages/home/safety-manual/class-table/index.js
import {
  table
} from './table'
let videoCloudURL_list = undefined
let videoURLIndex = 0
let classIndex = undefined
let className = undefined
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nowNav: 1,
    navList: [{
        value: 1,
        label: '章节目录',
        icon: 'home',
        children: [],
      },
      {
        value: 2,
        label: '视频介绍',
        icon: 'app',
        children: [],
      },
      {
        value: 3,
        label: '课程介绍',
        icon: 'app',
        children: [],
      }
    ],
    titleList: [], // 视频标题
    videoTempURL: undefined,
  },
  handleChange(e) {
    console.log("【切换目录】", e.detail.value);
    this.setData({
      nowNav: e.detail.value
    })
  },
  loadVideo() {
    this.setData({
      videoTempURL: videoCloudURL_list[videoURLIndex]
    });
  },
  handleSwapVideo(e) {
    if (videoURLIndex == e.currentTarget.dataset.index) return
    console.log("【切换视频】", e.currentTarget.dataset.index);
    videoURLIndex = e.currentTarget.dataset.index
    this.loadVideo()
  },
  getVideoTempURL() {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("【章节目录 视频分类】", table[options.classIndex][options.className]);
    className = options.className
    classIndex = options.classIndex
    videoCloudURL_list = table[classIndex]["videoCloudURL"]
    this.setData({
      titleList: table[classIndex][className]
    })
    this.loadVideo()
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    let app = getApp()
    /**
     * @desc 此处这样写 完全是为了演示 
     * 安全手册学习种类总共 为5
     */
    if(app.globalData.learnedModule.includes(className)) return
    app.globalData.learnedModule.push(className)
    app.globalData.konwLedgeProgress += (100/5)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})