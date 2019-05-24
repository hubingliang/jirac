const content = chrome.runtime.getURL('js/content.js')
const script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', content)
document.body.appendChild(script)

// const port = chrome.runtime.connect('foikjjlgaeiegaffeongnkakdcinmhd')
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sync') {
    window.postMessage(request, '*')
  } else if (request.action === 'updateParentTask') {
    window.postMessage(request, '*')
  } else if (request.action === 'getParentTask') {
    sendResponse(JSON.parse(localStorage.getItem('parentTask')))
  } else if (request.action === 'changeStatus') {
    const parentTask = JSON.parse(localStorage.getItem('parentTask'))
    parentTask.map(parent => {
      if (parent.key === request.value.task.key) {
        parent.isOnline = !parent.isOnline
      }
    })
    localStorage.setItem('parentTask', JSON.stringify(parentTask))
    window.postMessage({ action: 'changeStatus', value: parentTask }, '*')
    sendResponse(JSON.parse(localStorage.getItem('parentTask')))
  }
})
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.greeting == '您好') sendResponse({ farewell: '再见' })
// })
