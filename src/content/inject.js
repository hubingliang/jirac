const content = chrome.runtime.getURL('js/content.js')
const script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', content)
document.body.appendChild(script)

// const port = chrome.runtime.connect('foikjjlgaeiegaffeongnkakdcinmhd')
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse(JSON.parse(localStorage.getItem('parentTask')))
  if (request.action === 'sync') {
    window.postMessage(request, '*')
  } else if (request.action === 'updateParentTask') {
    sendResponse(JSON.parse(localStorage.getItem('parentTask')))
  } else if (request.action === 'getParentTask') {
    sendResponse(JSON.parse(localStorage.getItem('parentTask')))
  } else if (request.action === 'changeStatus') {
    window.postMessage(
      { action: 'changeStatus', task: request.value.task, projectKey: request.value.projectKey },
      '*',
    )
    sendResponse(JSON.parse(localStorage.getItem('parentTask')))
  } else if (request.action === 'reset') {
    localStorage.removeItem('parentTask')
  }
})
