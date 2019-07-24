const content = chrome.runtime.getURL('js/content.js')
const script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', content)
document.body.appendChild(script)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sync') {
    window.postMessage(request, '*')
  } else if (request.action === 'updateParentTask') {
    window.postMessage(
      {
        action: 'updateParentTask',
        projectKey: request.value,
      },
      '*',
    )
  } else if (request.action === 'changeStatus') {
    window.postMessage(
      { action: 'changeStatus', selectedTasks: request.value.selectedTasks, projectKey: request.value.projectKey },
      '*',
    )
  }
})
window.addEventListener(
  'message',
  function(event) {
    console.log('data', event.data)
    if (event.data.action === 'updatePopupTask') {
      chrome.runtime.sendMessage(event.data.value, function(response) {
        console.log('收到来自后台的回复：' + response)
      })
    }
  },
  false,
)
