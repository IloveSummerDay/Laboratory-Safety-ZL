import { ThreeInstance } from '../../../threejs/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // canvasId: '',
    isDownloading: false,
    dlPer: -1,
    use: [
      {
        "use_name": "Step1 提"
      },
      {
        "use_name": "Step2 拔"
      },
      {
        "use_name": "Step3 压"
      },
      {
        "use_name": "Step4 喷"
      }
    ],
    state: '',
    actions: [],
    platform: null,
    disposing: false,
    animationMixer: null,
    three: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let model;
    const _this = this;
    try {
      model = wx.getStorageSync('mesh_extinguisher');
      _this.setData({ isDownloading: true });
      if(!model) {
        _this.downlaodRes();
      } else {
        const fs = wx.getFileSystemManager();
        fs.getFileInfo({
          filePath: model,
          success: res => {
            const { digest } = res;
            wx.request({
              url: 'https://www.logosw.top/LabSafe/model/extinguisher.md5.txt',
              method: 'GET',
              header: {
                'Content-Type': 'text/plain'
              },
              success: res => {
                if(res.statusCode === 200) {
                  const { data } = res;
                  if(digest !== data) {
                    _this.downlaodRes();
                  } else {
                    wx.showLoading({ title: '加载中' });
                    _this.initCanvas(model, () => { 
                      _this.setData({ isDownloading: false });
                      wx.hideLoading();
                    });
                  }
                }
              },
              fail: err => console.log(err)
            })
          },
          fail: err => console.log(err)
        })
      }
    } catch(e) {
      console.log(e);
    }
  },

  downlaodRes() {
    const _this = this;
    const downloadTask = wx.downloadFile({
      url: 'https://www.logosw.top/LabSafe/model/extinguisher.glb',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      success(res) {
        const { statusCode, tempFilePath } = res;
        if(statusCode === 200) {
          const fs = wx.getFileSystemManager();
          const filePath = `${wx.env.USER_DATA_PATH}/extinguisher.glb`;
          fs.saveFile({
            tempFilePath,
            filePath,
            success() {
              wx.setStorageSync('mesh_extinguisher', filePath);
              let model = filePath;
              _this.initCanvas(model, () => _this.setData({ isDownloading: false }));
            },
            fail: e => console.log('SaveFile Err', e)
          })
        }
      }
    });

    downloadTask.onProgressUpdate(res => {
      let progress = res.progress;
      if(res.progress > 99) progress = 99;
      _this.setData({ dlPer: progress });
    });
  },

  selectStep: function (e) {
    const key = e.currentTarget.dataset.key;
    const length = this.three.actions.length;
    this.setData({
      state: key,
    });
    for(let i = 0; i < length; i++) {
      if(i !== key)
        this.three.actions[i].stop();
    }
    this.three.actions[key].play();
  },

  initCanvas(model, onloadCallback) {
    wx.createSelectorQuery()
    .select('#canvas')
    .node()
    .exec(res =>{
      const canvas = res[0].node;
      const three = new ThreeInstance(canvas);
      const sceneConfig = {
        cameraFov: 1.2,
        cameraNear: .1,
        cameraFar: 1000,
        cameraPosition: [25, 10, 10],
        meshUrl: model,
        meshOffsetY: .25,
        onloadCallback
      };
      three.init(sceneConfig, this);
      this.three = three;
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})