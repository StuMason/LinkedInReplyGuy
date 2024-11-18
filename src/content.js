// Initialize mutation observer
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (!mutation.addedNodes) return;
    
    mutation.addedNodes.forEach((node) => {
      if (node.classList?.contains("feed-shared-update-v2")) {
        createAIResponseButton(node);
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: false
});

function createAIResponseButton(article) {
  const actionBar = article.querySelector(".feed-shared-social-action-bar");
  if (!actionBar) return;

  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "feed-shared-social-action-bar__action-button";

  const button = document.createElement("button");
  button.className = "social-actions-button artdeco-button artdeco-button--4 artdeco-button--tertiary flex-wrap artdeco-button--muted";
  button.innerHTML = `
    <img src="${chrome.runtime.getURL('images/icon-48.png')}" 
         alt="AI Response" 
         class="ai-button-icon" />
    <span class="artdeco-button__text">AI Reply</span>
  `;

  button.addEventListener("click", () => handleAIButtonClick(article, button));
  buttonWrapper.appendChild(button);
  actionBar.appendChild(buttonWrapper);
}

async function handleAIButtonClick(article, button) {
  const originalContent = button.innerHTML;
  button.innerHTML = '<div class="spinner"></div>';

  try {
    const text = article.querySelector(".update-components-text")?.textContent;
    if (!text) throw new Error("No content found");

    const response = await AIService.generateResponse(text);
    await DOMUtils.setCommentReply(article, response);
  } catch (error) {
    console.error("Error generating response:", error);
  } finally {
    button.innerHTML = originalContent;
  }
}