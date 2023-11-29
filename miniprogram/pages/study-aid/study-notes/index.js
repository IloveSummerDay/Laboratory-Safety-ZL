// pages/study-aid/study-notes/index.js
let tempTitle = undefined
let app = undefined
const noteList = [
  {
    title: '实验室常见物品总结',
    content: `实验室中常见的物品包括但不限于以下几种：
    1. **玻璃器皿：** 包括烧杯、烧瓶、试管、烧瓶等，用于容纳化学试剂或混合溶液。
    2. **化学试剂：** 包括酸、碱、盐类、溶剂、指示剂等，用于实验室的化学反应和分析。
    3. **实验室设备：** 比如磁力搅拌器、恒温培养箱、离心机、显微镜、分光光度计等，用于实验操作或数据采集分析。
    4. **个人防护装备（PPE）：** 如实验室外套、护目镜、手套、防护面罩等，用于保护实验人员的安全。
    5. **实验室垃圾桶：** 用于处理废弃物和实验室垃圾，包括生物危险废物和化学废物的专用垃圾桶。
    6. **标本和培养基：** 如细菌培养基、培养皿、移液器等，用于生物实验和培养操作。
    7. **安全设备：** 包括紧急淋浴、安全淋漓、灭火器等，用于应急处理和灭火。
    8. **计量工具：** 包括量筒、天平、温度计、PH计等，用于精确测量和调节实验参数。
    这些物品是实验室操作中常见的基本元素，能够满足各种化学、生物、物理实验的需求，并确保实验室操作的安全和准确性。`
  },
  {
    title: '实验室应急消防技巧',
    content: `在实验室中，应急消防技巧至关重要。以下是一些实验室应急消防技巧：
    1. **火灾报警：** 确保实验室内部有可靠的火灾报警系统，并且了解如何使用它。在发现火灾或烟雾时，立即触发报警器，通知其他人员并尽快撤离实验室。
    2. **使用灭火器：** 如果有适当的培训和实验室标准许可的情况下，了解如何正确地使用灭火器。掌握使用灭火器的基本原理和操作，并选择正确类型的灭火器用于相应类型的火灾（例如，ABC型干粉灭火器适用于多种火灾类型）。
    3. **安全撤离：** 在发生火灾或其他紧急情况时，熟悉安全撤离路线和集合点。定期进行模拟演练，以确保所有实验室成员都知道如何安全撤离。
    4. **化学品处理：** 在火灾中，要注意周围的化学品。了解实验室中的危险化学品位置，并知道如何安全地撤离这些物质或者在必要时采取特殊的灭火方法。
    5. **个人防护装备（PPE）：** 在灭火或救援他人时，确保佩戴正确的个人防护装备，如防护眼镜、面罩和耐火服等。
    6. **紧急通道清晰：** 保持实验室的紧急通道和出口畅通无阻，以确保在紧急情况下人员可以快速撤离。
    关键的应急消防技巧在于预防、培训和实践。定期进行培训，确保实验室所有成员都了解正确的应急处理程序，并熟悉灭火设备的使用方法，以便在发生火灾或其他紧急情况时能够迅速做出反应。`
  }
]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    noteList: [],
    showTitleInput: false,
    showEditIcon: false,
    titleInputValue: ''
  },
  toNoteDetail(e) {
    // console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `../study-notes-detail/index?title=${this.data.noteList[index].title}&content=${this.data.noteList[index].content}`
    })
  },
  handleWriteNote(e) {
    let notes
    if (tempTitle) {
      notes = [
        ...this.data.noteList,
        {
          title: tempTitle,
          content: '请输入笔记内容...'
        }
      ]
    }
    this.setData({
      showTitleInput: false,
      noteList: notes,
      titleInputValue: ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    app = getApp()
    if (!app.globalData.isLogin) {
      return
    }
    this.setData({
      showEditIcon: true,
      noteList
    })
  },

  onShow() {},
  getTitle(e) {
    console.log(e.detail.value)
    tempTitle = e.detail.value
  },
  openTitleDialog() {
    this.setData({
      showTitleInput: true
    })
  },
  closeDialog() {
    this.setData({
      showTitleInput: false,
      titleInputValue: ''
    })
  }
})
