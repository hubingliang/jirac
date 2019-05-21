const content = chrome.runtime.getURL('js/content.js')
const script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', content)
document.body.appendChild(script)

// const port = chrome.runtime.connect('foikjjlgaeiegaffeongnkakdcinmhdg')
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  window.postMessage(request, '*')
})
