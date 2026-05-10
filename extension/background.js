// Service worker — handles extension lifecycle and cross-context messaging

chrome.runtime.onInstalled.addListener(() => {
  console.log('AccessAid extension installed')
})

// Open popup when extension icon clicked (handled by manifest action, this is for future use)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_DASHBOARD') {
    chrome.tabs.create({ url: 'http://localhost:5173/dashboard' })
  }
  return false
})
