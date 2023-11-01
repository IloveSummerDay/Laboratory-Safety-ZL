// pages/studytask/f_Masterbrake_switch/Masterbrake_switch.js
var app = getApp()
Page({
  data: {
    showModal: false,
    showModal2: false,
    now_status:"请选择开关状态！"
  },
  onLoad: function () {
  },
  /**
   * 弹窗
   */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  showDialogBtn2: function () {
    this.setData({
      showModal2: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false,
      showModal2: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件 改变文字样式
   */
  onConfirm: function () { 
    if('now_status="开关当前为关"'||'now_status="请选择开关状态！"'){
      this.setData({
        now_status: "开关当前为开"
      });
    }
    this.hideModal();
  },

  onConfirm2: function () {
    if('now_status="开关当前为开"'||'now_status="请选择开关状态！"'){
      this.setData({
        now_status: "开关当前为关"
      });
    }
    this.hideModal();
  }
})
