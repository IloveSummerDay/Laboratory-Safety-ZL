/**
 * @desc 请求后端接口，调用腾讯云图像AI识别物体
 * @param {string} ImageBase64
 */
const detectObject = ImageBase64 => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://lab-safe.logosw.top/detectProduct',
      method: 'POST',
      data: { ImageBase64 },
      success: res => {
        if (res.statusCode === 200) {
          console.log('【调用 腾讯云 腾讯云 腾讯云 图像AI识别物体返回结果】', res)
          const pageName = isLabObject(res.data) // extinguisher、socket、wiringBoard、switch
          if (pageName) resolve(pageName)
          else reject('未识别到实验室物品')
        } else reject(`服务器请求错误：${res.statusCode}`)
      },
      error: err => reject('服务器请求失败')
    })
  })
}

/**
 * @desc 判断是否为实验室物品,并返回学习页名称
 * @param {object} data
 */
const isLabObject = data => {
  // 解构数据
  let pageName = undefined
  const { ProductInfoList, LabObjList } = data
  if (ProductInfoList.length === 0) return pageName
  const { Name } = ProductInfoList[0]
  console.log('【识别物品名称 ---- 实验室物品默认列表】', Name, LabObjList)
  // 物品名称模糊匹配
  for (let key in LabObjList) {
    // 用于匹配字符串中包含 ${LabObjList[key].name} 的部分
    const exp = new RegExp(`${LabObjList[key].name}`)
    if (exp.test(Name)) {
      pageName = LabObjList[key].category
      break
    }
  }
  return pageName // extinguisher、socket、wiringBoard、switch
}

export default detectObject
