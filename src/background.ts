export { }
console.log("Background script loaded!")

// Log that background script is loaded
const timestamp = new Date().toISOString()
chrome.storage.local.set({ lastLoaded: timestamp }, () => {
  console.log("Background script loaded at:", timestamp)
})

chrome.commands.onCommand.addListener((command) => {
  console.log('🪵 | chrome.commands.onCommand.addListener | command:', command);
  const eventTime = new Date().toISOString()
  chrome.storage.local.set({ 
    lastCommand: command,
    lastCommandTime: eventTime
  })

  if (command === "execute_action") {
    console.log("Execute action command received")
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: "TOGGLE_SIDEBAR",
          triggeredAt: eventTime
        }, (response) => {
          chrome.storage.local.set({ 
            lastMessageResponse: response,
            responseTime: new Date().toISOString()
          })
        })
      }
    })
  }
})