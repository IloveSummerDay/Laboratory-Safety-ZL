import { ThreeInstance } from '../../../threejs/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // canvasId: '',
    isDownloading: true,
    dlPer: -1,
    use: [
      {
        use_name: 'Step1 提'
      },
      {
        use_name: 'Step2 拔'
      },
      {
        use_name: 'Step3 压'
      },
      {
        use_name: 'Step4 喷'
      }
    ],
    state: '',
    actions: [],
    platform: null,
    disposing: false,
    animationMixer: null,
    three: undefined
  },
  logError(e) {
    console.log(e)
  },
  /**
   * @desc
   */
  onLoad: function () {
    const _this = this
    let model // string 模型存储路径
    wx.showLoading({
      title: '加载模型中'
    })
    try {
      model = wx.getStorageSync('mesh_extinguisher')
      console.log('【本地存储getStorageSync得到的模型路径】', model)

      if (!model) {
        console.log('【模型还没有本地存储】', model)
        _this.downlaodRes()
      } else {
        console.log('【模型已经本地存储了】', model)
        // 根据本地临时路径，加载本地模型
        const fs = wx.getFileSystemManager()
        fs.getFileInfo({
          filePath: model,
          success: res => {
            console.log('【获取该小程序下的 本地临时文件 或 本地缓存文件 信息】', res)
            _this.downlaodRes()
          },
          fail: err => {
            wx.hideLoading()
            console.log('【加载本地已储存模型失败】', err)
          }
        })
      }
    } catch (e) {
      wx.hideLoading()
      wx.showModal({
        title: '网络不佳',
        content: '加载灭火器模型失败，请稍后重试',
        complete: res => {
          wx.navigateBack()
        }
      })
      console.log('【加载模型过程出现错误】', e)
    }
  },
  /**
   * @desc 加载灭火器模型
   */
  async downlaodRes() {
    const _this = this
    let downloadTask = undefined
    try {
      downloadTask = wx.downloadFile({
        // url: 'https://www.logosw.top/LabSafe/model/extinguisher.glb',
        url:
          'https://7072-prod-2gchtexr0201dccd-1314621544.tcb.qcloud.la/AR-model/extinguisher.glb?sign=1800c5450bdfe0069eae496f1fe54db9&t=1701525016',
        header: {
          'Content-Type': 'multipart/form-data'
        },
        success(res) {
          wx.hideLoading()
          const { statusCode, tempFilePath } = res
          if (statusCode === 200) {
            console.log('【加载灭火器模型成功】', statusCode, wx.env.USER_DATA_PATH)
            const fs = wx.getFileSystemManager()
            const filePath = `${wx.env.USER_DATA_PATH}/extinguisher.glb`
            fs.saveFile({
              tempFilePath,
              filePath,
              success() {
                wx.setStorageSync('mesh_extinguisher', filePath)
                let model = filePath
                console.log('【灭火器模型保存本地成功】', filePath)
                _this.initCanvas(model, () => {
                  console.log('初始化工作完成！！！！！')
                  _this.setData({ isDownloading: false })
                })
              },
              fail: e => {
                console.log('SaveFile Err', e)
              }
            })
          }
        },
        fail: err => {
          wx.hideLoading()
          console.log('【加载灭火器模型失败】', err)
        }
      })
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '模型加载失败'
      })
      console.log('【downlaodRes()抛出错误】', error)
    }
    // 监听下载进度（本地没有存储模型时）
    if (downloadTask) {
      downloadTask.onProgressUpdate(res => {
        // console.log('【模型加载进度】', res)
        let progress = res.progress
        if (res.progress > 99) progress = 99
        _this.setData({ dlPer: progress })
      })
    }
  },
  /**
   * @desc 选择灭火步骤进行 灭火器 动画演示
   */
  // selectStep: function (e) {
  //   const key = e.currentTarget.dataset.key
  //   const length = this.three.actions.length
  //   this.setData({
  //     state: key
  //   })
  //   for (let i = 0; i < length; i++) {
  //     if (i !== key) this.three.actions[i].stop()
  //   }
  //   this.three.actions[key].play()
  // },

  initCanvas(model, onloadCallback) {
    console.log('1、【进入初始化场景并渲染函数】', model, onloadCallback)
    let three = undefined
    try {
      wx.createSelectorQuery()
        .select('#canvas')
        .node()
        .exec(res => {
          const canvas = res[0].node
          // const gl = canvas.getContext('webgl')
          console.log('2、【开始初始化场景并渲染】', res, canvas)
          three = new ThreeInstance(canvas)
          const sceneConfig = {
            cameraFov: 1.2,
            cameraNear: 0.1,
            cameraFar: 1000,
            cameraPosition: [25, 10, 10],
            meshUrl: model,
            meshOffsetY: 0.25,
            onloadCallback: onloadCallback
          }
          console.log('3、【初始化场景并渲染 传入画布的DOM节点，生成THREE实例】', three)
          console.log('4、【初始化场景并渲染，返回主场景对象】', three.init(sceneConfig, this))
        })
    } catch (error) {
      console.log('【初始化场景错误】', error)
    }
    this.setData({
      three: three
    })
  }
})
