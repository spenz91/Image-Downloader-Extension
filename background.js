// background.js

let imageFiles = [];

// Listen for completed web requests and filter image types
chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.type === "image") {
      imageFiles.push({
        url: details.url,
        filename: decodeURIComponent(details.url.split('/').pop().split('?')[0]),
      });
    }
  },
  { urls: ["<all_urls>"] }
);

// Handle messages from popup scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getImageFiles") {
    sendResponse(imageFiles);
  } else if (request.action === "clearImageFiles") {
    imageFiles = [];
    sendResponse({ success: true });
  }
});
