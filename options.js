document.getElementById('save').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value.trim();
    const status = document.getElementById('status');
  
    if (!apiKey) {
      status.textContent = 'Please enter an API key';
      status.className = 'status error';
      return;
    }
  
    chrome.storage.sync.set({ openai_api_key: apiKey }, () => {
      status.textContent = 'Settings saved successfully!';
      status.className = 'status success';
      setTimeout(() => {
        status.textContent = '';
        status.className = 'status';
      }, 3000);
    });
  });
  
  // Load saved key
  chrome.storage.sync.get('openai_api_key', (data) => {
    if (data.openai_api_key) {
      document.getElementById('apiKey').value = data.openai_api_key;
    }
  });