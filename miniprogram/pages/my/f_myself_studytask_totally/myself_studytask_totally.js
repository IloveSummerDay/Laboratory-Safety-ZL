// pages/my/f_myself_studytask_totally/myself_studytask_totally.js
Page({
  data: {
    study_list_percent:10,
    test_task_percent: 20

  },
  // 进度条 是否接上后端接口
  study_list_progress: function () {
    let that = this;
    let study_list_percent = xxx; //获取percent
    that.setData({
      study_list_percent: study_list_percent
    })
  },
  test_task_progress: function () {
    let that = this;
    let test_task_percent = xxx; //获取percent
    that.setData({
      test_task_percent: test_task_percent
    })
  },
  // 
  changeStyle1(){
    // 现在完成的：点击之后改变样式
    // 后续应该完成：设置其他页面完成，传参数过来
    // 存在问题：点击之后才会变化，但是想要的结果是不点击
    // 看一下生命周期函数->初始化->传参数https://blog.csdn.net/m0_38134431/article/details/88788032父子之间试一试
    //   onLaunch() {
    //   console.log('onLaunch监听小程序初始化');
    //  }

    // if 接线板完成 设置socket_index=1 ->别的页面的参数
    // const socket_index=1;
    // 如果socket_index=1，则改变style
    // if(socket_index=1){
      // 如果1的背景是白色，则改为蓝色，如果不是白色 维持蓝色
      var bgColor1 = this.data.list1_background_color == 'white' ? '#335ca5' : '#335ca5';
      // 字体同理
      var fsColor1 =  this.data.list1_color == '#505050' ? 'white' : 'white';
      // 设置背景颜色数据
      this.setData( {
        list1_background_color: bgColor1,
        list1_color:fsColor1
      } );
    // }
  },
  changeStyle2(){
      var bgColor2 = this.data.list2_background_color == 'white' ? '#335ca5' : '#335ca5';
      var fsColor2 =  this.data.list2_color == '#505050' ? 'white' : 'white';
      this.setData( {
        list2_background_color: bgColor2,
        list2_color:fsColor2
      } );
  },
  changeStyle3(){
    var bgColor3 = this.data.list3_background_color == 'white' ? '#335ca5' : '#335ca5';
    var fsColor3 =  this.data.list3_color == '#505050' ? 'white' : 'white';
    this.setData( {
      list3_background_color: bgColor3,
      list3_color:fsColor3
    } );
}
});
