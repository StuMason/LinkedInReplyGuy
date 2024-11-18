class AIService {
    static API_URL = "https://api.openai.com/v1/chat/completions";
    static MODEL = "gpt-4";
  
    static async generateResponse(text) {
      const messages = [
        {
          role: "system",
          content: "You are LinkedInAI, a LinkedIn bot that replies to posts in a clever, engaging, and fun way. Keep responses under 200 characters."
        },
        {
          role: "user",
          content: `Write a relevant response. Avoid: ${PromptService.BANNED_PATTERNS.join(", ")}. Post: ${text}`
        }
      ];
  
      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await this.getApiKey()}`
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages,
          max_tokens: 500,
          temperature: 0.7
        })
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      const data = await response.json();
      return data.choices[0].message.content;
    }
  
    static async getApiKey() {
      const result = await chrome.storage.sync.get("openai_api_key");
      if (!result.openai_api_key) {
        throw new Error("OpenAI API key not found");
      }
      return result.openai_api_key;
    }
  }