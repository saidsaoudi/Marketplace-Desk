// Runs on Marketplace Desk Web App (localhost:3000)
console.log('[Marketplace Desk Extension] Connected to Web App.');

// Signal to the web app that the extension is installed and active
window.postMessage({ type: 'MP_EXTENSION_CONNECTED', version: '1.0.0' }, '*');
document.documentElement.setAttribute('data-mp-extension-installed', 'true');

// Listen for publish requests from Marketplace Desk App
window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  if (event.data && event.data.type === 'MP_PUBLISH_ARTICLE') {
    const article = event.data.article;
    console.log('[Marketplace Desk Extension] Received article to publish:', article);

    chrome.runtime.sendMessage({
      type: 'QUEUE_ARTICLE_PUBLISH',
      article: article
    }, (response) => {
      console.log('[Marketplace Desk Extension] Queued in background storage:', response);
    });
  }
});
