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
  const letterMap = ['A','B','C','D']
  const sortedNumber = arr.map((item) => orderMap[item])
  const resultNumber = sortedNumber.sort((a, b) => a - b)
  const result = resultNumber.map((item) => letterMap[item])
  return result.join('') // "ABC" "BCD" "ABCD"...
}

module.exports = {
  formatTime,
  convertToOrder
}
