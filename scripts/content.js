var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
      if (!mutation.addedNodes) {
          return;
      }
      for (var i = 0; i < mutation.addedNodes.length; i++) {
          if (mutation.addedNodes[i].classList !== undefined && mutation.addedNodes[i].classList.contains("feed-shared-update-v2")) {
            const article = mutation.addedNodes[i];
            createAIResponsebutton(article);
          }
      }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});


function fetchAiReply(article) {
  const articleText = article.querySelector(".update-components-text").textContent;
  const aiButton = article.querySelector(".artdeco-button"); // Get the AI response button

  // Show loading spinner
  aiButton.innerHTML = `<span class="spinner"></span>`;

  // Generate the banned patterns list for prompt
  const bannedPatternsString = PromptService.BANNED_PATTERNS.join(", ");
  
  const messages = [
    {
      role: "system",
      content: `You are LinkedInAI, a LinkedIn bot that replies to posts in a clever, engaging, and fun way. Keep responses under 200 characters.`,
    },
    {
      role: "user",
      content: `I am going to give you a post from a LinkedIn friend that I would like to respond to. I want you to understand the tone and write a relevant response. No hashtags. Don't be too stimulating, but be engaging. Make the post more engaging. Avoid the following phrases: ${bannedPatternsString}. Here is the post:`,
    },
    {
      role: "system",
      content: "OK, send me the post, and I will generate the response without using any of the listed phrases.",
    },
    {
      role: "user",
      content: articleText,
    },
  ];
  
  getCompletion(messages, article)
    .then(() => {
      // Revert button to original content once response is received
      aiButton.innerHTML = `<img src="https://static-00.iconduck.com/assets.00/sparkles-icon-93x96-36pqk69z.png" 
        loading="lazy" class="icon loaded" alt="AI Response" title="AI Response" style="margin-right: 4px; max-width: 22px; max-height: 22px;">
        <span class="artdeco-button__text social-action-button__text">TotoAI</span>`;
    })
    .catch(error => {
      console.error("Error:", error);
      // Revert button to original content in case of an error
      aiButton.innerHTML = `<img src="https://static-00.iconduck.com/assets.00/sparkles-icon-93x96-36pqk69z.png" 
        loading="lazy" class="icon loaded" alt="AI Response" title="AI Response" style="margin-right: 4px; max-width: 22px; max-height: 22px;">
        <span class="artdeco-button__text social-action-button__text">TotoAI</span>`;
    });
}

async function createAIResponsebutton(article) {
  const actionBar = article.querySelector(".feed-shared-social-action-bar");
  if (!actionBar) {
    console.warn("Action bar not found in this article element.");
    return;
  }

  const aiButtonWrapper = document.createElement("div");
  aiButtonWrapper.classList.add("feed-shared-social-action-bar__action-button");

  const aiButton = document.createElement("button");
  aiButton.classList.add("social-actions-button", "artdeco-button", "artdeco-button--4", "artdeco-button--tertiary", "flex-wrap", "artdeco-button--muted", "send-privately-button");
  aiButton.innerHTML = `
    <img src="https://static-00.iconduck.com/assets.00/sparkles-icon-93x96-36pqk69z.png" loading="lazy" class="icon" alt="AI Response" title="AI Response" style="margin-right: 4px; max-width: 22px; max-height: 22px;">
    <span class="artdeco-button__text social-action-button__text">TotoAI</span>
  `;

  aiButton.addEventListener("click", async () => {
    console.log("AI Button clicked:", aiButton);

    // Save the original content
    const originalContent = aiButton.innerHTML;

    // Show spinner icon in the button itself
    aiButton.innerHTML = `<div class="spinner"></div>`;

    // Wait for the AI reply to be fetched
    await fetchAiReply(article);

    // Revert button back to original icon and text after the response
    aiButton.innerHTML = originalContent;
  });

  aiButtonWrapper.appendChild(aiButton);
  actionBar.appendChild(aiButtonWrapper);
}

// Add CSS for spinner dynamically
const styleElement = document.createElement("style");
styleElement.textContent = `
  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    display: inline-block;
    vertical-align: middle;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleElement);



async function setCommentReply(data, article) {
  const comment = data.choices[0].message.content;
  article.querySelector(".comment-button").click();
  setInterval(() => {
    article.querySelector(".ql-editor").querySelector("p").textContent = comment;
  }, 1000);

}

 async function getCompletion(messages, article) {
    const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer sk-proj-69gOaIDBA7DyWVIlo`,
          },
          body: JSON.stringify({
            messages: messages,
            max_tokens: 500,
            temperature: 0.7,
            model: "gpt-4o",
          }),
        }).then((res) => {
            return res.json();
        }).then((data) => {
            setCommentReply(data, article);
        }).catch((error) => {
          console.error("Error:", error);
        });
    return response;
  }

  class PromptService {
    /**
     * Comprehensive list of patterns that indicate AI/marketing slop
     */
    static BANNED_PATTERNS = [
        // Generic openings & transitions
        "In today's world",
        "In a world where",
        "In this digital age",
        "In the ever-evolving",
        "As we navigate",
        "In recent years",
        "As technology continues to",
        "Let's dive into",
        "Let's explore",
        "First and foremost",
        "With that being said",
        "Moving forward",
        "In conclusion",
        "To put it simply",
        
        // Time-based clichés
        "in this fast-paced",
        "rapidly evolving",
        "dynamic landscape",
        "changing landscape",
        "digital transformation",
        "paradigm shift",
        
        // Marketing fluff
        "game-changing",
        "cutting-edge",
        "revolutionary",
        "innovative solution",
        "seamlessly",
        "streamline",
        "optimize",
        "leverage",
        "synergy",
        "ecosystem",
        "empower",
        "utilize",
        "state-of-the-art",
        "next-generation",
        "best-in-class",
        "robust",
        
        // False wisdom
        "it goes without saying",
        "at the end of the day",
        "the reality is",
        "needless to say",
        "the key takeaway",
        "the bottom line",
        "the fact of the matter",
        "truth be told",
        
        // False insight markers
        "interestingly",
        "crucially",
        "importantly",
        "fundamentally",
        "essentially",
        "notably",
        "significantly",
        "clearly",
        
        // Expert posturing
        "as an expert in",
        "as a professional",
        "in my professional opinion",
        "based on my experience",
        "as someone who",
        "in my years of",
        "what I've learned is",
        "I've come to realize",
        
        // Manufactured drama
        "but wait",
        "here's the thing",
        "but there's a catch",
        "you might be surprised",
        "you won't believe",
        "the secret is",
        
        // Vague intensifiers
        "very",
        "extremely",
        "incredibly",
        "truly",
        "absolutely",
        "definitely",
        "obviously",
        
        // Academic fluff
        "it is interesting to note",
        "it should be noted",
        "according to research",
        "studies have shown",
        "research indicates",
        "evidence suggests",
        
        // Generic structure markers
        "firstly",
        "secondly",
        "thirdly",
        "last but not least",
        "in summary",
        "to conclude",
        
        // Corporate speak
        "best practices",
        "thought leadership",
        "value proposition",
        "core competency",
        "mission-critical",
        "deliverables",
        "actionable insights",
        
        // False urgency
        "don't miss out",
        "act now",
        "you can't afford to",
        "now more than ever",
        "time is running out",
    ];
}
