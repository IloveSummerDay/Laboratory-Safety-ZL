/**
 * @desc 请求后端接口，调用腾讯云图像AI识别物体
 * @param {string} ImageBase64 
 */
const detectObject = (ImageBase64) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://lab-safe.logosw.top/detectProduct',
      method: 'POST',
      data: { ImageBase64 },
      success: res => {
        if(res.statusCode === 200) {
          // console.log(res.data);
          const pageName = isLabObject(res.data);
          if(pageName) resolve(pageName);
          else reject('未识别到实验室物品');
        } else reject(`服务器请求错误：${res.statusCode}`);
      },
      error: err => reject('服务器请求失败')
    });
  });
}

/**
 * @desc 判断是否为实验室物品,并返回学习页名称
 * @param {object} data 
 */
const isLabObject = (data) => {
  // 解构数据
  let pageName;
  const { ProductInfoList, LabObjList } = data;
  if(ProductInfoList.length === 0) return pageName;
  const { Name } = ProductInfoList[0];
  // 物品名称模糊匹配
  for(let key in LabObjList) {
    const exp = new RegExp(`${LabObjList[key].name}`);
    if(exp.test(Name)) {
      pageName = LabObjList[key].category;
      break;
    }
  }

  return pageName;
}

export default detectObject;