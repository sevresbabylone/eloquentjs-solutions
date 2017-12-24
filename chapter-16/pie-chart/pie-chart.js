var results = [
{name: 'Satisfied', count: 1043, color: '#027ada'},
{name: 'Neutral', count: 563, color: '#00a5f1'},
{name: 'Unsatisfied', count: 510, color: '#00cacd'},
{name: 'No comment', count: 175, color: '#35ffa1'}
]

var cx = document.querySelector('canvas').getContext('2d')
cx.scale(2, 2)
var total = results.reduce(function (sum, choice) {
  return sum + choice.count
}, 0)

var currentAngle = -0.5 * Math.PI
var centerX = 220
var centerY = 180

results.forEach(function (result) {
  cx.save()
  cx.translate(220, 180)
  var sliceAngle = (result.count / total) * 2 * Math.PI
  cx.font = '12px Arial'
  cx.fillStyle = 'white'
  cx.fillText(result.name, 150 * Math.cos(currentAngle + sliceAngle / 3), 150 * Math.sin(currentAngle + sliceAngle / 2))
  cx.restore()
  cx.beginPath()
  cx.arc(centerX, centerY, 100,
         currentAngle, currentAngle + sliceAngle)
  currentAngle += sliceAngle
  cx.lineTo(centerX, centerY)
  cx.fillStyle = result.color
  cx.fill()
})
