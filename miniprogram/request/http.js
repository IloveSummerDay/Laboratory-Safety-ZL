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
      // timeout: 15000,
      success: res => {
        if (res.statusCode === 200) {
          console.log('【调用 腾讯云 腾讯云 腾讯云 图像AI识别物体返回结果】', res)
          // res.data => { LabObjList: [ extinguisher、socket、wiringBoard、switch ], code: 'xxx'... }
          const pageName = isLabObject(res.data)
          if (pageName) resolve(pageName)
          else reject(201) // 201：'未识别到实验室物品'
        } else reject(202) // 202：`服务器请求错误：${res.statusCode}`
      },
      fail: err => {
        console.log('【服务器请求失败】', err)
        reject(203) // 203：'服务器请求失败'
      },
      complete: () => {
        reject(204) // 204：'服务器请求超时'
      }
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
  let names = [] // string
  try {
    const { ProductInfoList, ProductInfo, LabObjList, RegionDetected } = data
    // 不是实验室物品时：
    if (data.ProductInfoList && data.ProductInfoList.length === 0) return pageName
    // 否则：
    for (let i = 0; i < ProductInfoList.length; i++) {
      names.push(ProductInfoList[i].Name)
    }
    console.log('【识别物品名称 ---- 实验室物品默认列表】', names, LabObjList)
    // 物品名称模糊匹配
    for (let j = 0; j < LabObjList.length; j++) {
      // 用于匹配字符串中包含 ${LabObjList[key].name} 的部分
      const exp = new RegExp(`${LabObjList[j].name}`)
      for (let i = 0; i < names.length; i++) {
        if (exp.test(names[i])) {
          // LabObjList 和 names 逐一正则比较
          // console.log('【匹配到实验室物品】', LabObjList[j].name, names[j]);
          pageName = LabObjList[j].category
          return pageName // extinguisher、socket、wiringBoard、switch
        }
      }
    }
  } catch (error) {
    console.log('【物品名称模糊匹配出错】', error)
    return undefined
  }
}

export default detectObject
