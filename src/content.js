function getPostContent(article) {
  return (
    // Original selector
    article.querySelector(".update-components-text")?.textContent ||
    // Feed description wrapper
    article.querySelector(".feed-shared-update-v2__description")?.textContent ||
    // Sponsored/suggested post selector
    article.querySelector(".fie-impression-container .update-components-text")?.textContent ||
    // Nested content selector
    article.querySelector(".update-components-update-v2__commentary")?.textContent
  )?.trim();
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (!mutation.addedNodes) return;
    
    for (const node of mutation.addedNodes) {
      // Check if node is Element and has classList
      if (node instanceof Element) {
        if (node.classList.contains("feed-shared-update-v2")) {
          createAIResponseButton(node);
        }
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Intent/Style configurations
const RESPONSE_STYLES = {
  networking: {
    name: "Networking",
    icon: "👥",
    prompt: "Act as a peer in the same industry. Keep responses brief and casual. No platitudes or exclamation marks. Acknowledge their point and add a small personal insight or question. Write as if sending a quick message to a colleague.",
  },
  sales: {
    name: "Business Development", 
    icon: "💼",
    prompt: "Act as a business professional. Be direct and value-focused. No sales jargon. Frame responses around practical benefits or experiences. Write as if following up with a potential business partner.",
  },
  thought_leadership: {
    name: "Thought Leadership",
    icon: "💡",
    prompt: "Act as an experienced practitioner. Share specific insights from hands-on experience. No buzzwords or theoretical statements. Write as if responding to a peer's observation about the industry.",
  },
  job_seeking: {
    name: "Career Growth",
    icon: "📈",
    prompt: "Act as a professional discussing work experience. Be specific about relevant skills and outcomes. No generic statements. Write as if having a focused conversation about career development."
  }
};

async function handleAIButtonClick(article, button, style) {
  const originalContent = button.innerHTML;
  button.innerHTML = '<div class="spinner"></div>';

  try {
    const text = article.querySelector(".update-components-text")?.textContent;
    if (!text) throw new Error("No content found");

    const response = await AIService.generateResponse(text, style);
    await DOMUtils.setCommentReply(article, response);
  } catch (error) {
    console.error("Error generating response:", error);
  } finally {
    button.innerHTML = originalContent;
  }
}

function createAIResponseButton(article) {
  const actionBar = article.querySelector(".feed-shared-social-action-bar");
  if (!actionBar) return;
  
  // Check if button already exists
  if (actionBar.querySelector(".ai-response-wrapper")) return;

  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "ai-response-wrapper";

  // Create main button with icon that opens dropdown
  const mainButton = document.createElement("button");
  mainButton.className = "artdeco-button artdeco-button--2 artdeco-button--tertiary";
  mainButton.innerHTML = `
    <span class="artdeco-button__text">
      <span class="ai-button-text">AI Reply</span>
      <span class="ai-button-icon">✨</span>
    </span>
  `;

  // Create dropdown menu
  const dropdown = document.createElement("div");
  dropdown.className = "ai-dropdown";
  dropdown.innerHTML = `
    <div class="ai-dropdown-content">
      ${Object.entries(RESPONSE_STYLES).map(([value, style]) => `
        <button class="ai-dropdown-item" data-style="${value}">
          <span class="ai-dropdown-icon">${style.icon}</span>
          <span class="ai-dropdown-text">${style.name}</span>
        </button>
      `).join('')}
    </div>
  `;

  buttonWrapper.appendChild(mainButton);
  buttonWrapper.appendChild(dropdown);
  actionBar.appendChild(buttonWrapper);

  // Toggle dropdown
  mainButton.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  // Handle style selection
  dropdown.querySelectorAll(".ai-dropdown-item").forEach(button => {
    button.addEventListener("click", () => {
      const style = RESPONSE_STYLES[button.dataset.style];
      handleAIButtonClick(article, mainButton, style);
      dropdown.classList.remove("show");
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!buttonWrapper.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });
}