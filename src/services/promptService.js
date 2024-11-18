class PromptService {
    static BANNED_PATTERNS = [
      // Generic openings
      "In today's world",
      "In a world where",
      "In this digital age",
      "As we navigate",
      "Let's dive into",
      
      // Business jargon
      "game-changing",
      "cutting-edge",
      "revolutionary",
      "innovative solution",
      "seamlessly",
      "streamline",
      "optimize",
      "leverage",
      "synergy",
      
      // False expertise
      "as an expert in",
      "as a professional",
      "in my professional opinion",
      "based on my experience",
      
      // Vague intensifiers
      "very",
      "extremely",
      "incredibly",
      "truly",
      "absolutely",
      
      // Corporate speak
      "best practices",
      "thought leadership",
      "value proposition",
      "core competency",
      "deliverables",
      
      // False urgency
      "don't miss out",
      "act now",
      "you can't afford to",
      "now more than ever",
      "time is running out"
    ];
  
    static validateResponse(response) {
      return !this.BANNED_PATTERNS.some(pattern => 
        response.toLowerCase().includes(pattern.toLowerCase())
      );
    }
  
    static sanitizeUserInput(text) {
      return text.trim()
        .replace(/\s+/g, ' ')
        .slice(0, 500); // Limit input length
    }
  }