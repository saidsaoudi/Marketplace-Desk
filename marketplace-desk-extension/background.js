// Marketplace Desk Extension Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Marketplace Desk Extension] Installed successfully.');
  chrome.storage.local.set({ extensionActive: true });
});

// Relay messages between localhost:3000 and facebook.com
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'QUEUE_ARTICLE_PUBLISH') {
    chrome.storage.local.set({ pendingArticle: request.article }, () => {
      console.log('[Marketplace Desk] Article queued for publish:', request.article.title);
      sendResponse({ status: 'queued', title: request.article.title });
    });
    return true;
  }

  if (request.type === 'GET_PENDING_ARTICLE') {
    chrome.storage.local.get(['pendingArticle'], (result) => {
      sendResponse({ article: result.pendingArticle || null });
    });
    return true;
  }

  if (request.type === 'CLEAR_PENDING_ARTICLE') {
    chrome.storage.local.remove(['pendingArticle'], () => {
      sendResponse({ status: 'cleared' });
    });
    return true;
  }
});
