console.log('This is BACKGROUND page!')
// port.onMessage.addListener(function(msg) {
//   if (msg.question == '是谁？') port.postMessage({ answer: '女士' })
//   else if (msg.question == '哪位女士？') port.postMessage({ answer: 'Bovary 女士' })
// })
// chrome.runtime.onMessege.addListener(function(request, sender, sendResponse) {
//   sendResponse('我已收到你的消息：' + JSON.stringify(request))
// })
chrome.runtime.onConnect.addListener(function(port) {
  console.log(port)
  port.onMessage.addListener(function(msg) {
    console.log(msg)
    if (msg.joke == '敲门') port.postMessage({ question: '是谁？' })
    else if (msg.answer == '女士') port.postMessage({ question: '哪位女士？' })
    else if (msg.answer == 'Bovary 女士') port.postMessage({ question: '我没听清楚。' })
  })
})
