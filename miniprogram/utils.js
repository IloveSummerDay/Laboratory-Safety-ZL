function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('.')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function convertToOrder(arr) {
  const orderMap = { A: 0, B: 1, C: 2, D: 3 }
  const letterMap = ['A', 'B', 'C', 'D']
  const sortedNumber = arr.map(item => orderMap[item])
  const resultNumber = sortedNumber.sort((a, b) => a - b)
  const result = resultNumber.map(item => letterMap[item])
  return result.join('') // "ABC" "BCD" "ABCD"...
}

function getRanQuestions() {
  let randomNumbers = []
  let randomNumber = undefined
  // 单选 1-15
  while (randomNumbers.length < 10) {
    randomNumber = Math.floor(Math.random() * 15) + 1
    if (randomNumbers.indexOf(randomNumber) == -1) {
      randomNumbers.push(randomNumber)
    }
  }
  // 判断 31-50
  while (randomNumbers.length < 20) {
    randomNumber = Math.floor(Math.random() * 20) + 31
    if (randomNumbers.indexOf(randomNumber) == -1) {
      randomNumbers.push(randomNumber)
    }
  }
  // 多选 16-30
  while (randomNumbers.length < 30) {
    randomNumber = Math.floor(Math.random() * 15) + 16
    if (randomNumbers.indexOf(randomNumber) == -1) {
      randomNumbers.push(randomNumber)
    }
  }
  return randomNumbers
}

module.exports = {
  formatTime,
  convertToOrder,
  getRanQuestions
}
