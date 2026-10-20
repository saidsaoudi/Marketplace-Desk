// Marketplace Desk Facebook Automation Script
// Runs on facebook.com/marketplace/create/*

console.log('[Marketplace Desk] Facebook content script loaded.');

// Helper to simulate native React input changes
function setNativeValue(element, value) {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value') ? Object.getOwnPropertyDescriptor(element, 'value').set : null;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value') ? Object.getOwnPropertyDescriptor(prototype, 'value').set : null;

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    element.value = value;
  }

  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

// Check for data either in URL hash or chrome storage
function getArticleData(callback) {
  // 1. Check URL Hash
  if (window.location.hash.includes('mp_data=')) {
    try {
      const raw = window.location.hash.split('mp_data=')[1];
      const data = JSON.parse(decodeURIComponent(raw));
      if (data && data.title) {
        callback(data);
        return;
      }
    } catch (e) {
      console.warn('[Marketplace Desk] Could not parse hash data:', e);
    }
  }

  // 2. Check Extension Storage
  chrome.storage.local.get(['pendingArticle'], (res) => {
    if (res && res.pendingArticle) {
      callback(res.pendingArticle);
    } else {
      callback(null);
    }
  });
}

// Find inputs in Facebook Marketplace form
function fillFacebookForm(article) {
  let filledCount = 0;

  // 1. Title input
  const allInputs = Array.from(document.querySelectorAll('input[type="text"], input:not([type])'));
  const titleInput = allInputs.find((el) => {
    const label = (el.getAttribute('aria-label') || '').toLowerCase();
    const placeholder = (el.placeholder || '').toLowerCase();
    const parentText = (el.closest('label')?.innerText || '').toLowerCase();
    return label.includes('titre') || label.includes('title') || placeholder.includes('titre') || placeholder.includes('title') || parentText.includes('titre') || parentText.includes('title');
  });

  if (titleInput && article.title) {
    titleInput.focus();
    setNativeValue(titleInput, article.title);
    filledCount++;
    console.log('[Marketplace Desk] Title filled:', article.title);
  }

  // 2. Price input
  const priceInput = allInputs.find((el) => {
    const label = (el.getAttribute('aria-label') || '').toLowerCase();
    const placeholder = (el.placeholder || '').toLowerCase();
    const parentText = (el.closest('label')?.innerText || '').toLowerCase();
    return label.includes('prix') || label.includes('price') || placeholder.includes('prix') || placeholder.includes('price') || parentText.includes('prix') || parentText.includes('price');
  });

  if (priceInput && (article.price !== undefined)) {
    priceInput.focus();
    setNativeValue(priceInput, String(article.price));
    filledCount++;
    console.log('[Marketplace Desk] Price filled:', article.price);
  }

  // 3. Description textarea
  const descTextarea = document.querySelector('textarea');
  if (descTextarea && article.description) {
    descTextarea.focus();
    setNativeValue(descTextarea, article.description);
    filledCount++;
    console.log('[Marketplace Desk] Description filled');
  }

  return filledCount;
}

// Automatically click "Next" or "Publier"
function clickPublishButton() {
  const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
  const publishBtn = buttons.find((btn) => {
    const text = (btn.innerText || '').trim().toLowerCase();
    return text === 'publier' || text === 'publish' || text === 'suivant' || text === 'next';
  });

  if (publishBtn) {
    publishBtn.click();
    console.log('[Marketplace Desk] Clicked publish/next button:', publishBtn.innerText);
    return true;
  }
  return false;
}

// Floating UI Overlay on Facebook
function injectFloatingHelper(article) {
  if (document.getElementById('mp-desk-floating-card')) return;

  const card = document.createElement('div');
  card.id = 'mp-desk-floating-card';
  card.style.position = 'fixed';
  card.style.top = '20px';
  card.style.right = '20px';
  card.style.zIndex = '999999';
  card.style.width = '330px';
  card.style.backgroundColor = '#0f172a';
  card.style.border = '1px solid #3b82f6';
  card.style.borderRadius = '16px';
  card.style.padding = '16px';
  card.style.color = '#ffffff';
  card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)';
  card.style.fontFamily = 'system-ui, -apple-system, sans-serif';

  card.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #1e293b; padding-bottom:8px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="background:#2563eb; color:#fff; font-weight:bold; width:22px; height:22px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:12px;">MP</span>
        <span style="font-weight:700; font-size:13px; color:#f8fafc;">Marketplace Desk</span>
      </div>
      <button id="mp-close-btn" style="background:transparent; border:none; color:#94a3b8; font-size:16px; cursor:pointer;">✕</button>
    </div>

    <div style="margin-bottom:12px;">
      <p style="font-size:11px; color:#94a3b8; margin:0 0 4px 0;">Article à publier :</p>
      <p style="font-weight:600; font-size:13px; color:#38bdf8; margin:0 0 4px 0; word-break:break-word;">${article.title}</p>
      <div style="display:flex; gap:8px; font-size:11px; color:#cbd5e1;">
        <span style="background:#1e293b; padding:2px 8px; border-radius:6px;">💰 ${article.price} MAD</span>
        <span style="background:#1e293b; padding:2px 8px; border-radius:6px;">📍 ${article.location || 'Maroc'}</span>
      </div>
    </div>

    <div style="display:flex; flex-direction:column; gap:8px;">
      <button id="mp-autofill-btn" style="background:#2563eb; hover:background:#1d4ed8; color:#fff; border:none; padding:10px 12px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
        ⚡ Remplir Automatiquement (Auto-Fill)
      </button>

      <button id="mp-autopublish-btn" style="background:#059669; hover:background:#047857; color:#fff; border:none; padding:10px 12px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
        🚀 Remplir et Publier (Auto-Publish)
      </button>

      <div style="display:flex; gap:6px; margin-top:4px;">
        <button id="mp-copy-title" style="flex:1; background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:6px; border-radius:6px; font-size:10px; cursor:pointer;">
          📋 Copier Titre
        </button>
        <button id="mp-copy-price" style="flex:1; background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:6px; border-radius:6px; font-size:10px; cursor:pointer;">
          📋 Copier Prix
        </button>
        <button id="mp-copy-desc" style="flex:1; background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:6px; border-radius:6px; font-size:10px; cursor:pointer;">
          📋 Copier Description
        </button>
      </div>
    </div>
    <p id="mp-status-msg" style="font-size:10px; color:#22c55e; margin:8px 0 0 0; text-align:center; font-weight:500;"></p>
  `;

  document.body.appendChild(card);

  const statusMsg = document.getElementById('mp-status-msg');

  // Close button
  document.getElementById('mp-close-btn').addEventListener('click', () => {
    card.remove();
  });

  // Auto-Fill Button
  document.getElementById('mp-autofill-btn').addEventListener('click', () => {
    const count = fillFacebookForm(article);
    if (count > 0) {
      statusMsg.innerText = `✓ ${count} champs remplis avec succès !`;
    } else {
      statusMsg.innerText = `Attendez que le formulaire Facebook se charge...`;
    }
  });

  // Auto-Publish Button
  document.getElementById('mp-autopublish-btn').addEventListener('click', () => {
    fillFacebookForm(article);
    statusMsg.innerText = `Champs remplis. Clique sur Suivant/Publier...`;
    setTimeout(() => {
      clickPublishButton();
      chrome.storage.local.remove(['pendingArticle']);
    }, 800);
  });

  // Quick Copy Buttons
  document.getElementById('mp-copy-title').addEventListener('click', () => {
    navigator.clipboard.writeText(article.title);
    statusMsg.innerText = `✓ Titre copié !`;
  });

  document.getElementById('mp-copy-price').addEventListener('click', () => {
    navigator.clipboard.writeText(String(article.price));
    statusMsg.innerText = `✓ Prix copié !`;
  });

  document.getElementById('mp-copy-desc').addEventListener('click', () => {
    navigator.clipboard.writeText(article.description || article.title);
    statusMsg.innerText = `✓ Description copiée !`;
  });

  // Automatic attempt after 2 seconds
  setTimeout(() => {
    fillFacebookForm(article);
  }, 2200);
}

// Run when Facebook Marketplace loads
getArticleData((article) => {
  if (article && article.title) {
    console.log('[Marketplace Desk] Found pending article:', article);
    injectFloatingHelper(article);
  }
});
